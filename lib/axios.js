// lib/axios.js
import axios from 'axios';
import { API_URL1 } from "../config";

const api = axios.create({
  baseURL: API_URL1,
});

let isRefreshing = false;
let failedQueue = [];

// Логирование (можно легко отключить в продакшене)
const isDev = process.env.NODE_ENV === 'development';

const log = {
  info: (message, data = {}) => {
    if (isDev) console.log(`[Token Manager] ℹ️ ${message}`, data);
  },
  success: (message, data = {}) => {
    if (isDev) console.log(`[Token Manager] ✅ ${message}`, data);
  },
  error: (message, data = {}) => {
    console.error(`[Token Manager] ❌ ${message}`, data);
  },
  warn: (message, data = {}) => {
    if (isDev) console.warn(`[Token Manager] ⚠️ ${message}`, data);
  }
};

const processQueue = (error, token = null) => {
  log.info(`Processing queue with ${failedQueue.length} requests`, { 
    hasError: !!error 
  });
  
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
  log.success('Queue processed');
};

// Request interceptor - добавляем токен к каждому запросу
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      log.info(`Request to ${config.url}`, { hasToken: true });
    } else {
      log.warn(`Request to ${config.url} without token`);
    }
    
    return config;
  },
  (error) => {
    log.error('Request interceptor error', error);
    return Promise.reject(error);
  }
);

// Response interceptor - обрабатываем 401 ошибки
api.interceptors.response.use(
  (response) => {
    log.success(`Response from ${response.config.url}`, { 
      status: response.status 
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    log.warn(`Response error from ${originalRequest?.url}`, { 
      status: error.response?.status,
      isRetry: originalRequest?._retry 
    });

    // Если получили 401 и это не повторный запрос
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        log.info('Token refresh already in progress, adding to queue');
        
        // Если уже идет обновление, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            log.info('Request resumed from queue');
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            log.error('Queued request failed', err);
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      log.info('Starting token refresh process');

      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        log.error('No refresh token found, redirecting to login');
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        log.info('Requesting new access token');
        
        // Запрашиваем новый access token
        // ВАЖНО: используем обычный axios без interceptors для refresh запроса
        const response = await axios.post(
          `${API_URL1}/api/auth/refresh`,
          {}, // пустое body
          {
            headers: { 
              'Authorization': `Bearer ${refreshToken}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // Проверяем, какой формат возвращает ваш API
        const { access_token, refresh_token: newRefreshToken } = response.data;
        
        log.success('New access token received');
        
        // Сохраняем новые токены
        localStorage.setItem('access_token', access_token);
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
          log.info('Refresh token also updated');
        }

        // Сохраняем время истечения для проактивного обновления
        const expiresAt = Date.now() + 30 * 60 * 1000; // 30 минут
        localStorage.setItem('tokenExpiresAt', expiresAt.toString());
        log.info('Token expiration time set', { 
          expiresAt: new Date(expiresAt).toLocaleString() 
        });

        // Обновляем заголовок оригинального запроса
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        // Обрабатываем очередь
        processQueue(null, access_token);
        
        isRefreshing = false;
        log.success('Token refresh completed, retrying original request');
        
        // Повторяем оригинальный запрос
        return api(originalRequest);
      } catch (refreshError) {
        log.error('Token refresh failed', refreshError);
        
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Refresh token тоже невалиден - выходим
        log.error('Clearing storage and redirecting to login');
        localStorage.clear();
        window.location.href = '/login';
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;