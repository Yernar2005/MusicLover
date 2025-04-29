https://drive.google.com/file/d/1cJ9sXltoAlbBj0gyjlxUiP0Z5jsBlc5q/view




Music Streaming Service

Краткое описание проекта

Music Streaming Service — это веб-приложение, позволяющее:

Загружать аудиотреки и обложки (роли: musician, admin).

Просматривать список треков с фильтрацией и поиском.

Стримить аудио через HTTP Range запросы или получать трек целиком в формате Base64.

Управлять ролями пользователей: user, musician, admin.

Настройка окружения
Создайте файл .env в корне проекта с переменными:

DB_URL=<MongoDB_Connection_String>
JWT_ACCESS_SECRET=<YourAccessSecret>
JWT_REFRESH_SECRET=<YourRefreshSecret>
MUSICIAN_KEY=<SecretKeyForMusician>
ADMIN_KEY=<SecretKeyForAdmin>
CLIENT_URL=http://localhost:5173
API_URL=http://localhost:5001



# Backend
cd server
npm install

# Frontend
cd ../client
npm install


# Backend
cd server
npm run dev

# Frontend
cd ../client
npm run dev




Дизайн и процесс разработки

Спроектировали REST API на Express.js с ролями и JWT-аутентификацией.

Модель данных: MongoDB + Mongoose; аудиофайлы хранятся в виде Buffer.

Стриминг аудио через HTTP Range для поддержки перемотки.

Реализовали пагинацию, поиск (text-индекс), фильтрацию по жанрам.

На клиенте: React + MobX, axios для запросов, SCSS для эффективного стилирования.



Уникальные подходы и методологии

Дебаунс-поиск на клиенте с lodash.debounce, чтобы снизить нагрузку на API.

Отдельный эндпоинт /full, возвращающий JSON с Base64-аудио, для потенциального офлайн-кеша.

Role-based access control (RBAC) с кастомными middleware auth-middleware и role-middleware.

Использование виртуального поля coverUrl в Mongoose для гибкости выдачи ссылок.



Принятые компромиссы

Хранение файлов в MongoDB: просто и быстро на старте, но не оптимально для больших объёмов. Для продакшена лучше вынести на S3/CDN.

Base64-аудио: удобно для единичных случаев, но увеличивает объём ответа (~+33%). Использовать только по необходимости.

MobX вместо Redux: выбрана за простоту и малое количество кода, хотя в крупных проектах может быть сложнее в отладке.




Известные ошибки и проблемы

На слабых соединениях возможны задержки при стриминге больших треков.

Кэширование браузером не настроено — аудио и обложки загружаются на каждый запрос.

Нет лимитов на общее число загруженных треков; может потребоваться очистка старых.



Технический стэк и обоснование
Почему выбрано:Backend  Node.js, Express.js, MongoDB, Mongoose
Лёгкий старт, большая экосистема NPM; гибкая модель документов.


Аутентификация
JWT, cookies
Безгосударственный протокол, хорош для SPA.


Frontend
React, MobX, axios, TailwindCSS
Быстрая 
разработка, отличный DX, простая реактивность.

DevOps / Tools
Vite, ESLint, Prettier
Быстрая сборка, единый стиль.



env file


PORT=5001
DB_URL=Your mongoDB

JWT_ACCESS_SECRET=jwt_access_secret_key
JWT_REFRESH_SECRET=jwt_refresh_secret_key

MUSICIAN_KEY=
ADMIN_KEY=



SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SSL=465
SMTP_USER=
SMTP_PASSWORD=""


API_URL=http://localhost:5001
CLIENT_URL=http://localhost:5173)



