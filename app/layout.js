'use client';

import './globals.css';
import Navbar from './components/Navbar';

export default function RootLayout({ children }) {

  return (
    <html lang="ru">
      <body>
        <header className='bg-secondary'>
          <Navbar/>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}