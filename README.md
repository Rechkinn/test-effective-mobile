# User Service API

REST API сервис для управления пользователями.

## Стек
- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **База данных:** PostgreSQL
- **ORM:** Prisma
- **Авторизация:** JWT

## Запуск проекта

### 1. Установить зависимости
npm install

### 2. Создать .env файл (файл уже создан, можно пропустить этот пункт)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/userservice?schema=public"

JWT_SECRET="your_super_secret_key_change_in_production"

JWT_EXPIRES_IN="7d"

PORT=3000

### 3. Применить миграции
npx prisma migrate dev

### 4. Запустить
npm run dev

## Endpoints

| Метод  | URL                      | Доступ                   | Описание                    |
|--------|--------------------------|--------------------------|-----------------------------|
| POST   | /api/users/register      | Публичный                | Регистрация                 |
| POST   | /api/users/login         | Публичный                | Авторизация (JWT)           |
| GET    | /api/users/:id           | Сам пользователь / Admin | Получить пользователя по ID |
| GET    | /api/users               | Только Admin             | Список пользователей        |
| PATCH  | /api/users/:id/block     | Сам пользователь / Admin | Блокировка пользователя     |
