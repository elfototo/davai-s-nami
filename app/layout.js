'use client';

import './globals.css';
import { useState, useEffect } from 'react';
import Script from 'next/script';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { EventsProvider } from '../context/SwrContext';
import '../utils/dayjsSetup';
// import { useSwipeBack } from '../hooks/useSwipeBack'

export default function RootLayout({ children }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      alert(window.location.pathname);

      const tg = window.Telegram?.WebApp;

      // Telegram WebApp может быть не готов сразу — поэтому вызываем .ready()
      tg.ready();

      if (!tg) {
        alert('❌ Telegram WebApp не инициализирован');
        return;
      }

      // Показываем отладочную информацию
      tg.showPopup({
        title: 'Debug',
        message:
          '✅ Telegram WebApp запущен\n' +
          'pathname: ' +
          window.location.pathname +
          '\n' +
          'start_param: ' +
          tg?.initDataUnsafe?.start_param,
      });

      const param = tg.initDataUnsafe?.start_param;

      if (param) {
        if (param.startsWith('event_')) {
          const id = param.replace('event_', '');
          tg.showPopup({
            title: 'Переход',
            message: `Переход на /events/${id}`,
          });
          router.replace(`/events/${id}`);
        } else {
          tg.showPopup({
            title: 'Info',
            message: `Получен неизвестный параметр: ${param}`,
          });
        }
      } else {
        tg.showPopup({
          title: 'Info',
          message: 'Нет параметра start_param',
        });
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  // useSwipeBack();
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
