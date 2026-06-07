# 🇺🇦 UA Art Galleries — Frontend

> Платформа для пошуку та дослідження артгалерей України

Веб-застосунок, що об'єднує інформацію про артгалереї з усіх куточків України. Користувачі можуть знаходити галереї на інтерактивній карті, фільтрувати за містом, статусом та рейтингом, залишати відгуки та зберігати обрані.

---

## ✨ Функціональність

- 🗺️ **Інтерактивна карта** — всі галереї на карті України з кластеризацією та попапами
- 🔍 **Пошук і фільтрація** — за назвою, містом, роком заснування, статусом та мінімальним рейтингом
- ⭐ **Рейтинги та відгуки** — користувачі можуть оцінювати та коментувати галереї
- ❤️ **Збережені галереї** — особистий список обраного з локальним збереженням
- 🔐 **Автентифікація** — реєстрація / вхід через email + Google OAuth
- ✉️ **Підтвердження email** — верифікація акаунту після реєстрації
- 🌐 **Двомовність** — повна підтримка **Української** та **Англійської** мов (i18n)
- 🌙 **Темна / світла тема** — перемикання між режимами оформлення
- 📅 **Події** — каталог виставок та мистецьких подій із детальними сторінками
- 📄 **Сторінки** — Головна, Галереї, Контакти, FAQ, Партнери, Підтримка, Роадмап, Профіль

---

## 🛠 Технічний стек

| Категорія | Технологія |
|---|---|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS |
| Routing | React Router DOM v7 |
| Data Fetching | TanStack Query (React Query) |
| Maps | React Leaflet + Leaflet.MarkerCluster |
| i18n | react-i18next |
| Auth (Google) | @react-oauth/google |
| CMS | Contentful |
| Icons | Lucide React |
| Deploy | Vercel |

---

## 🚀 Запуск локально

### 1. Клонуйте репозиторій

```bash
git clone https://github.com/jurius456/ua-art-galleries-frontend.git
cd ua-art-galleries-frontend
```

### 2. Встановіть залежності

```bash
npm install
```

### 3. Створіть файл `.env`

```env
VITE_API_BASE_URL=https://your-backend-url.com
VITE_CONTENTFUL_SPACE_ID=your_contentful_space_id
VITE_CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 4. Запустіть dev-сервер

```bash
npm run dev
```

Відкрийте [http://localhost:5173](http://localhost:5173)

---

## 📁 Структура проєкту

```
src/
├── api/              # HTTP-клієнт та функції запитів до API
├── components/
│   ├── Auth/         # Компоненти авторизації (модалки, форми)
│   ├── gallery/      # Компоненти для сторінки галереї
│   ├── home/         # Секції головної сторінки (Hero, Map, Search...)
│   └── shared/       # Загальні компоненти (Header, Footer, FilterPanel...)
├── context/          # React Context: Auth, Favorites, Theme
├── hooks/            # Кастомні хуки (useAuth, useFavorites, useGalleriesQuery...)
├── locales/
│   ├── en/           # Переклади (англійська)
│   └── uk/           # Переклади (українська)
├── pages/
│   ├── About/
│   ├── Auth/         # Вхід, реєстрація, підтвердження email
│   ├── Contacts/
│   ├── Events/       # Список та деталі подій
│   ├── FAQ/
│   ├── Galleries/    # Каталог + збережені галереї
│   ├── Gallery/      # Деталі окремої галереї
│   ├── Home/
│   ├── Partners/
│   ├── Profile/
│   ├── Roadmap/
│   ├── Settings/     # Профіль, пароль, загальні налаштування
│   └── Support/
├── utils/            # Утиліти (geocoding, gallery helpers, maps...)
├── App.tsx           # Головний компонент з роутингом
└── main.tsx          # Точка входу, провайдери
```

---

## 🌍 Деплой на Vercel

Проєкт деплоїться автоматично через Vercel при пуші в `main`.

**Обов'язкові змінні середовища на Vercel:**

| Змінна | Опис |
|---|---|
| `VITE_API_BASE_URL` | URL бекенд API |
| `VITE_CONTENTFUL_SPACE_ID` | Contentful Space ID |
| `VITE_CONTENTFUL_ACCESS_TOKEN` | Contentful Access Token |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID |

Файл `vercel.json` налаштований для SPA-рутингу (всі шляхи → `index.html`).

---

## 📜 Доступні скрипти

```bash
npm run dev       # Запуск dev-сервера
npm run build     # Production збірка (tsc + vite build)
npm run preview   # Перегляд production збірки локально
npm run lint      # ESLint перевірка
```

---

## 🤝 Внесок у проєкт

1. Форкніть репозиторій
2. Створіть гілку для фічі: `git checkout -b feature/назва-фічі`
3. Зафіксуйте зміни: `git commit -m 'feat: додати нову фічу'`
4. Запушіть гілку: `git push origin feature/назва-фічі`
5. Відкрийте Pull Request

---

## 📄 Ліцензія

MIT License
