export function getTelegramWebApp() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.Telegram?.WebApp || null;
}

export function hasTelegramAuthData() {
  const telegram = getTelegramWebApp();

  return Boolean(telegram?.initData && telegram?.initDataUnsafe?.user);
}
