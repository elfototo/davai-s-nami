import { cookies, headers } from 'next/headers';
import { CLIENT_CONTEXT_COOKIE, withContextHeaders } from './clientContext';

function readCookieContext() {
  try {
    const raw = cookies().get(CLIENT_CONTEXT_COOKIE)?.value;
    if (!raw) return {};
    const { user_id, tg_id, session } = JSON.parse(decodeURIComponent(raw));
    return { user_id, tg_id, session };
  } catch {
    return {};
  }
}

// IP пользователя из входящего запроса (первый адрес в x-forwarded-for)
export function getRequestIp() {
  const h = headers();
  return (
    h.get('x-forwarded-for')?.split(',')[0].trim() ||
    h.get('x-real-ip') ||
    undefined
  );
}

// Контекст для SSR-запросов: IP и user-agent берём из входящего запроса,
// id пользователя — из куки client_ctx (её ставит браузер)
export function getServerClientContext() {
  return {
    app: 'webapp',
    ...readCookieContext(),
    ip: getRequestIp(),
    ssr: true,
    ua: headers().get('user-agent')?.slice(0, 300) || undefined,
  };
}

export function withServerClientContext(baseHeaders = {}) {
  const ctx = getServerClientContext();
  const result = withContextHeaders(baseHeaders, ctx);
  if (ctx.ip) result['X-Forwarded-For'] = ctx.ip;
  return result;
}
