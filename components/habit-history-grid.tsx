'use client';

import { useMemo } from 'react';
import { addDays, formatMonthLabel, getTodayKey, parseDateKey, toDateKey } from '@/lib/date';
import { getHabitProgressOnDate, isHabitScheduledOnDate } from '@/lib/habit-utils';
import { cn } from '@/lib/utils';
import type { AppData, Habit } from '@/types/habit';

interface HabitHistoryGridProps {
  habit: Habit;
  data: AppData;
  days?: number;
}

export function HabitHistoryGrid({ habit, data, days = 84 }: HabitHistoryGridProps) {
  const todayKey = getTodayKey();

  const cells = useMemo(() => {
    const today = parseDateKey(todayKey);
    const output: { dateKey: string; status: 'none' | 'missed' | 'partial' | 'done'; label: string }[] = [];

    for (let offset = days - 1; offset >= 0; offset -= 1) {
      const date = addDays(today, -offset);
      const dateKey = toDateKey(date);

      if (!isHabitScheduledOnDate(habit, dateKey)) {
        output.push({ dateKey, status: 'none', label: '-' });
        continue;
      }

      const { value, completed, progress } = getHabitProgressOnDate(habit, data, dateKey);

      if (completed) {
        output.push({ dateKey, status: 'done', label: habit.type === 'binary' ? 'done' : `${value}/${habit.targetValue}` });
      } else if (value > 0 && progress > 0) {
        output.push({ dateKey, status: 'partial', label: `${value}/${habit.targetValue}` });
      } else {
        output.push({ dateKey, status: 'missed', label: '0' });
      }
    }

    return output;
  }, [data, days, habit, todayKey]);

  const monthLabel = formatMonthLabel(todayKey);

  return (
    <section className="rounded-[28px] border border-border/90 bg-card/95 p-4 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-text">История (12 недель)</h3>
        <p className="text-xs text-muted">До {monthLabel}</p>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((cell) => (
          <div
            key={cell.dateKey}
            className={cn(
              'aspect-square rounded-lg border text-[9px] font-medium leading-none',
              cell.status === 'none' && 'border-transparent bg-surface/50 text-transparent',
              cell.status === 'missed' && 'border-border bg-surface text-muted',
              cell.status === 'partial' && 'border-accent/40 bg-accent/15 text-accent',
              cell.status === 'done' && 'border-accent bg-accent text-[#0D1117]'
            )}
            title={`${cell.dateKey}: ${cell.label}`}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-surface" /> Пропуск
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-accent/60" /> Частично
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-accent" /> Выполнено
        </span>
      </div>
    </section>
  );
}
