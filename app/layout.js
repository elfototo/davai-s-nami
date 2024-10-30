'use client';

import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer'

export default function RootLayout({ children }) {

  return (
    <html lang="ru">
      <body>
        <header className='bg-secondary'>
          <Navbar/>
        </header>
        <main>{children}</main>
        <footer className='bg-[#333] mt-10'>
          <Footer/>
        </footer>
      </body>
    </html>
  );
}