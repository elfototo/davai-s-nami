'use client';

import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { EventsProvider } from '../context/EventsContext';

export default function RootLayout({ children }) {

  return (
    <html lang="ru">
      <body>
        <EventsProvider>
          <header className='bg-secondary'>
            <Navbar />
          </header>
          <main>{children}</main>
          <footer className='bg-[#333] mt-10 z-0'>
            <Footer />
          </footer>
        </EventsProvider>
      </body>
    </html>
  );
}