'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { EventsProvider } from '../context/SwrContext';
import '../utils/dayjsSetup';
import { useRouter } from 'next/navigation';

// import { useSwipeBack } from '../hooks/useSwipeBack'

export default function RootLayout({ children }) {
  const router = useRouter();

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
    <html lang="ru">
      <body>
        <EventsProvider>
          <header className="bg-secondary">
            <Navbar />
          </header>
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
          <main>{children}</main>
          <footer className="z-0 mt-10 bg-[#333]">
            <Footer />
          </footer>
        </EventsProvider>
      </body>
    </html>
  );
}
