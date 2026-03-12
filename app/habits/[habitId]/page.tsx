'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Archive, ArchiveRestore, Trash2, PencilLine } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { HabitFormModal } from '@/components/habit-form-modal';
import { HabitHistoryGrid } from '@/components/habit-history-grid';
import { StatPill } from '@/components/stat-pill';
import { addDays, formatDateLabel, parseDateKey, toDateKey } from '@/lib/date';
import { iconByKey } from '@/lib/habit-icons';
import { getHabitProgressOnDate, getHabitStats, isHabitScheduledOnDate } from '@/lib/habit-utils';
import { cn } from '@/lib/utils';
import { useAppData } from '@/hooks/use-app-data';

export default function HabitDetailsPage() {
  const params = useParams<{ habitId: string }>();
  const router = useRouter();
  const habitId = params.habitId;

  const { data, todayKey, getHabitById, toggleHabitForDate, adjustHabitValueForDate, updateHabit, deleteHabit, setHabitArchived } = useAppData();

  const habit = getHabitById(habitId);
  const [isFormOpen, setFormOpen] = useState(false);

  const recentRows = useMemo(() => {
    if (!habit) {
      return [];
    }

    const today = parseDateKey(todayKey);
    const rows: { dateKey: string; value: number; target: number; completed: boolean; scheduled: boolean }[] = [];

    for (let offset = 0; offset < 21; offset += 1) {
      const date = addDays(today, -offset);
      const dateKey = toDateKey(date);
      const scheduled = isHabitScheduledOnDate(habit, dateKey);
      const progress = getHabitProgressOnDate(habit, data, dateKey);

      rows.push({
        dateKey,
        value: progress.value,
        target: progress.target,
        completed: progress.completed,
        scheduled
      });
    }

    return rows;
  }, [data, habit, todayKey]);

  if (!habit) {
    return (
      <AppShell title="Привычка" subtitle="Не найдена">
        <div className="rounded-[30px] border border-border/90 bg-card/95 p-6 text-center shadow-soft">
          <p className="text-sm text-muted">Привычка не найдена. Возможно, она была удалена.</p>
          <Link href="/habits" className="mt-4 inline-flex rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-[#0D1117]">
            К привычкам
          </Link>
        </div>
      </AppShell>
    );
  }

  const Icon = iconByKey(habit.icon);
  const todayProgress = getHabitProgressOnDate(habit, data, todayKey);
  const stats = getHabitStats(habit, data, todayKey);
  const isTodayScheduled = isHabitScheduledOnDate(habit, todayKey);

  return (
    <>
      <AppShell
        title={habit.name}
        subtitle={habit.archived ? 'Привычка в архиве' : 'Детали привычки'}
        actions={
          <button
            type="button"
            onClick={() => setFormOpen(true)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-card text-text transition active:scale-95"
            aria-label="Редактировать привычку"
          >
            <PencilLine className="h-5 w-5" />
          </button>
        }
      >
        <Link href="/habits" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted">
          <ArrowLeft className="h-4 w-4" />
          Назад к привычкам
        </Link>

        <section className="rounded-[30px] border border-border/90 bg-card/95 p-4 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-[#0D1117]" style={{ backgroundColor: habit.color }}>
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm text-muted">Прогресс за сегодня</p>
              <p className="text-xl font-semibold text-text">
                {todayProgress.value}/{todayProgress.target} {habit.type === 'count' ? habit.unit : ''}
              </p>
            </div>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-border/70">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${Math.max(6, Math.round(todayProgress.progress * 100))}%`, backgroundColor: habit.color }}
            />
          </div>

          {isTodayScheduled ? (
            <div className="mt-4 flex gap-2">
              {habit.type === 'count' ? (
                <>
                  <button
                    type="button"
                    onClick={() => adjustHabitValueForDate(habit.id, -1, todayKey)}
                    className="flex-1 rounded-2xl border border-border bg-surface px-3 py-3 text-sm font-semibold text-text transition active:scale-95"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleHabitForDate(habit.id, todayKey)}
                    className="flex-1 rounded-2xl bg-accent px-3 py-3 text-sm font-semibold text-[#0D1117] transition active:scale-95"
                  >
                    {todayProgress.completed ? 'Сбросить' : 'Поставить цель'}
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustHabitValueForDate(habit.id, 1, todayKey)}
                    className="flex-1 rounded-2xl border border-border bg-surface px-3 py-3 text-sm font-semibold text-text transition active:scale-95"
                  >
                    +1
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => toggleHabitForDate(habit.id, todayKey)}
                  className="w-full rounded-2xl bg-accent px-3 py-3 text-sm font-semibold text-[#0D1117] transition active:scale-95"
                >
                  {todayProgress.completed ? 'Отметить как невыполнено' : 'Отметить как выполнено'}
                </button>
              )}
            </div>
          ) : (
            <p className="mt-4 rounded-2xl border border-border bg-surface px-3 py-3 text-sm text-muted">Эта привычка не запланирована на сегодня.</p>
          )}
        </section>

        <section className="mt-4 grid grid-cols-2 gap-2">
          <StatPill label="Текущая серия" value={`${stats.currentStreak} дн.`} tone="accent" />
          <StatPill label="Лучшая серия" value={`${stats.bestStreak} дн.`} />
          <StatPill label="За 7 дней" value={`${stats.completionRate7d}%`} />
          <StatPill label="За 30 дней" value={`${stats.completionRate30d}%`} />
          <StatPill label="Всего выполнено" value={`${stats.totalCompletedDays}`} />
          <StatPill
            label={habit.type === 'count' ? `Всего ${habit.unit}` : 'Всего отметок'}
            value={`${habit.type === 'count' ? stats.totalValue : stats.totalCompletedDays}`}
          />
        </section>

        <div className="mt-4">
          <HabitHistoryGrid habit={habit} data={data} />
        </div>

        <section className="mt-4 rounded-[30px] border border-border/90 bg-card/95 p-4 shadow-soft">
          <h3 className="mb-3 text-base font-semibold text-text">Последние записи</h3>
          <div className="space-y-2">
            {recentRows.map((row) => (
              <div
                key={row.dateKey}
                className={cn(
                  'flex items-center justify-between rounded-2xl border px-3 py-2 text-sm',
                  !row.scheduled && 'border-transparent bg-surface/60 text-muted',
                  row.scheduled && row.completed && 'border-accent/40 bg-accent/10',
                  row.scheduled && !row.completed && 'border-border bg-surface'
                )}
              >
                <span className="text-muted">{formatDateLabel(row.dateKey)}</span>
                <span className="font-semibold text-text">
                  {row.scheduled ? `${row.value}/${row.target}${habit.type === 'count' ? ` ${habit.unit}` : ''}` : 'Не запланировано'}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setHabitArchived(habit.id, !habit.archived)}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-3 py-3 text-sm font-semibold text-text transition active:scale-95"
          >
            {habit.archived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            {habit.archived ? 'Из архива' : 'В архив'}
          </button>

          <button
            type="button"
            onClick={() => {
              const confirmed = window.confirm(`Удалить «${habit.name}» навсегда?`);
              if (!confirmed) {
                return;
              }
              deleteHabit(habit.id);
              router.replace('/habits');
            }}
            className="flex items-center justify-center gap-2 rounded-2xl border border-red-300 bg-red-50 px-3 py-3 text-sm font-semibold text-red-600 transition active:scale-95 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
          >
            <Trash2 className="h-4 w-4" />
            Удалить
          </button>
        </section>
      </AppShell>

      <HabitFormModal
        open={isFormOpen}
        habit={habit}
        onClose={() => setFormOpen(false)}
        onSubmit={(input) => {
          updateHabit(habit.id, input);
          setFormOpen(false);
        }}
        onDelete={() => {
          const confirmed = window.confirm(`Удалить «${habit.name}» навсегда?`);
          if (!confirmed) {
            return;
          }
          deleteHabit(habit.id);
          router.replace('/habits');
        }}
      />
    </>
  );
}
