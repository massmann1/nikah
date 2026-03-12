import { STORAGE_KEY } from '@/lib/constants';
import { createInitialAppData, migrateAppData } from '@/lib/migrations';
import type { AppData } from '@/types/habit';

const hasWindow = (): boolean => typeof window !== 'undefined';

export const loadAppData = (): AppData => {
  if (!hasWindow()) {
    return createInitialAppData(true);
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return createInitialAppData(true);
  }

  try {
    const parsed = JSON.parse(raw) as unknown;
    const migrated = migrateAppData(parsed);
    return migrated ?? createInitialAppData(false);
  } catch {
    return createInitialAppData(false);
  }
};

export const saveAppData = (data: AppData): void => {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const clearStoredAppData = (): void => {
  if (!hasWindow()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
};

export const exportAppData = (data: AppData): string => {
  return JSON.stringify(data, null, 2);
};

export const importAppData = (raw: string): { ok: true; data: AppData } | { ok: false; error: string } => {
  try {
    const parsed = JSON.parse(raw) as unknown;
    const migrated = migrateAppData(parsed);

    if (!migrated) {
      return {
        ok: false,
        error: 'JSON structure is invalid for Habit Tracker data.'
      };
    }

    return {
      ok: true,
      data: migrated
    };
  } catch {
    return {
      ok: false,
      error: 'Could not parse JSON file. Please verify file content.'
    };
  }
};
