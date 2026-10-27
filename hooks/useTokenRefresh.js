// 'use client';

// import { useEffect, useRef } from 'react';
// import { API_URL1 } from '../config';
// import { redirectToLogin } from '../utils/redirect';

// const isDev = process.env.NODE_ENV === 'development';

// const log = {
//   info: (message, data = {}) => {
//     if (isDev) console.log(`[Token Timer] ℹ️ ${message}`, data);
//   },
//   success: (message, data = {}) => {
//     if (isDev) console.log(`[Token Timer] ✅ ${message}`, data);
//   },
//   error: (message, data = {}) => {
//     console.error(`[Token Timer] ❌ ${message}`, data);
//   },
//   warn: (message, data = {}) => {
//     if (isDev) console.warn(`[Token Timer] ⚠️ ${message}`, data);
//   },
// };

// export const useTokenRefresh = () => {
//   const refreshTimeoutRef = useRef(null);
//   const isRefreshingRef = useRef(false);
//   const refreshPromiseRef = useRef(null);

//   // const refreshToken = async () => {
//   //   // if (refreshTimeoutRef.current) {
//   //   //   clearTimeout(refreshTimeoutRef.current);
//   //   //   refreshTimeoutRef.current = null;
//   //   // }

//   //   if (isRefreshingRef.current) {
//   //     await refreshPromiseRef.current;
//   //     return;
//   //   }

//   //   isRefreshingRef.current = true;

//   //   log.info('Starting proactive token refresh');

//   //   refreshPromiseRef.current = (async () => {
//   //     try {
//   //       log.info('Sending refresh request (refresh_token в httpOnly cookie)');

//   //       // refresh_token автоматически отправится в httpOnly cookie
//   //       const response = await fetch(`${API_URL1}api/auth/refresh`, {
//   //         method: 'POST',
//   //         credentials: 'include', // 🔑 КРИТИЧЕСКИ ВАЖНО для отправки httpOnly cookie
//   //         headers: {
//   //           'Content-Type': 'application/json',
//   //         },
//   //       });

//   //       if (!response.ok) {
//   //         log.error('Refresh request failed', { status: response.status });
//   //         throw new Error('Refresh failed');
//   //       }

//   //       const data = await response.json();

//   //       log.success('Received new access token from API', {
//   //         hasAccessToken: !!data.access_token,
//   //       });

//   //       // Сохраняем только access_token
//   //       // refresh_token уже автоматически обновлён backend'ом в httpOnly cookie
//   //       localStorage.setItem('access_token', data.access_token);

//   //       // Записываем время истечения (30 минут)
//   //       // const expiresAt = Date.now() + 30 * 60 * 1000;
//   //       // const safeExpiresAt = Number.isFinite(expiresAt)
//   //       //   ? expiresAt
//   //       //   : Date.now() + 30 * 60 * 1000;

//   //       // localStorage.setItem('tokenExpiresAt', safeExpiresAt.toString());

//   //       const rawExpiresAt = localStorage.getItem('tokenExpiresAt');
//   //       const parsedExpiresAt = Number(rawExpiresAt);

//   //       const now = Date.now();
//   //       const safeExpiresAt =
//   //         Number.isFinite(parsedExpiresAt) && parsedExpiresAt > now
//   //           ? parsedExpiresAt
//   //           : now + 30 * 60 * 1000;

//   //       localStorage.setItem('tokenExpiresAt', String(safeExpiresAt));

//   //       log.success('Token refreshed successfully', {
//   //         expiresAt: new Date(safeExpiresAt).toLocaleString(),
//   //         nextRefreshIn: '25 minutes',
//   //       });

//   //       // Обновляем за 5 минут до истечения (через 25 минут)
//   //       scheduleRefresh(25 * 60 * 1000);
//   //     } catch (error) {
//   //       // log.error('Token refresh failed, clearing session', error);

//   //       // // Очищаем localStorage
//   //       localStorage.removeItem('access_token');
//   //       localStorage.removeItem('tokenExpiresAt');

//   //       log.error('Token refresh failed', {
//   //         message: error?.message,
//   //       });

//   //       // Опционально: вызываем logout для очистки httpOnly cookie на сервере
//   //       try {
//   //         await fetch(`${API_URL1}api/auth/logout`, {
//   //           method: 'POST',
//   //           credentials: 'include',
//   //         });
//   //       } catch (logoutError) {
//   //         log.error('Logout request failed', logoutError);
//   //       }

//   //       redirectToLogin();
//   //     } finally {
//   //       isRefreshingRef.current = false;
//   //       refreshPromiseRef.current = null;
//   //       if (refreshTimeoutRef.current) {
//   //         clearTimeout(refreshTimeoutRef.current);
//   //       }

//   //       scheduleRefresh(25 * 60 * 1000);
//   //     }
//   //   })();

//   //   return refreshPromiseRef.current;
//   // };

//   const refreshToken = async () => {
//     if (isRefreshingRef.current) {
//       await refreshPromiseRef.current;
//       return;
//     }

//     isRefreshingRef.current = true;
//     log.info('Starting proactive token refresh');

//     refreshPromiseRef.current = (async () => {
//       try {
//         const response = await fetch(`${API_URL1}api/auth/refresh`, {
//           method: 'POST',
//           credentials: 'include',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Refresh failed');
//         }

//         const data = await response.json();

//         // ✅ Сохраняем новый токен
//         localStorage.setItem('access_token', data.access_token);

//         // ✅ Устанавливаем НОВОЕ время истечения (30 минут от сейчас)
//         const newExpiresAt = Date.now() + 30 * 60 * 1000;
//         localStorage.setItem('tokenExpiresAt', newExpiresAt.toString());

//         log.success('Token refreshed successfully', {
//           expiresAt: new Date(newExpiresAt).toLocaleString(),
//         });

//         // ✅ Планируем следующий refresh за 5 минут до истечения
//         scheduleRefresh(25 * 60 * 1000);
//       } catch (error) {
//         log.error('Token refresh failed', { message: error?.message });

//         // Очищаем данные
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('tokenExpiresAt');

//         // Пытаемся вызвать logout на бэкенде
//         try {
//           await fetch(`${API_URL1}api/auth/logout`, {
//             method: 'POST',
//             credentials: 'include',
//           });
//         } catch (logoutError) {
//           log.error('Logout request failed', logoutError);
//         }

//         // ✅ Редирект на логин (после этого НЕ должно быть новых запросов!)
//         redirectToLogin();
//       } finally {
//         isRefreshingRef.current = false;
//         refreshPromiseRef.current = null;
//         // ❌ УБРАЛИ scheduleRefresh отсюда!
//       }
//     })();

//     return refreshPromiseRef.current;
//   };
//   const scheduleRefresh = (delay) => {
//     if (refreshTimeoutRef.current) {
//       clearTimeout(refreshTimeoutRef.current);
//       log.info('Cleared previous refresh timeout');
//     }

//     const delayMinutes = Math.round(delay / 60000);
//     log.info(`Scheduling next refresh in ${delayMinutes} minutes`, {
//       delayMs: delay,
//       scheduledFor: new Date(Date.now() + delay).toLocaleString(),
//     });

//     refreshTimeoutRef.current = setTimeout(() => {
//       log.info('Refresh timeout triggered');
//       refreshToken();
//     }, delay);
//   };

//   const checkAndScheduleRefresh = () => {
//     log.info('Checking token expiration status');

//     const expiresAt = localStorage.getItem('tokenExpiresAt');
//     const accessToken = localStorage.getItem('access_token');

//     const parsedExpiresAt = Number(expiresAt);
//     if (!Number.isFinite(parsedExpiresAt)) {
//       const fallback = Date.now() + 30 * 60 * 1000;
//       localStorage.setItem('tokenExpiresAt', fallback.toString());
//       scheduleRefresh(25 * 60 * 1000);
//       return;
//     }

//     if (!accessToken) {
//       log.warn('No access token found, skipping refresh scheduling');
//       return;
//     }

//     if (!expiresAt) {
//       log.warn('No expiration time found, setting default (30 min)');
//       // Если нет времени истечения, устанавливаем его
//       const newExpiresAt = Date.now() + 30 * 60 * 1000;
//       localStorage.setItem('tokenExpiresAt', newExpiresAt.toString());
//       scheduleRefresh(25 * 60 * 1000); // Обновить через 25 минут
//       return;
//     }

//     const timeUntilExpiry = parsedExpiresAt - Date.now();
//     const minutesUntilExpiry = Math.round(timeUntilExpiry / 60000);

//     log.info(`Token expires in ${minutesUntilExpiry} minutes`, {
//       expiresAt: new Date(parseInt(expiresAt)).toLocaleString(),
//       timeUntilExpiryMs: timeUntilExpiry,
//     });

//     if (timeUntilExpiry <= 0) {
//       log.warn('Token already expired, refreshing immediately');
//       refreshToken();
//     } else if (timeUntilExpiry < 5 * 60 * 1000) {
//       log.warn('Token expires in less than 5 minutes, refreshing now');
//       refreshToken();
//     } else {
//       // Планируем обновление за 5 минут до истечения
//       const refreshDelay = timeUntilExpiry - 5 * 60 * 1000;
//       scheduleRefresh(refreshDelay);
//     }
//   };

//   useEffect(() => {
//     log.info('Token refresh hook mounted');

//     const token = localStorage.getItem('access_token');

//     if (token) {
//       log.info('Access token found, initializing refresh schedule');
//       checkAndScheduleRefresh();
//     } else {
//       log.warn('No access token found on mount');
//     }

//     // Слушаем события storage для синхронизации между табами
//     const handleStorageChange = (e) => {
//       if (
//         (e.key === 'access_token' && e.newValue) ||
//         (e.key === 'tokenExpiresAt' && e.newValue)
//       ) {
//         log.info('Access token changed in another tab, rescheduling');
//         checkAndScheduleRefresh();
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);

//     return () => {
//       log.info('Token refresh hook unmounting, cleaning up');
//       if (refreshTimeoutRef.current) {
//         clearTimeout(refreshTimeoutRef.current);
//         refreshTimeoutRef.current = null; // ✅ Обнуляем ссылку
//       }
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, []);

//   // Возвращаем функции для тестирования
//   return { refreshToken, checkAndScheduleRefresh };
// };
'use client';

import { useEffect, useRef } from 'react';
import { API_URL1 } from '../config';
import { redirectToLogin } from '../utils/redirect';

const isDev = process.env.NODE_ENV === 'development';

const log = {
  info: (message, data = {}) => {
    if (isDev) console.log(`[Token Timer] ℹ️ ${message}`, data);
  },
  success: (message, data = {}) => {
    if (isDev) console.log(`[Token Timer] ✅ ${message}`, data);
  },
  error: (message, data = {}) => {
    console.error(`[Token Timer] ❌ ${message}`, data);
  },
  warn: (message, data = {}) => {
    if (isDev) console.warn(`[Token Timer] ⚠️ ${message}`, data);
  },
};

const shouldRedirectToLogin = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.location.pathname.startsWith('/dashboard');
};

export const useTokenRefresh = () => {
  const refreshTimeoutRef = useRef(null);
  const isRefreshingRef = useRef(false);
  const refreshPromiseRef = useRef(null);
  const isMountedRef = useRef(false); // ✅ Защита от двойного монтирования

  const scheduleRefresh = (delay) => {
    // ✅ Не планируем refresh если компонент размонтирован
    if (!isMountedRef.current) {
      log.warn('Component unmounted, skipping refresh scheduling');
      return;
    }

    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      log.info('Cleared previous refresh timeout');
    }

    const delayMinutes = Math.round(delay / 60000);
    log.info(`Scheduling next refresh in ${delayMinutes} minutes`, {
      delayMs: delay,
      scheduledFor: new Date(Date.now() + delay).toLocaleString(),
    });

    refreshTimeoutRef.current = setTimeout(() => {
      log.info('Refresh timeout triggered');
      refreshToken();
    }, delay);
  };

  const refreshToken = async () => {
    // ✅ Не обновляем если компонент размонтирован
    if (!isMountedRef.current) {
      log.warn('Component unmounted, skipping refresh');
      return;
    }

    if (isRefreshingRef.current) {
      log.info('Refresh already in progress, waiting...');
      await refreshPromiseRef.current;
      return;
    }

    isRefreshingRef.current = true;
    log.info('Starting proactive token refresh');

    refreshPromiseRef.current = (async () => {
      try {
        log.info('Sending refresh request');

        const response = await fetch(`${API_URL1}api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          log.error('Refresh request failed', { status: response.status });
          throw new Error('Refresh failed');
        }

        const data = await response.json();

        log.success('Received new access token from API', {
          hasAccessToken: !!data.access_token,
        });

        // Сохраняем только access_token
        localStorage.setItem('access_token', data.access_token);

        // ✅ Устанавливаем НОВОЕ время истечения (30 минут от сейчас)
        const newExpiresAt = Date.now() + 30 * 60 * 1000;
        localStorage.setItem('tokenExpiresAt', newExpiresAt.toString());

        log.success('Token refreshed successfully', {
          expiresAt: new Date(newExpiresAt).toLocaleString(),
          nextRefreshIn: '25 minutes',
        });

        // ✅ Планируем следующий refresh за 5 минут до истечения
        scheduleRefresh(25 * 60 * 1000);
      } catch (error) {
        log.error('Token refresh failed', {
          message: error?.message,
        });

        // Очищаем localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('tokenExpiresAt');

        // Эндпоинта api/auth/logout на бэкенде нет, поэтому его не вызываем

        if (shouldRedirectToLogin()) {
          redirectToLogin();
        }
      } finally {
        isRefreshingRef.current = false;
        refreshPromiseRef.current = null;
        // ❌ НЕ вызываем scheduleRefresh здесь!
      }
    })();

    return refreshPromiseRef.current;
  };

  const checkAndScheduleRefresh = () => {
    if (!isMountedRef.current) {
      return;
    }

    log.info('Checking token expiration status');

    const expiresAt = localStorage.getItem('tokenExpiresAt');
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      log.warn('No access token found, skipping refresh scheduling');
      return;
    }

    const parsedExpiresAt = Number(expiresAt);

    if (!expiresAt) {
      log.warn('No expiration time found, setting default (30 min)');
      const newExpiresAt = Date.now() + 30 * 60 * 1000;
      localStorage.setItem('tokenExpiresAt', newExpiresAt.toString());
      scheduleRefresh(25 * 60 * 1000);
      return;
    }

    if (!Number.isFinite(parsedExpiresAt)) {
      log.warn('Invalid expiration time, setting default (30 min)');
      const newExpiresAt = Date.now() + 30 * 60 * 1000;
      localStorage.setItem('tokenExpiresAt', newExpiresAt.toString());
      scheduleRefresh(25 * 60 * 1000);
      return;
    }

    const timeUntilExpiry = parsedExpiresAt - Date.now();
    const minutesUntilExpiry = Math.round(timeUntilExpiry / 60000);

    log.info(`Token expires in ${minutesUntilExpiry} minutes`, {
      expiresAt: new Date(parsedExpiresAt).toLocaleString(),
      timeUntilExpiryMs: timeUntilExpiry,
    });

    if (timeUntilExpiry <= 0) {
      log.warn('Token already expired, refreshing immediately');
      refreshToken();
    } else if (timeUntilExpiry < 5 * 60 * 1000) {
      log.warn('Token expires in less than 5 minutes, refreshing now');
      refreshToken();
    } else {
      // Планируем обновление за 5 минут до истечения
      const refreshDelay = timeUntilExpiry - 5 * 60 * 1000;
      scheduleRefresh(refreshDelay);
    }
  };

  useEffect(() => {
    // ✅ Устанавливаем флаг монтирования
    isMountedRef.current = true;
    log.info('Token refresh hook mounted');

    const token = localStorage.getItem('access_token');

    if (token) {
      log.info('Access token found, initializing refresh schedule');
      checkAndScheduleRefresh();
    } else {
      log.warn('No access token found on mount');
    }

    // Слушаем события storage для синхронизации между табами
    const handleStorageChange = (e) => {
      if (
        (e.key === 'access_token' && e.newValue) ||
        (e.key === 'tokenExpiresAt' && e.newValue)
      ) {
        log.info('Access token changed in another tab, rescheduling');
        checkAndScheduleRefresh();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      // ✅ Сбрасываем флаг монтирования
      isMountedRef.current = false;
      log.info('Token refresh hook unmounting, cleaning up');

      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        refreshTimeoutRef.current = null; // ✅ Обнуляем ссылку
        log.info('Cleared refresh timeout');
      }

      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // ✅ Пустой массив зависимостей!

  return { refreshToken, checkAndScheduleRefresh };
};
