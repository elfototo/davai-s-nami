# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --frozen-lockfile

# Копируем весь проект в контейнер
COPY . .

# Собираем проект
RUN npm run build

# Открываем порт 3000 для приложения
EXPOSE 3000

# Команда для запуска приложения в продакшн-режиме
CMD ["npm", "start"]

# Устанавливаем переменные окружения
ENV API_URL=${NEXT_PUBLIC_API_URL}
ENV API_URL_BY_ID=${NEXT_PUBLIC_API_URL_BY_ID}
ENV API_URL_PL=${NEXT_PUBLIC_API_URL_PL}
ENV API_URL_PL_BY_ID=${NEXT_PUBLIC_API_URL_PL_BY_ID}
ENV SEARCH_URL=${NEXT_PUBLIC_SEARCH_URL}
ENV API_HEADERS=${NEXT_PUBLIC_API_HEADERS}
ENV API_AUTHORIZATION_KEY=${NEXT_PUBLIC_API_AUTHORIZATION_KEY}