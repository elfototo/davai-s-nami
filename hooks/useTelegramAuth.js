"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL1 } from '../config';

export const useTelegramAuth = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const loginWithTelegram = async () => {
      try {
        // Проверяем доступен ли Telegram WebApp
        if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
          console.log('❌ Telegram WebApp недоступен');
          setLoading(false);
          return;
        }

        const telegram = window.Telegram.WebApp;
        const initData = telegram.initData;

        console.log('🔍 Telegram initData:', initData);

        // Если нет initData - значит открыто не в Telegram
        if (!initData) {
          console.log('ℹ️ Приложение открыто не в Telegram');
          setLoading(false);
          return;
        }

        // Проверяем есть ли уже access_token
        const existingToken = localStorage.getItem('access_token');
        if (existingToken) {
          console.log('✅ Пользователь уже авторизован');
          setLoading(false);
          return;
        }

        console.log('🚀 Начинаем Telegram авторизацию...');

        // Отправляем запрос на авторизацию
        const response = await fetch(`${API_URL1}/api/auth/telegram/login`, {
          method: 'POST',
          credentials: 'include', // Для получения httpOnly cookie
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

        // Сохраняем access_token
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          
          // Устанавливаем время истечения (30 минут)
          const expiresAt = Date.now() + 30 * 60 * 1000;
        //   const expiresAt = Date.now() + 1 * 60 * 1000;

          localStorage.setItem('tokenExpiresAt', expiresAt.toString());

          console.log('✅ Токены сохранены');
          console.log('✅ refresh_token в httpOnly cookie');

          // Перенаправляем на главную (или куда нужно)
          router.push('/');
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

    loginWithTelegram();
  }, [router]);

  return { loading, error };
};