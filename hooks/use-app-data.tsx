'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { createDefaultAppData } from '@/lib/constants';
import { createInitialAppData } from '@/lib/migrations';
import { getTodayKey } from '@/lib/date';
import { createHabitFromInput, isHabitScheduledOnDate, updateHabitFromInput } from '@/lib/habit-utils';
import { clearStoredAppData, exportAppData, importAppData, loadAppData, saveAppData } from '@/lib/storage';
import { clamp } from '@/lib/utils';
import type { AppData, Habit, HabitFormInput, ThemePreference } from '@/types/habit';

interface AppDataContextValue {
  data: AppData;
  isHydrated: boolean;
  todayKey: string;
  habits: Habit[];
  activeHabits: Habit[];
  archivedHabits: Habit[];
  addHabit: (input: HabitFormInput) => void;
  updateHabit: (habitId: string, input: HabitFormInput) => void;
  deleteHabit: (habitId: string) => void;
  setHabitArchived: (habitId: string, archived: boolean) => void;
  toggleHabitForDate: (habitId: string, dateKey?: string) => void;
  adjustHabitValueForDate: (habitId: string, delta: number, dateKey?: string) => void;
  setHabitValueForDate: (habitId: string, value: number, dateKey?: string) => void;
  markAllTodayCompleted: () => void;
  updateTheme: (theme: ThemePreference) => void;
  completeOnboarding: (mode: 'keep-demo' | 'clear-demo') => void;
  toggleSeedDemoOnReset: (value: boolean) => void;
  resetAllData: (withDemo: boolean) => void;
  importFromJson: (raw: string) => { ok: true } | { ok: false; error: string };
  exportToJson: () => string;
  getHabitById: (habitId: string) => Habit | undefined;
}

const AppDataContext = createContext<AppDataContextValue | null>(null);

const touchLastUpdated = (data: AppData): AppData => {
  return {
    ...data,
    meta: {
      ...data.meta,
      lastUpdatedAt: new Date().toISOString()
    }
  };
};

const upsertEntryValue = (data: AppData, habit: Habit, dateKey: string, nextValue: number): AppData => {
  const normalizedValue = clamp(Math.round(nextValue), 0);
  const entriesForDate = data.habitEntriesByDate[dateKey] ?? {};

  const nextEntriesForDate = {
    ...entriesForDate,
    [habit.id]: {
      value: normalizedValue,
      updatedAt: new Date().toISOString()
    }
  };

  return touchLastUpdated({
    ...data,
    habitEntriesByDate: {
      ...data.habitEntriesByDate,
      [dateKey]: nextEntriesForDate
    }
  });
};

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<AppData>(() => createDefaultAppData());
  const [isHydrated, setHydrated] = useState(false);
  const [todayKey, setTodayKey] = useState(getTodayKey());

  useEffect(() => {
    const loaded = loadAppData();
    setData(loaded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    saveAppData(data);
  }, [data, isHydrated]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const current = getTodayKey();
      setTodayKey((prev) => (prev === current ? prev : current));
    }, 60_000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    const preference = data.settings.theme;
    if (preference === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(isDark ? 'dark' : 'light');
      return;
    }

    root.classList.add(preference);
  }, [data.settings.theme]);

  useEffect(() => {
    if (data.settings.theme !== 'system') {
      return;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = () => {
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(media.matches ? 'dark' : 'light');
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [data.settings.theme]);

  const habits = useMemo(() => [...data.habits].sort((a, b) => a.name.localeCompare(b.name)), [data.habits]);

  const activeHabits = useMemo(() => habits.filter((habit) => !habit.archived), [habits]);
  const archivedHabits = useMemo(() => habits.filter((habit) => habit.archived), [habits]);

  const getHabitById = useCallback(
    (habitId: string): Habit | undefined => {
      return habits.find((habit) => habit.id === habitId);
    },
    [habits]
  );

  const addHabit = useCallback((input: HabitFormInput) => {
    setData((prev) => {
      const habit = createHabitFromInput(input);
      return touchLastUpdated({
        ...prev,
        habits: [...prev.habits, habit]
      });
    });
  }, []);

  const updateHabit = useCallback((habitId: string, input: HabitFormInput) => {
    setData((prev) => {
      const targetHabit = prev.habits.find((habit) => habit.id === habitId);
      if (!targetHabit) {
        return prev;
      }

      const updated = updateHabitFromInput(targetHabit, input);
      updated.createdAt = targetHabit.createdAt;

      return touchLastUpdated({
        ...prev,
        habits: prev.habits.map((habit) => (habit.id === habitId ? updated : habit))
      });
    });
  }, []);

  const setHabitArchived = useCallback((habitId: string, archived: boolean) => {
    setData((prev) => {
      const exists = prev.habits.some((habit) => habit.id === habitId);
      if (!exists) {
        return prev;
      }

      return touchLastUpdated({
        ...prev,
        habits: prev.habits.map((habit) =>
          habit.id === habitId
            ? {
                ...habit,
                archived,
                updatedAt: new Date().toISOString()
              }
            : habit
        )
      });
    });
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    setData((prev) => {
      const habitExists = prev.habits.some((habit) => habit.id === habitId);
      if (!habitExists) {
        return prev;
      }

      const nextEntries = Object.fromEntries(
        Object.entries(prev.habitEntriesByDate).map(([dateKey, entries]) => {
          const entryCopy = { ...entries };
          delete entryCopy[habitId];
          return [dateKey, entryCopy];
        })
      );

      return touchLastUpdated({
        ...prev,
        habits: prev.habits.filter((habit) => habit.id !== habitId),
        habitEntriesByDate: nextEntries
      });
    });
  }, []);

  const setHabitValueForDate = useCallback(
    (habitId: string, value: number, dateKey = todayKey) => {
      setData((prev) => {
        const habit = prev.habits.find((item) => item.id === habitId);
        if (!habit) {
          return prev;
        }

        const maxValue = habit.type === 'binary' ? 1 : Number.MAX_SAFE_INTEGER;
        const normalizedValue = clamp(value, 0, maxValue);
        return upsertEntryValue(prev, habit, dateKey, normalizedValue);
      });
    },
    [todayKey]
  );

  const adjustHabitValueForDate = useCallback(
    (habitId: string, delta: number, dateKey = todayKey) => {
      setData((prev) => {
        const habit = prev.habits.find((item) => item.id === habitId);
        if (!habit) {
          return prev;
        }

        const current = prev.habitEntriesByDate[dateKey]?.[habitId]?.value ?? 0;
        const maxValue = habit.type === 'binary' ? 1 : Number.MAX_SAFE_INTEGER;
        const nextValue = clamp(current + delta, 0, maxValue);

        return upsertEntryValue(prev, habit, dateKey, nextValue);
      });
    },
    [todayKey]
  );

  const toggleHabitForDate = useCallback(
    (habitId: string, dateKey = todayKey) => {
      setData((prev) => {
        const habit = prev.habits.find((item) => item.id === habitId);
        if (!habit) {
          return prev;
        }

        if (habit.type === 'count') {
          const currentValue = prev.habitEntriesByDate[dateKey]?.[habitId]?.value ?? 0;
          const nextValue = currentValue >= habit.targetValue ? 0 : habit.targetValue;
          return upsertEntryValue(prev, habit, dateKey, nextValue);
        }

        const current = prev.habitEntriesByDate[dateKey]?.[habitId]?.value ?? 0;
        const next = current >= 1 ? 0 : 1;
        return upsertEntryValue(prev, habit, dateKey, next);
      });
    },
    [todayKey]
  );

  const markAllTodayCompleted = useCallback(() => {
    setData((prev) => {
      const scheduled = prev.habits.filter((habit) => !habit.archived).filter((habit) => isHabitScheduledOnDate(habit, todayKey));
      if (scheduled.length === 0) {
        return prev;
      }

      let nextData = prev;
      for (const habit of scheduled) {
        nextData = upsertEntryValue(nextData, habit, todayKey, habit.targetValue);
      }

      return touchLastUpdated(nextData);
    });
  }, [todayKey]);

  const updateTheme = useCallback((theme: ThemePreference) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme,
        updatedAt: new Date().toISOString()
      }
    }));
  }, []);

  const toggleSeedDemoOnReset = useCallback((value: boolean) => {
    setData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        seedDemoHabitsOnReset: value,
        updatedAt: new Date().toISOString()
      }
    }));
  }, []);

  const completeOnboarding = useCallback((mode: 'keep-demo' | 'clear-demo') => {
    setData((prev) => {
      const clearDemo = mode === 'clear-demo';
      const base = clearDemo ? createInitialAppData(false) : prev;

      return {
        ...base,
        settings: {
          ...base.settings,
          hasSeenOnboarding: true,
          seedDemoHabitsOnReset: clearDemo ? false : base.settings.seedDemoHabitsOnReset,
          theme: prev.settings.theme,
          updatedAt: new Date().toISOString()
        },
        meta: {
          ...base.meta,
          lastUpdatedAt: new Date().toISOString()
        }
      };
    });
  }, []);

  const resetAllData = useCallback((withDemo: boolean) => {
    setData((prev) => {
      const fresh = createInitialAppData(withDemo);
      return {
        ...fresh,
        settings: {
          ...fresh.settings,
          theme: prev.settings.theme,
          seedDemoHabitsOnReset: prev.settings.seedDemoHabitsOnReset,
          hasSeenOnboarding: true,
          updatedAt: new Date().toISOString()
        }
      };
    });
  }, []);

  const importFromJson = useCallback((raw: string) => {
    const result = importAppData(raw);
    if (!result.ok) {
      return result;
    }

    setData({
      ...result.data,
      settings: {
        ...result.data.settings,
        hasSeenOnboarding: true,
        updatedAt: new Date().toISOString()
      },
      meta: {
        ...result.data.meta,
        lastUpdatedAt: new Date().toISOString()
      }
    });

    return { ok: true as const };
  }, []);

  const exportToJson = useCallback(() => {
    return exportAppData(data);
  }, [data]);

  const contextValue = useMemo<AppDataContextValue>(
    () => ({
      data,
      isHydrated,
      todayKey,
      habits,
      activeHabits,
      archivedHabits,
      addHabit,
      updateHabit,
      deleteHabit,
      setHabitArchived,
      toggleHabitForDate,
      adjustHabitValueForDate,
      setHabitValueForDate,
      markAllTodayCompleted,
      updateTheme,
      completeOnboarding,
      toggleSeedDemoOnReset,
      resetAllData,
      importFromJson,
      exportToJson,
      getHabitById
    }),
    [
      data,
      isHydrated,
      todayKey,
      habits,
      activeHabits,
      archivedHabits,
      addHabit,
      updateHabit,
      deleteHabit,
      setHabitArchived,
      toggleHabitForDate,
      adjustHabitValueForDate,
      setHabitValueForDate,
      markAllTodayCompleted,
      updateTheme,
      completeOnboarding,
      toggleSeedDemoOnReset,
      resetAllData,
      importFromJson,
      exportToJson,
      getHabitById
    ]
  );

  return <AppDataContext.Provider value={contextValue}>{children}</AppDataContext.Provider>;
}

export const useAppData = (): AppDataContextValue => {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error('useAppData must be used inside AppDataProvider');
  }

  return context;
};

export const useHardResetStorage = () => {
  return useCallback(() => {
    clearStoredAppData();
  }, []);
};
