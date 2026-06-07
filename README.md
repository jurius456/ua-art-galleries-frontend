<div align="center">

# UA Art Galleries

**Відкрита платформа для дослідження артгалерей України**

[![Deploy](https://img.shields.io/badge/deployed-vercel-black?style=flat-square&logo=vercel)](https://uagalleries.vercel.app)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[🌐 Відкрити застосунок](https://uagalleries.vercel.app) · [🐛 Повідомити про баг](https://github.com/jurius456/ua-art-galleries-frontend/issues) · [💬 Обговорення](https://github.com/jurius456/ua-art-galleries-frontend/discussions)

</div>

---

## Про проєкт

UA Art Galleries — це фронтенд частина повноцінної веб-платформи, що агрегує інформацію про артгалереї України. Платформа дозволяє користувачам знаходити галереї на інтерактивній карті, читати та залишати відгуки, зберігати обране та стежити за культурними подіями по всій країні.

Бекенд-частина знаходиться у репозиторії [ua-art-galleries-backend](https://github.com/jurius456/ua-art-galleries-backend).

---

## Стек технологій

**Ядро**
- [React 19](https://react.dev) + [TypeScript 5.9](https://typescriptlang.org)
- [Vite 7](https://vitejs.dev) — збірка та dev-сервер
- [React Router DOM v7](https://reactrouter.com) — клієнтський рутинг

**Стилі та UI**
- [Tailwind CSS 3](https://tailwindcss.com)
- [Lucide React](https://lucide.dev) — іконки

**Дані та стан**
- [TanStack Query v5](https://tanstack.com/query) — кешування та серверний стан
- [Contentful](https://contentful.com) — CMS для подій та статичного контенту

**Карта**
- [React Leaflet](https://react-leaflet.js.org) + [Leaflet.MarkerCluster](https://github.com/Leaflet/Leaflet.markercluster)
- Автоматичне геокодування адрес через Nominatim

**Автентифікація**
- JWT + Django REST Framework Auth
- [@react-oauth/google](https://github.com/MomenSherif/react-oauth) — Google OAuth 2.0

**Інтернаціоналізація**
- [react-i18next](https://react.i18next.com) — підтримка 🇺🇦 UA / 🇬🇧 EN

---

## Ключові можливості

### 🗺 Інтерактивна карта
Всі галереї відображені на карті України з кластеризацією. При наведенні — попап з назвою, рейтингом та посиланням на деталі. Підтримуються світла і темна теми тайлів (CartoDB Light / Dark). Координати беруться напряму з API або вираховуються автоматично через геокодування адреси.

### 🔍 Розширена фільтрація
Каталог галерей підтримує мультиселект-фільтри за містом, роком заснування та статусом, мінімальний рейтинг, текстовий пошук, а також сортування за алфавітом, рейтингом, новизною та давністю. Пагінація по 18 карток.

### ⭐ Рейтинги та відгуки
Користувачі можуть залишати оцінку (1–5 зірок) та текстовий відгук для кожної галереї. Середній рейтинг та кількість відгуків відображаються на картці та в деталях галереї.

### ❤️ Збережені галереї
Авторизовані користувачі можуть додавати галереї до обраного. Список синхронізується з бекендом. При спробі зберегти без авторизації — відображається ненав'язливий prompt.

### 🔐 Автентифікація та профіль
Реєстрація з підтвердженням email, вхід через логін/пароль або Google OAuth. У налаштуваннях доступна зміна пароля, управління профілем та загальні налаштування.

### 📅 Події
Каталог культурних подій та виставок із детальними сторінками, датами та описом. Дані надходять через Contentful CMS.

### 🌐 Двомовність
Повний переклад інтерфейсу на українську та англійську мови. Мова зберігається у `localStorage`.

---

## Архітектура

```
src/
├── api/              # Функції запитів, HTTP-клієнт
├── components/
│   ├── home/         # Секції головної сторінки
│   ├── gallery/      # Компоненти сторінки галереї
│   ├── shared/       # Header, Footer, FilterPanel, Notifications
│   └── Auth/         # Модальні вікна авторизації
├── context/          # AuthContext, FavoritesContext, ThemeContext
├── hooks/            # useAuth, useFavorites, useGalleriesQuery, useGalleryRating...
├── locales/          # Переклади (uk / en)
├── pages/            # Маршрутизовані сторінки
├── utils/            # geocode, gallery helpers, map constants
├── App.tsx           # Кореневий компонент, роутер
└── main.tsx          # Entrypoint, провайдери
```

Дані про галереї отримуються з власного REST API (Django). Події та редакційний контент — через Contentful. TanStack Query відповідає за кешування та дедуплікацію запитів.

---

## Конфігурація середовища

Проєкт потребує наступних змінних оточення:

| Змінна | Опис |
|---|---|
| `VITE_API_BASE_URL` | URL бекенд API |
| `VITE_CONTENTFUL_SPACE_ID` | Contentful Space ID |
| `VITE_CONTENTFUL_ACCESS_TOKEN` | Contentful Delivery Access Token |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Client ID |

---

## Структура гілок

| Гілка | Опис |
|---|---|
| `main` | Production-ready код, деплоїться автоматично |
| `design` | UI/UX ітерації та нові компоненти |
| `func_reviews` | Функціональність відгуків та рейтингів |
| `google_login` | Google OAuth та верифікація email |

---

## Деплой

Проєкт хоститься на [Vercel](https://uagalleries.vercel.app). Будь-який push у `main` тригерить автоматичний CD pipeline. `vercel.json` налаштований для коректного SPA-рутингу.

---

## Ліцензія

Розповсюджується за ліцензією MIT. Код відкритий для ознайомлення та навчальних цілей.
