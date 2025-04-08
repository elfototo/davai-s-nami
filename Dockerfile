# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json (если есть)
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
