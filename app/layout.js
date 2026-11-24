import './globals.css';
import { headers } from 'next/headers';
import RootClient from './layoutClient';
import { getServerCity } from '../utils/cityServer';
import { getRequestIp } from '../utils/clientContextServer';

export default function RootLayout({ children }) {
  const pathname = headers().get("x-pathname") || "";
  const isAuth = pathname.includes("/auth");
  console.log(pathname, "pathname");

  return (
    <html lang="ru">
      <body>
        <RootClient
          isAuth={isAuth}
          initialCity={getServerCity()}
          clientIp={getRequestIp()}
        >
          {children}
        </RootClient>
      </body>
    </html>
  );
}
