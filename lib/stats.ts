import { addDays, getTodayKey, parseDateKey, toDateKey } from '@/lib/date';
import { getHabitProgressOnDate, isHabitScheduledOnDate } from '@/lib/habit-utils';
import type { AppData, Habit } from '@/types/habit';

export interface OverallStats {
  activeHabits: number;
  completedToday: number;
  totalToday: number;
  completionRate7d: number;
  completionRate30d: number;
}

export const getOverallStats = (habits: Habit[], data: AppData, todayKey = getTodayKey()): OverallStats => {
  const activeHabits = habits.filter((habit) => !habit.archived);
  const scheduledToday = activeHabits.filter((habit) => isHabitScheduledOnDate(habit, todayKey));
  const completedToday = scheduledToday.filter((habit) => getHabitProgressOnDate(habit, data, todayKey).completed).length;

  return {
    activeHabits: activeHabits.length,
    completedToday,
    totalToday: scheduledToday.length,
    completionRate7d: getOverallCompletionRate(activeHabits, data, 7, todayKey),
    completionRate30d: getOverallCompletionRate(activeHabits, data, 30, todayKey)
  };
};

export const getOverallCompletionRate = (habits: Habit[], data: AppData, days: number, todayKey = getTodayKey()): number => {
  if (habits.length === 0) {
    return 0;
  }

  const today = parseDateKey(todayKey);
  let scheduled = 0;
  let done = 0;

  for (let offset = 0; offset < days; offset += 1) {
    const date = addDays(today, -offset);
    const key = toDateKey(date);

    for (const habit of habits) {
      if (habit.archived || !isHabitScheduledOnDate(habit, key)) {
        continue;
      }

      scheduled += 1;
      if (getHabitProgressOnDate(habit, data, key).completed) {
        done += 1;
      }
    }
  }

  if (scheduled === 0) {
    return 0;
  }

  return Math.round((done / scheduled) * 100);
};
