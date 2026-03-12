import type { AppData, AppSettings, Habit } from '@/types/habit';

export const STORAGE_KEY = 'habit-tracker-pwa-store';
export const APP_DATA_VERSION = 1;
export const APP_VERSION = '1.0.0';

export const WEEKDAY_LABELS_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'] as const;
export const WEEKDAY_LABELS_LONG = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'] as const;

export const HABIT_COLORS = [
  '#FF7A59',
  '#5DADE2',
  '#49C1A2',
  '#F6B73C',
  '#9B8AFB',
  '#F16FA0',
  '#7AD36B',
  '#F45B69'
] as const;

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  hasSeenOnboarding: false,
  seedDemoHabitsOnReset: true,
  updatedAt: new Date().toISOString()
};

const nowIso = () => new Date().toISOString();

export const createDefaultAppData = (habits: Habit[] = []): AppData => ({
  version: APP_DATA_VERSION,
  habits,
  habitEntriesByDate: {},
  settings: {
    ...DEFAULT_SETTINGS,
    updatedAt: nowIso()
  },
  meta: {
    createdAt: nowIso(),
    lastUpdatedAt: nowIso()
  }
});

export const TAB_BAR_HEIGHT = 74;
