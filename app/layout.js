'use client';

import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query-client'
import { EventsProvider } from '../context/EventsContext';
import '../utils/dayjsSetup';

export default function RootLayout({ children }) {

  return (
    <html lang="ru">
      <body>
        <QueryClientProvider client={queryClient}>
          <EventsProvider>
            <header className='bg-secondary'>
              <Navbar />
            </header>
            <main>{children}</main>
            <footer className='bg-[#333] mt-10 z-0'>
              <Footer />
            </footer>
          </EventsProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}