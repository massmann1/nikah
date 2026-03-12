import { addDays, getTodayKey, parseDateKey, toDateKey } from '@/lib/date';
import { createId } from '@/lib/id';
import type { Habit, HabitEntriesByDate } from '@/types/habit';

interface DemoBundle {
  habits: Habit[];
  habitEntriesByDate: HabitEntriesByDate;
}

export const createDemoBundle = (todayKey = getTodayKey()): DemoBundle => {
  const now = new Date().toISOString();
  const startDate = toDateKey(addDays(parseDateKey(todayKey), -14));

  const habits: Habit[] = [
    {
      id: createId(),
      name: 'Утренняя прогулка',
      description: '20 минут на улице перед работой.',
      color: '#5DADE2',
      icon: 'footprints',
      type: 'binary',
      targetValue: 1,
      unit: 'выполнено',
      frequency: { mode: 'daily', days: [0, 1, 2, 3, 4, 5, 6] },
      startDate,
      archived: false,
      createdAt: now,
      updatedAt: now
    },
    {
      id: createId(),
      name: 'Чтение',
      description: 'Спокойная ежедневная практика чтения.',
      color: '#9B8AFB',
      icon: 'book',
      type: 'count',
      targetValue: 30,
      unit: 'мин',
      frequency: { mode: 'daily', days: [0, 1, 2, 3, 4, 5, 6] },
      startDate,
      archived: false,
      createdAt: now,
      updatedAt: now
    },
    {
      id: createId(),
      name: 'Вода',
      description: 'Пейте воду равномерно в течение дня.',
      color: '#49C1A2',
      icon: 'droplets',
      type: 'count',
      targetValue: 8,
      unit: 'стаканов',
      frequency: { mode: 'daily', days: [0, 1, 2, 3, 4, 5, 6] },
      startDate,
      archived: false,
      createdAt: now,
      updatedAt: now
    },
    {
      id: createId(),
      name: 'Тренировка',
      description: 'Короткая и сфокусированная тренировка.',
      color: '#FF7A59',
      icon: 'dumbbell',
      type: 'binary',
      targetValue: 1,
      unit: 'выполнено',
      frequency: { mode: 'weekly', days: [1, 3, 5] },
      startDate,
      archived: false,
      createdAt: now,
      updatedAt: now
    }
  ];

  const entries: HabitEntriesByDate = {};
  const walkPattern = [1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0];
  const readPattern = [20, 35, 10, 40, 25, 30, 50, 15, 30, 45, 30, 10, 35, 60, 20];
  const waterPattern = [6, 8, 7, 8, 5, 9, 8, 6, 8, 10, 7, 8, 8, 6, 9];

  for (let index = 0; index < 15; index += 1) {
    const date = toDateKey(addDays(parseDateKey(startDate), index));
    entries[date] = {
      [habits[0].id]: { value: walkPattern[index], updatedAt: now },
      [habits[1].id]: { value: readPattern[index], updatedAt: now },
      [habits[2].id]: { value: waterPattern[index], updatedAt: now }
    };

    if ([1, 3, 5].includes(parseDateKey(date).getDay())) {
      entries[date][habits[3].id] = { value: index % 2 === 0 ? 1 : 0, updatedAt: now };
    }
  }

  return {
    habits,
    habitEntriesByDate: entries
  };
};
