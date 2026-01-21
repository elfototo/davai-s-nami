jest.mock('@/utils/redirect', () => ({
  redirectToLogin: jest.fn(),
}));

import { API_URL1 } from '../../../config';
import { useTokenRefresh } from '../../../hooks/useTokenRefresh';
import { renderHook, waitFor } from '@testing-library/react';
import { redirectToLogin } from '../../../utils/redirect';

jest.mock('../../../config', () => ({
  API_URL1: 'https://api.example.com/',
}));

describe(useTokenRefresh, () => {
  let originalFetch;
  let setTimeoutSpy;
  let clearTimeoutSpy;

  beforeEach(() => {
    jest.useFakeTimers();

    originalFetch = global.fetch;
    global.fetch = jest.fn();

    // сохраняем оригинальный location
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    localStorage.clear();
  });

  afterEach(() => {
    global.fetch = originalFetch;

    setTimeoutSpy?.mockRestore();
    clearTimeoutSpy?.mockRestore();
    consoleErrorSpy.mockRestore();

    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('Token refresh Success', () => {
    test('Refresh token получен, запланирован следающий refresh token', async () => {
      const mockAccessToken = 'new_access_token_123';

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: mockAccessToken }),
      });

      const { result } = renderHook(() => useTokenRefresh());

      await result.current.refreshToken();

      await waitFor(() => {
        expect(localStorage.getItem('access_token')).toBe(mockAccessToken);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL1}api/auth/refresh`,
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );

      const expiresAt = localStorage.getItem('tokenExpiresAt');
      expect(expiresAt).toBeTruthy();

      const expiryTime = parseInt(expiresAt);
      const expectedTime = Date.now() + 30 * 60 * 1000;
      expect(expiryTime).toBeGreaterThanOrEqual(expectedTime - 1000);
      expect(expiryTime).toBeLessThanOrEqual(expectedTime + 1000);
    });

    test('Обновление следует запланировать за 25 минут до истечения срока действия.', async () => {
      const mockAccessToken = 'new_access_token_456';

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: mockAccessToken }),
      });

      const { result } = renderHook(() => useTokenRefresh());

      await result.current.refreshToken();

      await waitFor(() => {
        expect(localStorage.getItem('access_token')).toBe(mockAccessToken);
      });

      // Проверяем, что таймер установлен на 25 минут
      expect(setTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        25 * 60 * 1000,
      );
    });
  });

  describe('Сбой Token Refresh', () => {
    test('Следует обрабатывать неудачные попытки обновления и перенаправлять на страницу входа в систему', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        })
        .mockResolvedValueOnce({
          ok: true,
        });

      const { result } = renderHook(() => useTokenRefresh());

      localStorage.setItem('access_token', 'old_token');
      localStorage.setItem('tokenExpiresAt', (Date.now() + 1000).toString());

      await result.current.refreshToken();

      await waitFor(() => {
        expect(localStorage.getItem('access_token')).toBeNull();
        expect(localStorage.getItem('tokenExpiresAt')).toBeNull();
        expect(redirectToLogin).toHaveBeenCalled();
      });

      // Проверяем вызов logout
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL1}api/auth/refresh`,
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        }),
      );
    });

    test('должна обрабатывать сетевые ошибки во время обновления.', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      const { result } = renderHook(() => useTokenRefresh());

      localStorage.setItem('access_token', 'old_token');

      await result.current.refreshToken();

      await waitFor(() => {
        expect(localStorage.getItem('access_token')).toBeNull();
        expect(redirectToLogin).toHaveBeenCalled();
      });
    });

    test('следует корректно обрабатывать ошибки выхода из системы.', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
        })
        .mockRejectedValueOnce(new Error('Logout failed'));

      const { result } = renderHook(() => useTokenRefresh());

      await result.current.refreshToken();

      await waitFor(() => {
        expect(redirectToLogin).toHaveBeenCalled();
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Logout request failed'),
        expect.any(Error),
      );
    });
  });

  describe('Проверка срока действия Token', () => {
    test('Обновление следует запланировать на момент, когда токен станет действительным.', () => {
      const expiresAt = Date.now() + 30 * 60 * 1000; // 30 минут
      localStorage.setItem('access_token', 'valid_token');
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());

      const { result } = renderHook(() => useTokenRefresh());

      result.current.checkAndScheduleRefresh();

      // Должен запланировать обновление за 5 минут до истечения
      const expectedDelay = 25 * 60 * 1000; // 25 минут
      expect(setTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        25 * 60 * 1000,
      );
    });

    test('Если срок действия токена истек, обновление должно произойти немедленно', async () => {
      const expiresAt = Date.now() - 1000; // Истёк 1 секунду назад
      localStorage.setItem('access_token', 'expired_token');
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'new_token' }),
      });

      const { result } = renderHook(() => useTokenRefresh());

      result.current.checkAndScheduleRefresh();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          `${API_URL1}api/auth/refresh`,
          expect.any(Object),
        );
      });
    });

    test('Если срок действия токена истекает менее чем через 5 минут, обновление должно произойти немедленно.', async () => {
      const expiresAt = Date.now() + 3 * 60 * 1000; // 3 минуты
      localStorage.setItem('access_token', 'soon_expired_token');
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ access_token: 'refreshed_token' }),
      });

      const { result } = renderHook(() => useTokenRefresh());

      result.current.checkAndScheduleRefresh();

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    test('Если значение не найдено, следует установить срок действия по умолчанию.', () => {
      localStorage.setItem('access_token', 'token_without_expiry');

      const { result } = renderHook(() => useTokenRefresh());

      result.current.checkAndScheduleRefresh();

      const expiresAt = localStorage.getItem('tokenExpiresAt');
      expect(expiresAt).toBeTruthy();

      const expiryTime = parseInt(expiresAt);
      const expectedTime = Date.now() + 30 * 60 * 1000;
      expect(expiryTime).toBeGreaterThanOrEqual(expectedTime - 1000);
    });

    test('Планирование следует пропустить, если нет токена доступа.', () => {
      const { result } = renderHook(() => useTokenRefresh());

      result.current.checkAndScheduleRefresh();

      expect(setTimeout).not.toHaveBeenCalled();
    });
  });

  describe('Жизненный цикл хука', () => {
    test('Необходимо инициализировать расписание обновления на точке монтирования с помощью токена.', () => {
      const expiresAt = Date.now() + 30 * 60 * 1000;
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());

      renderHook(() => useTokenRefresh());

      expect(setTimeout).toHaveBeenCalled();
    });

    test('Не следует планировать обновление на точке монтирования без токена.', () => {
      renderHook(() => useTokenRefresh());

      expect(setTimeout).not.toHaveBeenCalled();
    });

    test('Следует очистить таймаут при размонтировании.', () => {
      const expiresAt = Date.now() + 30 * 60 * 1000;
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());

      const { unmount } = renderHook(() => useTokenRefresh());

      const timeoutId = setTimeout.mock.results[0]?.value;

      unmount();

      expect(clearTimeout).toHaveBeenCalledWith(timeoutId);
    });
  });

  describe('Синхронизация событий хранилища', () => {
    test('Следует перенести обновление на другое время при изменении токена в другой вкладке.', () => {
      const expiresAt = Date.now() + 30 * 60 * 1000;
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());

      renderHook(() => useTokenRefresh());

      // Симулируем изменение token в другой вкладке
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: 'tokenExpiresAt',
          newValue: `${Date.now() + 30 * 60 * 1000}`,
        }),
      );

      // Должен быть вызван новый setTimeout
      expect(setTimeout).toHaveBeenCalledTimes(2);
    });

    test('Следует игнорировать события хранения для других ключей.', () => {
      renderHook(() => useTokenRefresh());

      const initialCallCount = setTimeout.mock.calls.length;

      const storageEvent = new StorageEvent('storage', {
        key: 'other_key',
        newValue: 'some_value',
      });

      window.dispatchEvent(storageEvent);

      expect(setTimeout).toHaveBeenCalledTimes(initialCallCount);
    });

    test('Событие сохранения следует игнорировать, если токен удален.', () => {
      renderHook(() => useTokenRefresh());

      const initialCallCount = setTimeout.mock.calls.length;

      const storageEvent = new StorageEvent('storage', {
        key: 'access_token',
        newValue: null,
      });

      window.dispatchEvent(storageEvent);

      expect(setTimeout).toHaveBeenCalledTimes(initialCallCount);
    });
  });

  describe('Очистить предыдущий таймаут', () => {
    test('При планировании нового обновления необходимо сбросить предыдущий таймаут', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: 'token' }),
      });

      const { result } = renderHook(() => useTokenRefresh());

      await result.current.refreshToken();
      const firstTimeoutId = setTimeout.mock.results[0]?.value;

      await result.current.refreshToken();

      expect(clearTimeout).toHaveBeenCalledWith(firstTimeoutId);
    });
  });

  describe('Крайние случаи', () => {
    test('следует обрабатывать недействительную метку времени истечения срока действия', () => {
      localStorage.setItem('access_token', 'token');
      localStorage.setItem('tokenExpiresAt', 'invalid_timestamp');

      const { result } = renderHook(() => useTokenRefresh());

      result.current.checkAndScheduleRefresh();

      // Должен установить значение по умолчанию
      const expiresAt = localStorage.getItem('tokenExpiresAt');
      expect(expiresAt).toBeTruthy();
      expect(Number.isNaN(parseInt(expiresAt))).toBe(false);
    });

    test('должен обрабатывать одновременные вызовы обновления.', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ access_token: 'token' }),
      });

      const { result } = renderHook(() => useTokenRefresh());

      // Вызываем два раза подряд
      const promise1 = result.current.refreshToken();
      const promise2 = result.current.refreshToken();

      await Promise.all([promise1, promise2]);

      // Проверяем, что fetch был вызван только ОДИН раз (защита от дублирования)
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Проверяем, что токен успешно сохранён
      expect(localStorage.getItem('access_token')).toBe('token');

      // Проверяем, что установлен таймер для следующего обновления
      expect(setTimeout).toHaveBeenCalledWith(
        expect.any(Function),
        25 * 60 * 1000,
      );
    });
  });
});
