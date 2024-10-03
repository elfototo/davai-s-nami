'use client';

import Link from 'next/link';
import { useState } from 'react';
import './globals.css';

export default function RootLayout({ children }) {

  const [isMenuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  }

  return (
    <html lang="ru">
      <body>
        <header className='bg-secondary'>
          <nav className='max-w-custom-container mx-auto px-4 flex items-center justify-between h-auto'>
            <div className='flex items-center justify-start py-1'>
              <Link href="/" className='mr-5 text-[1.8rem] font-bold text-[#444]'>Давай с нами</Link>
              <input type="search" placeholder="Search..." className='bg-pramary rounded-sm py-1 px-1 mr-5' />
            </div>
            <div>
              <button onClick={toggleMenu} className='text-[#444] focus:outline-none md:hidden'>
                <svg className='w-6 h-6' fill='nome' viewBox='0 0 24 24' stroke='currentColor'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16m-7 6h7'></path>
                </svg>
              </button>
            </div>
            <div onClick={closeMenu} className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ${isMenuOpen ? 'block': 'hidden'}`}>
              <div onClick={(e) => e.stopPropagation()} className={`absolute top-10 right-4 transform  w-auto md:w-1/3 bg-secondary rounded-lg shadow-lg transition-all duration-300 ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0' }`}>
                <div className='flex p-2 flex-col items-center justify-start'>
                  <Link href="/events" className='mb-2 text-[#333] hover:text-gray-300 transition-colors duration-200' 
                  onClick={closeMenu}>События</Link>
                  <Link href="/places" className='mb-2 text-[#333] hover:text-gray-300 transition-colors duration-200' 
                  onClick={closeMenu}>Места</Link>
                  <Link href="/about" className='mb-2 text-[#333] hover:text-gray-300 transition-colors duration-200' 
                  onClick={closeMenu}>О нас</Link>
                  <button className='rounded-sm text-title-2 py-1 px-5 bg-[#444] text-secondary hover:bg-gray-700 transition-colors duration-200' onClick={closeMenu}>Войти</button>
                </div>
              </div>
            </div>
            <div className='hidden md:flex items-center justify-start py-1'>
              <Link href="/events" className='mr-5'>События</Link>
              <Link href="/places" className='mr-5'>Места</Link>
              <Link href="/about" className='mr-5'>О нас</Link>
              <button className='rounded-sm text-title-2 py-1 px-5 bg-[#444] text-secondary'>Войти</button>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}