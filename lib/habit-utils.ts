import { addDays, compareDateKeys, getTodayKey, parseDateKey, toDateKey } from '@/lib/date';
import { createId } from '@/lib/id';
import type { AppData, Habit, HabitEntry, HabitFormInput, HabitStats, Weekday } from '@/types/habit';

const allWeekdays: Weekday[] = [0, 1, 2, 3, 4, 5, 6];

export const normalizeFrequencyDays = (mode: Habit['frequency']['mode'], days: Weekday[]): Weekday[] => {
  if (mode === 'daily') {
    return allWeekdays;
  }

  const uniqueSorted = [...new Set(days)]
    .filter((day): day is Weekday => day >= 0 && day <= 6)
    .sort((a, b) => a - b);

  return uniqueSorted.length > 0 ? uniqueSorted : [1, 2, 3, 4, 5];
};

export const createHabitFromInput = (input: HabitFormInput, existingId?: string): Habit => {
  const now = new Date().toISOString();
  const targetValue = input.type === 'binary' ? 1 : Math.max(1, Math.round(input.targetValue));
  const unit = input.type === 'binary' ? 'выполнено' : input.unit.trim() || 'раз';

  return {
    id: existingId ?? createId(),
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
    color: input.color,
    icon: input.icon,
    type: input.type,
    targetValue,
    unit,
    frequency: {
      mode: input.frequencyMode,
      days: normalizeFrequencyDays(input.frequencyMode, input.frequencyDays)
    },
    startDate: input.startDate,
    archived: input.archived ?? false,
    createdAt: now,
    updatedAt: now
  };
};

export const updateHabitFromInput = (habit: Habit, input: HabitFormInput): Habit => {
  const targetValue = input.type === 'binary' ? 1 : Math.max(1, Math.round(input.targetValue));
  const unit = input.type === 'binary' ? 'выполнено' : input.unit.trim() || 'раз';

  return {
    ...habit,
    name: input.name.trim(),
    description: input.description?.trim() || undefined,
    color: input.color,
    icon: input.icon,
    type: input.type,
    targetValue,
    unit,
    frequency: {
      mode: input.frequencyMode,
      days: normalizeFrequencyDays(input.frequencyMode, input.frequencyDays)
    },
    startDate: input.startDate,
    archived: input.archived ?? false,
    updatedAt: new Date().toISOString()
  };
};

export const isHabitScheduledOnDate = (habit: Habit, dateKey: string): boolean => {
  if (compareDateKeys(dateKey, habit.startDate) < 0) {
    return false;
  }

  if (habit.frequency.mode === 'daily') {
    return true;
  }

  const weekday = parseDateKey(dateKey).getDay() as Weekday;
  return habit.frequency.days.includes(weekday);
};

export const getEntryForDate = (data: AppData, habitId: string, dateKey: string): HabitEntry | undefined => {
  return data.habitEntriesByDate[dateKey]?.[habitId];
};

export const getEntryValueForDate = (data: AppData, habitId: string, dateKey: string): number => {
  const raw = getEntryForDate(data, habitId, dateKey)?.value;
  return typeof raw === 'number' && Number.isFinite(raw) ? raw : 0;
};

export const getHabitProgressOnDate = (habit: Habit, data: AppData, dateKey: string) => {
  const value = getEntryValueForDate(data, habit.id, dateKey);
  const target = habit.type === 'binary' ? 1 : Math.max(1, habit.targetValue);
  const progress = Math.max(0, Math.min(1, value / target));
  const completed = value >= target;

  return {
    value,
    target,
    progress,
    completed
  };
};

export const isHabitCompletedOnDate = (habit: Habit, data: AppData, dateKey: string): boolean => {
  return getHabitProgressOnDate(habit, data, dateKey).completed;
};

export const getTodayHabits = (habits: Habit[], todayKey = getTodayKey()): Habit[] => {
  return habits
    .filter((habit) => !habit.archived)
    .filter((habit) => isHabitScheduledOnDate(habit, todayKey))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getCompletionRate = (habit: Habit, data: AppData, days: number, todayKey = getTodayKey()): number => {
  const today = parseDateKey(todayKey);
  let scheduledDays = 0;
  let doneDays = 0;

  for (let index = days - 1; index >= 0; index -= 1) {
    const date = addDays(today, -index);
    const key = toDateKey(date);

    if (!isHabitScheduledOnDate(habit, key)) {
      continue;
    }

    scheduledDays += 1;

    if (isHabitCompletedOnDate(habit, data, key)) {
      doneDays += 1;
    }
  }

  if (scheduledDays === 0) {
    return 0;
  }

  return Math.round((doneDays / scheduledDays) * 100);
};

export const getHabitStats = (habit: Habit, data: AppData, todayKey = getTodayKey()): HabitStats => {
  let currentStreak = 0;
  let bestStreak = 0;
  let runningStreak = 0;
  let totalCompletedDays = 0;
  let totalValue = 0;

  let cursor = parseDateKey(habit.startDate);
  const today = parseDateKey(todayKey);

  while (cursor <= today) {
    const key = toDateKey(cursor);

    if (isHabitScheduledOnDate(habit, key)) {
      const progress = getHabitProgressOnDate(habit, data, key);
      totalValue += progress.value;

      if (progress.completed) {
        runningStreak += 1;
        totalCompletedDays += 1;
      } else {
        runningStreak = 0;
      }

      if (runningStreak > bestStreak) {
        bestStreak = runningStreak;
      }
    }

    cursor = addDays(cursor, 1);
  }

  let backwards = today;
  while (compareDateKeys(toDateKey(backwards), habit.startDate) >= 0) {
    const key = toDateKey(backwards);

    if (!isHabitScheduledOnDate(habit, key)) {
      backwards = addDays(backwards, -1);
      continue;
    }

    if (isHabitCompletedOnDate(habit, data, key)) {
      currentStreak += 1;
      backwards = addDays(backwards, -1);
      continue;
    }

    break;
  }

  const completionRate7d = getCompletionRate(habit, data, 7, todayKey);
  const completionRate30d = getCompletionRate(habit, data, 30, todayKey);

  return {
    currentStreak,
    bestStreak,
    completionRate7d,
    completionRate30d,
    totalCompletedDays,
    totalValue
  };
};

export const countCompletedToday = (habits: Habit[], data: AppData, todayKey = getTodayKey()): { done: number; total: number } => {
  const scheduledHabits = habits.filter((habit) => isHabitScheduledOnDate(habit, todayKey));

  const done = scheduledHabits.filter((habit) => isHabitCompletedOnDate(habit, data, todayKey)).length;

  return {
    done,
    total: scheduledHabits.length
  };
};
