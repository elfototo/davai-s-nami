'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { EventsProvider } from '../context/SwrContext';
import '../utils/dayjsSetup';
import { useRouter } from 'next/navigation';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useTokenRefresh } from '../hooks/useTokenRefresh';
import TelegramAuth from '../components/TelegramAuth';

export default function RootLayout({ children, isAuth }) {
  const router = useRouter();
  useTokenRefresh();

  useEffect(() => {
    const handleTelegramInit = () => {
      const tg = window.Telegram?.WebApp;

      if (!tg) {
        console.warn('Telegram WebApp не инициализирован');
        return;
      }

      tg.ready();

      const startParam = tg.initDataUnsafe?.start_param;

      console.log('📦 start_param:', startParam);

      if (startParam && startParam.startsWith('event_')) {
        const id = startParam.replace('event_', '');
        router.replace(`/events/${id}`);
      }
    };

    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      handleTelegramInit();
    } else {
      const interval = setInterval(() => {
        if (window.Telegram?.WebApp) {
          clearInterval(interval);
          handleTelegramInit();
        }
      }, 100); // Проверяем каждые 100 мс
      setTimeout(() => clearInterval(interval), 3000); // Остановить через 3 сек
    }
  }, [router]);

  return (
    <>
      <EventsProvider>
        {!isAuth && (
          <header className="relative bg-secondary">
            <Navbar />
          </header>
        )}

        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
          onLoad={() => {
            if (window.Telegram?.WebApp) {
              const tg = window.Telegram.WebApp;
              tg.ready();
              console.log('Telegram WebApp loaded and ready (Script onLoad)');
            }
          }}
        />
        <TelegramAuth>
          <Provider store={store}>{children}</Provider>
        </TelegramAuth>

        <footer className="z-0 mt-10 bg-[#333]">
          <Footer />
        </footer>
      </EventsProvider>
    </>
  );
}
