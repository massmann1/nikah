'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Archive, ArchiveRestore, Plus, ChevronRight } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { EmptyState } from '@/components/empty-state';
import { HabitFormModal } from '@/components/habit-form-modal';
import { iconByKey } from '@/lib/habit-icons';
import { getHabitStats } from '@/lib/habit-utils';
import { useAppData } from '@/hooks/use-app-data';
import { cn } from '@/lib/utils';
import type { Habit } from '@/types/habit';

function HabitListItem({
  habit,
  archived,
  currentStreak,
  bestStreak,
  onEdit,
  onArchiveToggle
}: {
  habit: Habit;
  archived: boolean;
  currentStreak: number;
  bestStreak: number;
  onEdit: () => void;
  onArchiveToggle: () => void;
}) {
  const Icon = iconByKey(habit.icon);

  return (
    <article
      className={cn(
        'rounded-[30px] border border-border/90 bg-card/95 p-4 shadow-soft backdrop-blur-xl transition duration-200',
        archived && 'opacity-75'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl text-[#0D1117]" style={{ backgroundColor: habit.color }}>
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-text">{habit.name}</h3>
              <p className="truncate text-sm text-muted">{habit.type === 'binary' ? 'Бинарная привычка' : `${habit.targetValue} ${habit.unit}`}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
            <span className="rounded-full border border-border bg-surface px-2.5 py-1">Серия: {currentStreak}</span>
            <span className="rounded-full border border-border bg-surface px-2.5 py-1">Лучшая: {bestStreak}</span>
            <span className="rounded-full border border-border bg-surface px-2.5 py-1">
              {habit.frequency.mode === 'daily' ? 'Каждый день' : `${habit.frequency.days.length} дн./нед.`}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text transition active:scale-95"
          >
            Ред.
          </button>
          <button
            type="button"
            onClick={onArchiveToggle}
            className={cn(
              'rounded-xl px-3 py-2 text-xs font-semibold transition active:scale-95',
              archived ? 'bg-accent text-[#0D1117]' : 'border border-border bg-surface text-muted'
            )}
          >
            {archived ? 'Из архива' : 'В архив'}
          </button>
        </div>
      </div>

      <Link
        href={`/habits/${habit.id}`}
        className="mt-4 flex items-center justify-between rounded-2xl border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition active:scale-[0.99]"
      >
        Детали и история
        <ChevronRight className="h-4 w-4 text-muted" />
      </Link>
    </article>
  );
}

export default function HabitsPage() {
  const { data, todayKey, activeHabits, archivedHabits, addHabit, updateHabit, deleteHabit, setHabitArchived } = useAppData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>();

  const statsByHabit = useMemo(() => {
    return new Map(data.habits.map((habit) => [habit.id, getHabitStats(habit, data, todayKey)]));
  }, [data, todayKey]);

  const closeForm = () => {
    setEditingHabit(undefined);
    setFormOpen(false);
  };

  return (
    <>
      <AppShell
        title="Привычки"
        subtitle={`${activeHabits.length} активных · ${archivedHabits.length} в архиве`}
        actions={
          <button
            type="button"
            onClick={() => {
              setEditingHabit(undefined);
              setFormOpen(true);
            }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-[#0D1117] shadow-card transition active:scale-95"
            aria-label="Добавить привычку"
          >
            <Plus className="h-5 w-5" />
          </button>
        }
      >
        {data.habits.length === 0 ? (
          <EmptyState
            title="Пока нет привычек"
            description="Создайте первую привычку и отслеживайте прогресс полностью офлайн."
            action={
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-[#0D1117]"
              >
                Добавить привычку
              </button>
            }
          />
        ) : (
          <div className="space-y-6">
            <section>
              <div className="mb-3 flex items-center justify-between gap-2 text-sm font-semibold text-text">
                <span className="inline-flex items-center gap-2">
                <Archive className="h-4 w-4 text-accent" />
                Активные
                </span>
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted">{activeHabits.length}</span>
              </div>

              {activeHabits.length === 0 ? (
                <p className="rounded-2xl border border-border bg-card px-4 py-4 text-sm text-muted">Сейчас нет активных привычек.</p>
              ) : (
                <div className="space-y-3">
                  {activeHabits.map((habit) => {
                    const stats = statsByHabit.get(habit.id);
                    return (
                      <HabitListItem
                        key={habit.id}
                        habit={habit}
                        archived={false}
                        currentStreak={stats?.currentStreak ?? 0}
                        bestStreak={stats?.bestStreak ?? 0}
                        onEdit={() => {
                          setEditingHabit(habit);
                          setFormOpen(true);
                        }}
                        onArchiveToggle={() => setHabitArchived(habit.id, true)}
                      />
                    );
                  })}
                </div>
              )}
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between gap-2 text-sm font-semibold text-text">
                <span className="inline-flex items-center gap-2">
                <ArchiveRestore className="h-4 w-4 text-muted" />
                Архив
                </span>
                <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-semibold text-muted">{archivedHabits.length}</span>
              </div>

              {archivedHabits.length === 0 ? (
                <p className="rounded-2xl border border-border bg-card px-4 py-4 text-sm text-muted">Архив пуст.</p>
              ) : (
                <div className="space-y-3">
                  {archivedHabits.map((habit) => {
                    const stats = statsByHabit.get(habit.id);
                    return (
                      <HabitListItem
                        key={habit.id}
                        habit={habit}
                        archived
                        currentStreak={stats?.currentStreak ?? 0}
                        bestStreak={stats?.bestStreak ?? 0}
                        onEdit={() => {
                          setEditingHabit(habit);
                          setFormOpen(true);
                        }}
                        onArchiveToggle={() => setHabitArchived(habit.id, false)}
                      />
                    );
                  })}
                </div>
              )}
            </section>
          </div>
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
        onDelete={
          editingHabit
            ? () => {
                const confirmed = window.confirm(`Удалить «${editingHabit.name}» навсегда? Это действие нельзя отменить.`);
                if (!confirmed) {
                  return;
                }
                deleteHabit(editingHabit.id);
                closeForm();
              }
            : undefined
        }
      />
    </>
  );
}
