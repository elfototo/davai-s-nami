// hooks/useTokenRefresh.js
"use client";

import { useEffect, useRef } from 'react';
import { API_URL1 } from "../config";

const isDev = process.env.NODE_ENV === 'development';

const log = {
  info: (message, data = {}) => {
    if (isDev) console.log(`[Token Timer] ℹ️ ${message}`, data);
  },
  success: (message, data = {}) => {
    if (isDev) console.log(`[Token Timer] ✅ ${message}`, data);
  },
  error: (message, data = {}) => {
    console.error(`[Token Timer] ❌ ${message}`, data);
  },
  warn: (message, data = {}) => {
    if (isDev) console.warn(`[Token Timer] ⚠️ ${message}`, data);
  }
};

export const useTokenRefresh = () => {
  const refreshTimeoutRef = useRef(null);

  const refreshToken = async () => {
    log.info('Starting proactive token refresh');
    
    try {
      const refresh = localStorage.getItem('refresh_token');
      
      if (!refresh) {
        log.warn('No refresh token available');
        return;
      }

      log.info('Sending refresh request to API');
      
      const response = await fetch(`${API_URL1}/api/auth/refresh`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${refresh}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        log.error('Refresh request failed', { status: response.status });
        throw new Error('Refresh failed');
      }

      const data = await response.json();
      
      log.success('Received new tokens from API', { 
        hasAccessToken: !!data.access_token,
        hasRefreshToken: !!data.refresh_token 
      });
      
      // Используем имена полей, которые возвращает ваш API
      localStorage.setItem('access_token', data.access_token);
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token);
        log.info('Refresh token updated');
      }

      // Записываем время истечения
      const expiresAt = Date.now() + 30 * 60 * 1000; // 30 минут
      localStorage.setItem('tokenExpiresAt', expiresAt.toString());
      
      log.success('Token refreshed successfully', {
        expiresAt: new Date(expiresAt).toLocaleString(),
        nextRefreshIn: '25 minutes'
      });
      
      // Обновляем за 5 минут до истечения (через 25 минут)
      scheduleRefresh(25 * 60 * 1000);
    } catch (error) {
      log.error('Token refresh failed, clearing session', error);
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const scheduleRefresh = (delay) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
      log.info('Cleared previous refresh timeout');
    }
    
    const delayMinutes = Math.round(delay / 60000);
    log.info(`Scheduling next refresh in ${delayMinutes} minutes`, {
      delayMs: delay,
      scheduledFor: new Date(Date.now() + delay).toLocaleString()
    });
    
    refreshTimeoutRef.current = setTimeout(() => {
      log.info('Refresh timeout triggered');
      refreshToken();
    }, delay);
  };

  const checkAndScheduleRefresh = () => {
    log.info('Checking token expiration status');
    
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    const accessToken = localStorage.getItem('access_token'); // ИСПРАВЛЕНО: было accessToken
    
    if (!accessToken) {
      log.warn('No access token found, skipping refresh scheduling');
      return;
    }
    
    if (!expiresAt) {
      log.warn('No expiration time found, setting default (30 min)');
      // Если нет времени истечения, устанавливаем его
      const newExpiresAt = Date.now() + 30 * 60 * 1000;
      localStorage.setItem('tokenExpiresAt', newExpiresAt.toString());
      scheduleRefresh(25 * 60 * 1000); // Обновить через 25 минут
      return;
    }

    const timeUntilExpiry = parseInt(expiresAt) - Date.now();
    const minutesUntilExpiry = Math.round(timeUntilExpiry / 60000);
    
    log.info(`Token expires in ${minutesUntilExpiry} minutes`, {
      expiresAt: new Date(parseInt(expiresAt)).toLocaleString(),
      timeUntilExpiryMs: timeUntilExpiry
    });
    
    if (timeUntilExpiry <= 0) {
      log.warn('Token already expired, refreshing immediately');
      refreshToken();
    } else if (timeUntilExpiry < 5 * 60 * 1000) {
      log.warn('Token expires in less than 5 minutes, refreshing now');
      refreshToken();
    } else {
      // Планируем обновление за 5 минут до истечения
      const refreshDelay = timeUntilExpiry - 5 * 60 * 1000;
      scheduleRefresh(refreshDelay);
    }
  };

  useEffect(() => {
    log.info('Token refresh hook mounted');
    
    const token = localStorage.getItem('access_token');
    
    if (token) {
      log.info('Access token found, initializing refresh schedule');
      checkAndScheduleRefresh();
    } else {
      log.warn('No access token found on mount');
    }

    // Слушаем события storage для синхронизации между табами
    const handleStorageChange = (e) => {
      if (e.key === 'access_token' && e.newValue) {
        log.info('Access token changed in another tab, rescheduling');
        checkAndScheduleRefresh();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      log.info('Token refresh hook unmounting, cleaning up');
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
        log.info('Cleared refresh timeout');
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return { refreshToken };
};