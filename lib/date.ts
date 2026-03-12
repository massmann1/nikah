import type { Weekday } from '@/types/habit';

export const toDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const parseDateKey = (dateKey: string): Date => {
  const [y, m, d] = dateKey.split('-').map((value) => Number(value));
  if (!y || !m || !d) {
    return new Date();
  }
  return new Date(y, m - 1, d);
};

export const getTodayKey = (): string => toDateKey(new Date());

export const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const addDays = (date: Date, delta: number): Date => {
  const output = startOfDay(date);
  output.setDate(output.getDate() + delta);
  return output;
};

export const diffDays = (a: Date, b: Date): number => {
  const aDay = startOfDay(a);
  const bDay = startOfDay(b);
  const millis = aDay.getTime() - bDay.getTime();
  return Math.round(millis / 86400000);
};

export const compareDateKeys = (a: string, b: string): number => {
  if (a === b) return 0;
  return a < b ? -1 : 1;
};

export const isDateKeyBefore = (a: string, b: string): boolean => compareDateKeys(a, b) < 0;

export const getWeekday = (dateKey: string): Weekday => parseDateKey(dateKey).getDay() as Weekday;

export const getDateKeysInRange = (fromKey: string, toKey: string): string[] => {
  const output: string[] = [];
  let cursor = parseDateKey(fromKey);
  const to = parseDateKey(toKey);

  while (cursor <= to) {
    output.push(toDateKey(cursor));
    cursor = addDays(cursor, 1);
  }

  return output;
};

export const formatDateLabel = (dateKey: string, locale = 'ru-RU'): string =>
  parseDateKey(dateKey).toLocaleDateString(locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

export const formatLongDate = (dateKey: string, locale = 'ru-RU'): string =>
  parseDateKey(dateKey).toLocaleDateString(locale, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

export const formatMonthLabel = (dateKey: string, locale = 'ru-RU'): string =>
  parseDateKey(dateKey).toLocaleDateString(locale, {
    month: 'long',
    year: 'numeric'
  });

export const isTodayKey = (dateKey: string): boolean => dateKey === getTodayKey();
