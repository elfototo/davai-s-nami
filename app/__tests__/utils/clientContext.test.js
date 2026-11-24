import {
  toAsciiJson,
  serializeClientContext,
  withClientContext,
  setClientIp,
  CLIENT_CONTEXT_HEADER,
  CLIENT_CONTEXT_COOKIE,
} from '../../../utils/clientContext';

const makeToken = (payload) =>
  `x.${btoa(JSON.stringify(payload)).replace(/=+$/, '')}.y`;

describe('toAsciiJson', () => {
  test('заменяет кириллицу на \\uXXXX', () => {
    const json = toAsciiJson({ name: 'Мир' });
    expect(json).toBe('{"name":"\\u041c\\u0438\\u0440"}');
    expect(/^[\x00-\x7f]*$/.test(json)).toBe(true);
    expect(JSON.parse(json)).toEqual({ name: 'Мир' });
  });

  test('undefined-ключи выпадают', () => {
    expect(toAsciiJson({ app: 'webapp', tg_id: undefined })).toBe(
      '{"app":"webapp"}',
    );
  });
});

describe('serializeClientContext', () => {
  test('обрезает до основных ключей, если больше 2 КБ', () => {
    const json = serializeClientContext({
      app: 'webapp',
      tg_id: 1,
      ua: 'x'.repeat(3000),
    });
    expect(JSON.parse(json)).toEqual({ app: 'webapp', tg_id: 1 });
  });
});

describe('withClientContext', () => {
  afterEach(() => {
    delete window.Telegram;
    localStorage.clear();
    sessionStorage.clear();
  });

  test('добавляет tg_id, user_id и session, не теряя исходные заголовки', () => {
    window.Telegram = {
      WebApp: {
        initData: 'q',
        platform: 'ios',
        initDataUnsafe: { user: { id: 42 } },
      },
    };
    localStorage.setItem('access_token', makeToken({ sub: '7' }));

    const headers = withClientContext({ Authorization: 'key' });
    const ctx = JSON.parse(headers[CLIENT_CONTEXT_HEADER]);

    expect(headers.Authorization).toBe('key');
    expect(headers['X-Forwarded-For']).toBeUndefined();
    expect(ctx).toMatchObject({
      app: 'webapp',
      user_id: '7',
      tg_id: 42,
      tg_platform: 'ios',
    });
    expect(ctx.session).toBeTruthy();
    expect(document.cookie).toContain(`${CLIENT_CONTEXT_COOKIE}=`);
  });

  test('передаёт IP, полученный от сервера', () => {
    setClientIp('203.0.113.5');
    const headers = withClientContext();
    expect(JSON.parse(headers[CLIENT_CONTEXT_HEADER]).ip).toBe('203.0.113.5');
    expect(headers['X-Forwarded-For']).toBeUndefined();
  });

  test('session одинаковый между запросами', () => {
    const a = JSON.parse(withClientContext()[CLIENT_CONTEXT_HEADER]);
    const b = JSON.parse(withClientContext()[CLIENT_CONTEXT_HEADER]);
    expect(a.session).toBe(b.session);
    expect(a.tg_id).toBeUndefined();
  });
});
