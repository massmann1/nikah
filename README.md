# Habit Pulse (PWA Habit Tracker)

Полноценный **личный Habit Tracker** на **Next.js 14 + App Router + TypeScript + Tailwind CSS**, работающий полностью **офлайн** и хранящий данные только локально на устройстве.

## Что реализовано

- Mobile-first интерфейс под iPhone (safe-area, крупные tap-targets, нижняя tab bar навигация)
- Типы привычек:
  - `binary` (сделал / не сделал)
  - `count` (числовая цель + unit + быстрые +/-)
- Экраны:
  - `Today`
  - `Habits`
  - `Habit Details` (история/календарь + статистика)
  - `Stats`
  - `Settings`
- Локальное хранение и восстановление состояния
- Версионирование и миграция схемы данных
- Экспорт/импорт JSON
- Сброс данных с подтверждением
- Архивирование привычек
- Empty states + onboarding при первом запуске
- Demo habits при первом запуске (с возможностью отключить)
- PWA:
  - `manifest.json`
  - service worker (`public/sw.js`)
  - offline fallback (`public/offline.html`)
  - app icons + apple touch icon
  - Apple meta tags для standalone-режима

## Технологии

- Next.js 14 (App Router)
- React 18
- TypeScript (strict)
- Tailwind CSS
- lucide-react
- localStorage

## Архитектура

- `types/` — доменные типы и интерфейсы
- `lib/` — storage, миграции, статистика, календарная логика, демо-данные
- `hooks/` — глобальный state/provider (`use-app-data`)
- `components/` — UI-компоненты, формы, карточки, shell
- `app/` — страницы App Router
- `public/` — PWA-ассеты (`manifest`, `sw.js`, `icons`, offline fallback)

Схема хранения:

- `habits[]`
- `habitEntriesByDate` (`YYYY-MM-DD -> habitId -> { value, updatedAt }`)
- `settings`
- `meta`

## Скрипты

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
npm run icons
```

## Локальный запуск

1. Установить зависимости:
```bash
npm install
```

2. Запустить dev:
```bash
npm run dev
```

3. Открыть:
- `http://localhost:3000/today`

## Production build

```bash
npm run build
npm run start
```

## Проверка PWA

1. Запусти production-режим:
```bash
npm run build
npm run start
```

2. На iPhone открой сайт через Safari (желательно HTTPS или через локальную сеть).

3. Проверь:
- `manifest.json` доступен: `/manifest.json`
- Service Worker зарегистрирован (DevTools Safari на Mac)
- Отключи интернет и перезапусти приложение: должно открыться офлайн

## Добавление на Home Screen (iPhone)

1. Открой приложение в Safari
2. Нажми **Share**
3. Выбери **Add to Home Screen**
4. Запусти иконку с домашнего экрана

Ожидаемое поведение:
- standalone-like fullscreen
- нижняя tab bar как в приложении
- офлайн-доступ к ранее закешированным страницам

## Импорт/экспорт

- Export: `Settings -> Export JSON`
- Import: `Settings -> Import JSON`
- При повреждённом JSON показывается ошибка и данные не перезаписываются

## Замечания

- Приложение intentionally без backend и без auth
- Все данные остаются на этом устройстве
- Логику легко расширить под облачную синхронизацию позже (слой `lib/storage.ts` + `hooks/use-app-data.tsx`)
