import { APP_DATA_VERSION, DEFAULT_SETTINGS, createDefaultAppData } from '@/lib/constants';
import { createDemoBundle } from '@/lib/demo-data';
import { getTodayKey } from '@/lib/date';
import { createId } from '@/lib/id';
import type { AppData, Habit, HabitEntriesByDate, HabitIconKey, HabitType, ThemePreference, Weekday } from '@/types/habit';

const iconFallback: HabitIconKey = 'sparkles';
const colorFallback = '#5DADE2';

const toRecord = (input: unknown): Record<string, unknown> | null => {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return null;
  }
  return input as Record<string, unknown>;
};

const toString = (value: unknown, fallback = ''): string => {
  if (typeof value === 'string') {
    return value;
  }
  return fallback;
};

const toBoolean = (value: unknown, fallback = false): boolean => {
  if (typeof value === 'boolean') {
    return value;
  }
  return fallback;
};

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
};

const normalizeTheme = (value: unknown): ThemePreference => {
  return value === 'light' || value === 'dark' || value === 'system' ? value : 'system';
};

const normalizeIcon = (value: unknown): HabitIconKey => {
  const options: HabitIconKey[] = ['sparkles', 'droplets', 'book', 'dumbbell', 'heart', 'brain', 'leaf', 'footprints', 'moon', 'sun', 'timer', 'check'];
  if (typeof value === 'string' && options.includes(value as HabitIconKey)) {
    return value as HabitIconKey;
  }
  return iconFallback;
};

const normalizeType = (value: unknown): HabitType => {
  return value === 'count' ? 'count' : 'binary';
};

const normalizeDateKey = (value: unknown, fallback = getTodayKey()): string => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(value) ? value : fallback;
};

const normalizeWeekdays = (value: unknown): Weekday[] => {
  if (!Array.isArray(value)) {
    return [0, 1, 2, 3, 4, 5, 6];
  }

  const days = [...new Set(value.filter((day): day is Weekday => typeof day === 'number' && day >= 0 && day <= 6))] as Weekday[];
  days.sort((a, b) => a - b);

  return days.length > 0 ? days : [0, 1, 2, 3, 4, 5, 6];
};

const sanitizeHabit = (input: unknown): Habit | null => {
  const record = toRecord(input);
  if (!record) {
    return null;
  }

  const name = toString(record.name).trim();
  if (!name) {
    return null;
  }

  const type = normalizeType(record.type);
  const targetValue = type === 'binary' ? 1 : Math.max(1, Math.round(toNumber(record.targetValue, 1)));
  const unit = type === 'binary' ? 'выполнено' : toString(record.unit, 'раз').trim() || 'раз';

  const frequencyRecord = toRecord(record.frequency);
  const frequencyMode = frequencyRecord?.mode === 'weekly' ? 'weekly' : 'daily';
  const frequencyDays: Weekday[] =
    frequencyMode === 'daily' ? [0, 1, 2, 3, 4, 5, 6] : normalizeWeekdays(frequencyRecord?.days);

  return {
    id: toString(record.id) || createId(),
    name,
    description: toString(record.description).trim() || undefined,
    color: toString(record.color) || colorFallback,
    icon: normalizeIcon(record.icon),
    type,
    targetValue,
    unit,
    frequency: {
      mode: frequencyMode,
      days: frequencyDays
    },
    startDate: normalizeDateKey(record.startDate),
    archived: toBoolean(record.archived, false),
    createdAt: toString(record.createdAt) || new Date().toISOString(),
    updatedAt: toString(record.updatedAt) || new Date().toISOString()
  };
};

const sanitizeEntries = (input: unknown, habits: Habit[]): HabitEntriesByDate => {
  const habitIds = new Set(habits.map((habit) => habit.id));
  const entriesRecord = toRecord(input);
  if (!entriesRecord) {
    return {};
  }

  const output: HabitEntriesByDate = {};

  for (const [dateKey, rawEntryMap] of Object.entries(entriesRecord)) {
    const entryMap = toRecord(rawEntryMap);
    if (!entryMap) {
      continue;
    }

    const cleanDate = normalizeDateKey(dateKey, '');
    if (!cleanDate) {
      continue;
    }

    const normalizedMap: Record<string, { value: number; updatedAt: string }> = {};

    for (const [habitId, rawEntry] of Object.entries(entryMap)) {
      if (!habitIds.has(habitId)) {
        continue;
      }

      const entryRecord = toRecord(rawEntry);
      if (!entryRecord) {
        continue;
      }

      const value = Math.max(0, Math.round(toNumber(entryRecord.value, 0)));
      normalizedMap[habitId] = {
        value,
        updatedAt: toString(entryRecord.updatedAt) || new Date().toISOString()
      };
    }

    if (Object.keys(normalizedMap).length > 0) {
      output[cleanDate] = normalizedMap;
    }
  }

  return output;
};

export const migrateAppData = (input: unknown): AppData | null => {
  const data = toRecord(input);
  if (!data) {
    return null;
  }

  const habitsInput = Array.isArray(data.habits) ? data.habits : [];
  const habits = habitsInput
    .map((habit) => sanitizeHabit(habit))
    .filter((habit): habit is Habit => Boolean(habit));

  const habitEntriesByDate = sanitizeEntries(data.habitEntriesByDate, habits);

  const settingsRecord = toRecord(data.settings);
  const settings = {
    theme: normalizeTheme(settingsRecord?.theme),
    hasSeenOnboarding: toBoolean(settingsRecord?.hasSeenOnboarding, false),
    seedDemoHabitsOnReset: toBoolean(settingsRecord?.seedDemoHabitsOnReset, true),
    updatedAt: toString(settingsRecord?.updatedAt) || new Date().toISOString()
  };

  const metaRecord = toRecord(data.meta);

  return {
    version: APP_DATA_VERSION,
    habits,
    habitEntriesByDate,
    settings,
    meta: {
      createdAt: toString(metaRecord?.createdAt) || new Date().toISOString(),
      lastUpdatedAt: toString(metaRecord?.lastUpdatedAt) || new Date().toISOString()
    }
  };
};

export const createInitialAppData = (withDemo: boolean): AppData => {
  if (!withDemo) {
    return createDefaultAppData();
  }

  const demo = createDemoBundle();
  const data = createDefaultAppData(demo.habits);
  data.habitEntriesByDate = demo.habitEntriesByDate;
  data.settings = {
    ...DEFAULT_SETTINGS,
    hasSeenOnboarding: false,
    seedDemoHabitsOnReset: true,
    updatedAt: new Date().toISOString()
  };
  data.meta.lastUpdatedAt = new Date().toISOString();
  return data;
};
