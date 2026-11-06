// Контекст клиента для логов бэкенда: заголовок X-Client-Context в каждом запросе.
// Ключи совпадают с ботом: app, user_id, tg_id, ip, session (+ необязательные доп. поля).
// Только ASCII и не больше 2 КБ.

export const CLIENT_CONTEXT_HEADER = 'X-Client-Context';
export const CLIENT_CONTEXT_COOKIE = 'client_ctx';
const SESSION_KEY = 'client_session';
const MAX_HEADER_SIZE = 2048;

// IP пользователя: браузер его не знает, поэтому получаем от сервера (app/layout.js)
let clientIp;

export function setClientIp(ip) {
  if (ip) clientIp = ip;
}

// Кириллицу и прочий не-ASCII заменяем на \uXXXX — иначе fetch не отправит заголовок
export function toAsciiJson(obj) {
  return JSON.stringify(obj).replace(
    new RegExp('[\\u0080-\\uffff]', 'g'),
    (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'),
  );
}

// Сериализует контекст; если не влезает в 2 КБ — оставляем только основные ключи
export function serializeClientContext(ctx) {
  const json = toAsciiJson(ctx);
  if (json.length <= MAX_HEADER_SIZE) return json;

  const { app, user_id, tg_id, ip, session } = ctx;
  return toAsciiJson({ app, user_id, tg_id, ip, session });
}

export function withContextHeaders(headers = {}, ctx) {
  return {
    ...headers,
    [CLIENT_CONTEXT_HEADER]: serializeClientContext(ctx),
  };
}

// user_id из access_token (JWT), без проверки подписи — только для логов
function getUserIdFromToken(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const data = JSON.parse(atob(payload));
    return data.user_id ?? data.sub ?? data.id;
  } catch {
    return undefined;
  }
}

// Случайный id сессии, живёт пока открыта вкладка
function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return undefined;
  }
}

export function getBrowserClientContext() {
  if (typeof window === 'undefined') return { app: 'webapp' };

  const telegram = window.Telegram?.WebApp;
  let token = null;
  try {
    token = localStorage.getItem('access_token');
  } catch {}

  const ctx = {
    app: 'webapp',
    user_id: token ? getUserIdFromToken(token) : undefined,
    tg_id: telegram?.initDataUnsafe?.user?.id,
    ip: clientIp,
    session: getSessionId(),
    path: window.location.pathname,
    tg_platform: telegram?.initData ? telegram.platform : undefined,
  };

  // Кладём id в куку, чтобы SSR-запросы тоже знали, кто пользователь
  const { user_id, tg_id, session } = ctx;
  const cookieValue = encodeURIComponent(
    toAsciiJson({ user_id, tg_id, session }),
  );
  if (!document.cookie.includes(`${CLIENT_CONTEXT_COOKIE}=${cookieValue}`)) {
    document.cookie = `${CLIENT_CONTEXT_COOKIE}=${cookieValue}; path=/; SameSite=Lax`;
  }

  return ctx;
}

// Заголовки для запросов из браузера. IP — только внутри X-Client-Context,
// без X-Forwarded-For (лишний заголовок пришлось бы разрешать в CORS)
export function withClientContext(headers = {}) {
  return withContextHeaders(headers, getBrowserClientContext());
}
