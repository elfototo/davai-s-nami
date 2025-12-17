// "use client";

// import { useTelegramAuth } from '../../hooks/useTelegramAuth';

// export default function TelegramAuth({ children }) {
//   const { loading, error } = useTelegramAuth();

//   if (loading) {
//     return (
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100vh' 
//       }}>
//         <div>
//           <p>🔄 Авторизация через Telegram...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div style={{ 
//         display: 'flex', 
//         justifyContent: 'center', 
//         alignItems: 'center', 
//         height: '100vh',
//         flexDirection: 'column'
//       }}>
//         <p style={{ color: 'red' }}>❌ Ошибка авторизации: {error}</p>
//         <button onClick={() => window.location.reload()}>
//           Попробовать снова
//         </button>
//       </div>
//     );
//   }

//   return <>{children}</>;
// }

// components/TelegramAuth.js - ИСПРАВЛЕННАЯ ВЕРСИЯ
"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { API_URL1 } from '@/config';

export default function TelegramAuth({ children }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loginWithTelegram = async () => {
      try {
        // 1. Проверяем доступен ли Telegram WebApp
        if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
          console.log('❌ Telegram WebApp недоступен');
          return;
        }

        const telegram = window.Telegram.WebApp;
        const initData = telegram.initData;

        console.log('🔍 Telegram initData:', initData ? 'Есть' : 'Нет');

        // 2. Если нет initData - значит открыто не в Telegram
        if (!initData) {
          console.log('ℹ️ Приложение открыто не в Telegram');
          return;
        }

        // 3. Проверяем есть ли уже access_token
        const existingToken = localStorage.getItem('access_token');
        if (existingToken) {
          console.log('✅ Пользователь уже авторизован');
          return;
        }

        // 4. Проверяем флаг "пользователь вышел намеренно"
        const userLoggedOut = sessionStorage.getItem('user_logged_out');
        if (userLoggedOut === 'true') {
          console.log('ℹ️ Пользователь вышел из аккаунта, автовход отключён');
          return;
        }

        // 5. НЕ делаем автовход на странице /login
        if (pathname === '/login') {
          console.log('ℹ️ На странице login, автовход отключён');
          return;
        }

        console.log('🚀 Начинаем автоматическую Telegram авторизацию...');
        setLoading(true);

        // 6. Отправляем запрос на авторизацию
        const response = await fetch(`${API_URL1}api/auth/telegram/login`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            init_data: initData,
          }),
        });

        if (!response.ok) {
          throw new Error(`Ошибка авторизации: ${response.status}`);
        }

        const data = await response.json();

        console.log('✅ Telegram авторизация успешна');

        // 7. Сохраняем токены
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          
          const expiresAt = Date.now() + 30 * 60 * 1000;
          localStorage.setItem('tokenExpiresAt', expiresAt.toString());

          // Очищаем флаг выхода
          sessionStorage.removeItem('user_logged_out');

          console.log('✅ Токены сохранены');
          
          // Уведомляем приложение об изменении auth
          window.dispatchEvent(new Event('auth-changed'));

          // Перенаправляем на dashboard если на главной
          if (pathname === '/') {
            router.push('/dashboard');
          }
        } else {
          throw new Error('access_token не получен');
        }
      } catch (err) {
        console.error('❌ Ошибка Telegram авторизации:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Запускаем с небольшой задержкой, чтобы Telegram успел инициализироваться
    const timer = setTimeout(loginWithTelegram, 300);
    return () => clearTimeout(timer);
  }, [router, pathname]);

  // Показываем загрузку только если идёт процесс авторизации
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ fontSize: '48px' }}>⏳</div>
        <p>Авторизация через Telegram...</p>
      </div>
    );
  }

  // Показываем ошибку только если она есть (не блокируем весь контент)
  if (error) {
    console.error('Telegram auth error:', error);
    // Не блокируем приложение, просто логируем ошибку
  }

  return <>{children}</>;
}

