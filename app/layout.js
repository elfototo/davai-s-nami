'use client';

import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { SWRProvider } from '../context/SwrContext';
import '../utils/dayjsSetup';

export default function RootLayout({ children }) {

  return (
    <html lang="ru">
      <body>

        <SWRProvider>
          <header className='bg-secondary'>
            <Navbar />
          </header>
          <main>{children}</main>
          <footer className='bg-[#333] mt-10 z-0'>
            <Footer />
          </footer>
        </SWRProvider>

      </body>
    </html>
  );
}