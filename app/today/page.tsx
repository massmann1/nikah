'use client';

import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { EmptyState } from '@/components/empty-state';
import { HabitCard } from '@/components/habit-card';
import { HabitFormModal } from '@/components/habit-form-modal';
import { WEEKDAY_LABELS_SHORT } from '@/lib/constants';
import { addDays, formatLongDate, parseDateKey, toDateKey } from '@/lib/date';
import { getHabitProgressOnDate, getHabitStats, isHabitScheduledOnDate } from '@/lib/habit-utils';
import { useAppData } from '@/hooks/use-app-data';
import { cn } from '@/lib/utils';
import type { Habit } from '@/types/habit';

export default function TodayPage() {
  const router = useRouter();
  const {
    data,
    isHydrated,
    todayKey,
    activeHabits,
    addHabit,
    updateHabit,
    toggleHabitForDate,
    adjustHabitValueForDate
  } = useAppData();

  const [isFormOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  const todayHabits = useMemo(() => {
    const list = activeHabits
      .filter((habit) => isHabitScheduledOnDate(habit, todayKey))
      .map((habit) => {
        const progress = getHabitProgressOnDate(habit, data, todayKey);
        const stats = getHabitStats(habit, data, todayKey);
        return {
          habit,
          ...progress,
          streak: stats.currentStreak
        };
      })
      .sort((a, b) => Number(a.completed) - Number(b.completed));

    return list;
  }, [activeHabits, data, todayKey]);

  const completedCount = todayHabits.filter((habit) => habit.completed).length;
  const completionPercent = todayHabits.length === 0 ? 0 : Math.round((completedCount / todayHabits.length) * 100);
  const weekStrip = useMemo(() => {
    const today = parseDateKey(todayKey);
    return Array.from({ length: 7 }, (_, index) => addDays(today, index - 3)).map((date) => {
      const dateKey = toDateKey(date);
      const scheduled = activeHabits.filter((habit) => isHabitScheduledOnDate(habit, dateKey));
      const done = scheduled.filter((habit) => getHabitProgressOnDate(habit, data, dateKey).completed).length;
      const percent = scheduled.length === 0 ? 0 : Math.round((done / scheduled.length) * 100);

      return {
        dateKey,
        dayOfMonth: date.getDate(),
        weekdayLabel: WEEKDAY_LABELS_SHORT[date.getDay()],
        isToday: dateKey === todayKey,
        percent
      };
    });
  }, [todayKey, activeHabits, data]);

  const closeForm = () => {
    setEditingHabit(undefined);
    setFormOpen(false);
  };

  return (
    <>
      <AppShell
        title="Сегодня"
        subtitle={`${formatLongDate(todayKey)} · ${completedCount}/${todayHabits.length || 0} выполнено`}
        actions={
          <button
            type="button"
            onClick={() => {
              setEditingHabit(undefined);
              setFormOpen(true);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-[#0D1117] shadow-card transition active:scale-95"
            aria-label="Создать привычку"
          >
            <Plus className="h-5 w-5" />
          </button>
        }
      >
        {!isHydrated ? (
          <div className="space-y-3">
            <div className="h-24 animate-pulse rounded-3xl bg-card" />
            <div className="h-24 animate-pulse rounded-3xl bg-card" />
          </div>
        ) : (
          <>
            {todayHabits.length === 0 ? (
              <EmptyState
                title="На сегодня привычек нет"
                description="Создайте первую привычку или измените частоту, чтобы она показывалась в этот день недели."
                action={
                  <button
                    type="button"
                    onClick={() => setFormOpen(true)}
                    className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-[#0D1117]"
                  >
                    Создать привычку
                  </button>
                }
              />
            ) : (
              <>
                <section className="mb-4 overflow-hidden rounded-[30px] border border-border/90 bg-card/95 p-4 shadow-soft">
                  <div className="mb-3 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {weekStrip.map((day) => (
                      <div
                        key={day.dateKey}
                        className={cn(
                          'min-w-[50px] rounded-2xl border px-2 py-2 text-center',
                          day.isToday && 'border-accent bg-accent text-[#0D1117]',
                          !day.isToday && day.percent === 100 && 'border-accent/40 bg-accent/15 text-accent',
                          !day.isToday && day.percent < 100 && 'border-border bg-surface text-muted'
                        )}
                      >
                        <p className={cn('text-[11px] font-semibold uppercase', day.isToday ? 'text-[#0D1117]/70' : 'text-muted')}>
                          {day.weekdayLabel}
                        </p>
                        <p className="mt-0.5 text-base font-semibold">{day.dayOfMonth}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Сегодняшний прогресс</p>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-5xl font-semibold leading-none tracking-[-0.03em] text-text">{completionPercent}%</div>
                      <div className="mt-2 text-sm text-muted">
                        Выполнено: <span className="font-semibold text-text">{completedCount}</span> из {todayHabits.length}
                      </div>
                    </div>

                    <div
                      className="relative h-[76px] w-[76px] shrink-0 rounded-full"
                      style={{
                        background: `conic-gradient(hsl(var(--accent)) ${Math.max(3.6, completionPercent * 3.6)}deg, hsl(var(--border)) 0deg)`
                      }}
                    >
                      <div className="absolute inset-[7px] flex items-center justify-center rounded-full bg-card text-sm font-semibold text-text">
                        {Math.max(0, todayHabits.length - completedCount)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-border/70">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-300"
                      style={{ width: `${Math.max(6, completionPercent)}%` }}
                    />
                  </div>
                </section>

                <div className="space-y-3 pb-2">
                  {todayHabits.map((item) => (
                    <HabitCard
                      key={item.habit.id}
                      habit={item.habit}
                      value={item.value}
                      target={item.target}
                      progress={item.progress}
                      completed={item.completed}
                      streak={item.streak}
                      onToggle={() => toggleHabitForDate(item.habit.id, todayKey)}
                      onIncrease={(delta) => adjustHabitValueForDate(item.habit.id, delta, todayKey)}
                      onDecrease={(delta) => adjustHabitValueForDate(item.habit.id, -delta, todayKey)}
                      onOpenDetails={() => router.push(`/habits/${item.habit.id}`)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </AppShell>

      <HabitFormModal
        open={isFormOpen}
        habit={editingHabit}
        onClose={closeForm}
        onSubmit={(input) => {
          if (editingHabit) {
            updateHabit(editingHabit.id, input);
          } else {
            addHabit(input);
          }
          closeForm();
        }}
      />
    </>
  );
}
