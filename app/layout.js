import Link from 'next/link';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <header>
          <nav>
            <Link href="/">Давай с нами</Link>
            <input type="search" placeholder="Search..." />

            <Link href="/events">События</Link>
            <Link href="/places">Места</Link>
            <Link href="/about">О нас</Link>
            <button>Войти</button>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}