import { renderHook, act } from '@testing-library/react';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';

jest.useFakeTimers();

const pushMock = jest.fn();
let pathnameMock = '/';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  usePathname: () => pathnameMock,
}));

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
  sessionStorage.clear();

  global.fetch = jest.fn();

  window.Telegram = {
    WebApp: {
      initData: 'test-init-data',
    },
  };

  jest.spyOn(window, 'dispatchEvent').mockImplementation(() => {});
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
  expect(window.dispatchEvent).toHaveBeenCalled();
  expect(result.current.loading).toBe(false);
});

test('не запускает автовход на странице login', async () => {
  pathnameMock = '/login';
  const { result } = renderHook(() => useTelegramAuth());

  await act(async () => {
    jest.runAllTimers();
  });

  expect(fetch).not.toHaveBeenCalled();
  expect(result.current.loading).toBe(false);
});
