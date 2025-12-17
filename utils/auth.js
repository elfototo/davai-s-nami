export const logout = async () => {
  try {
    // Устанавливаем флаг что пользователь вышел намеренно
    sessionStorage.setItem('user_logged_out', 'true');
    
    // Очищаем токены
    localStorage.removeItem('access_token');
    localStorage.removeItem('tokenExpiresAt');
    
    // Опционально: вызываем logout endpoint
    try {
      await fetch(`${API_URL1}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Ошибка logout endpoint:', err);
    }
    
    // Уведомляем приложение
    window.dispatchEvent(new Event('auth-changed'));
    
    // Перенаправляем на login
    window.location.href = '/login';
  } catch (error) {
    console.error('Ошибка выхода:', error);
  }
};
