import { renderHook, act } from '@testing-library/react';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';

jest.useFakeTimers();

const pushMock = jest.fn();
const replaceMock = jest.fn();
let pathnameMock = '/';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
  usePathname: () => pathnameMock,
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
  pathnameMock = '/';

  global.fetch = jest.fn();

  window.Telegram = {
    WebApp: {
      initData: 'test-init-data',
    },
  };

  jest.spyOn(window, 'dispatchEvent').mockImplementation(() => true);
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('не запускает авторизацию если Telegram WebApp недоступен', async () => {
  delete window.Telegram;

  const { result } = renderHook(() => useTelegramAuth());

  await act(async () => {
    jest.runAllTimers();
  });

  expect(fetch).not.toHaveBeenCalled();
  expect(result.current.loading).toBe(false);
});

test('не запускает авторизацию если нет initData', async () => {
  window.Telegram.WebApp.initData = '';

  const { result } = renderHook(() => useTelegramAuth());

  await act(async () => {
    jest.runAllTimers();
  });

  expect(fetch).not.toHaveBeenCalled();
  expect(result.current.loading).toBe(false);
});

test('не запускает авторизацию если access_token уже есть', async () => {
  localStorage.setItem('access_token', 'token');

  const { result } = renderHook(() => useTelegramAuth());

  await act(async () => {
    jest.runAllTimers();
  });

  expect(fetch).not.toHaveBeenCalled();
  expect(result.current.loading).toBe(false);
});

test('не запускает авторизацию если пользователь вышел намеренно', async () => {
  sessionStorage.setItem('user_logged_out', 'true');

  const { result } = renderHook(() => useTelegramAuth());

  await act(async () => {
    jest.runAllTimers();
  });

  expect(fetch).not.toHaveBeenCalled();
  expect(result.current.loading).toBe(false);
});

test('успешно авторизуется через Telegram', async () => {
  pathnameMock = '/';
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      access_token: 'new-token',
    }),
  });

  const { result } = renderHook(() => useTelegramAuth());

  await act(async () => {
    jest.runAllTimers();
    // Даем время для завершения промисов
    await Promise.resolve();
  });

  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining('/api/auth/telegram/login'),
    expect.objectContaining({
      method: 'POST',
      credentials: 'include',
    }),
  );

  expect(localStorage.getItem('access_token')).toBe('new-token');
  expect(localStorage.getItem('tokenExpiresAt')).toBeTruthy();
  expect(sessionStorage.getItem('user_logged_out')).toBeNull();
  expect(window.dispatchEvent).toHaveBeenCalled();
  expect(result.current.loading).toBe(false);
});

test('перенаправляет на главную со страницы /login после успешной авторизации', async () => {
  pathnameMock = '/login';

  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      access_token: 'new-token',
    }),
  });

  const { result } = renderHook(() => useTelegramAuth());

  await act(async () => {
    jest.runAllTimers();
    await Promise.resolve();
  });

  expect(fetch).toHaveBeenCalled();
  expect(replaceMock).toHaveBeenCalledWith('/');
  expect(result.current.loading).toBe(false);
});

test('обрабатывает ошибку авторизации', async () => {
  fetch.mockResolvedValueOnce({
    ok: false,
    status: 401,
  });

  const { result } = renderHook(() => useTelegramAuth());

  await act(async () => {
    jest.runAllTimers();
    await Promise.resolve();
  });

  expect(result.current.error).toBeTruthy();
  expect(result.current.loading).toBe(false);
  expect(localStorage.getItem('access_token')).toBeNull();
});

test('обрабатывает отсутствие access_token в ответе', async () => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({}), // нет access_token
  });

  const { result } = renderHook(() => useTelegramAuth());

  await act(async () => {
    jest.runAllTimers();
    await Promise.resolve();
  });

  expect(result.current.error).toBeTruthy();
  expect(result.current.loading).toBe(false);
  expect(localStorage.getItem('access_token')).toBeNull();
});
