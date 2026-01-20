import { useTelegramAuth } from '../hooks/useTelegramAuth';

export default function TelegramAuth({ children }) {
  const { loading, error } = useTelegramAuth();

  // Показываем загрузку только если идёт процесс авторизации
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <div style={{ fontSize: '48px' }}>⏳</div>
        <p>Авторизация через Telegram...</p>
      </div>
    );
  }

  // Показываем ошибку только если она есть (не блокируем весь контент)
  if (error) {
    console.error('Telegram auth error:', error);
    // Не блокируем приложение, просто логируем ошибку
  }

  return <>{children}</>;
}
