'use client';

import Link from 'next/link';
import { BarChart3, Flame, TrendingUp } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { EmptyState } from '@/components/empty-state';
import { StatPill } from '@/components/stat-pill';
import { useAppData } from '@/hooks/use-app-data';
import { getHabitStats } from '@/lib/habit-utils';
import { getOverallStats } from '@/lib/stats';

export default function StatsPage() {
  const { data, activeHabits, todayKey } = useAppData();

  const overall = getOverallStats(activeHabits, data, todayKey);

  return (
    <AppShell title="Статистика" subtitle="Короткие метрики по прогрессу">
      {activeHabits.length === 0 ? (
        <EmptyState
          title="Пока нет статистики"
          description="Создайте хотя бы одну активную привычку, чтобы видеть серии и проценты выполнения."
          action={
            <Link href="/habits" className="rounded-2xl bg-accent px-4 py-2 text-sm font-semibold text-[#0D1117]">
              К привычкам
            </Link>
          }
        />
      ) : (
        <>
          <section className="rounded-[30px] border border-border/90 bg-card/95 p-4 shadow-soft">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-text">
                <TrendingUp className="h-4 w-4 text-accent" />
                Общая
              </div>
              <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-[#0D1117]">
                {overall.completionRate7d}% / 7 дн.
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <StatPill label="Привычки" value={`${overall.activeHabits}`} tone="accent" />
              <StatPill label="Сегодня" value={`${overall.completedToday}/${overall.totalToday}`} />
              <StatPill label="За 7 дней" value={`${overall.completionRate7d}%`} />
              <StatPill label="За 30 дней" value={`${overall.completionRate30d}%`} />
            </div>
          </section>

          <section className="mt-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text">
              <BarChart3 className="h-4 w-4 text-accent" />
              По привычкам
            </div>
            <div className="space-y-3">
              {activeHabits.map((habit) => {
                const stats = getHabitStats(habit, data, todayKey);

                return (
                  <article key={habit.id} className="rounded-[28px] border border-border/90 bg-card/95 p-4 shadow-soft">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-base font-semibold text-text">{habit.name}</h3>
                        <p className="text-sm text-muted">
                          {habit.type === 'count' ? `${habit.targetValue} ${habit.unit}` : 'Бинарная привычка'}
                        </p>
                      </div>
                      <Link
                        href={`/habits/${habit.id}`}
                        className="rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold text-text transition active:scale-95"
                      >
                        Открыть
                      </Link>
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-2xl border border-border/80 bg-surface px-2 py-2">
                        <p className="text-[11px] uppercase text-muted">Серия</p>
                        <p className="text-lg font-semibold text-text">{stats.currentStreak}</p>
                      </div>
                      <div className="rounded-2xl border border-border/80 bg-surface px-2 py-2">
                        <p className="text-[11px] uppercase text-muted">Лучшая</p>
                        <p className="text-lg font-semibold text-text">{stats.bestStreak}</p>
                      </div>
                      <div className="rounded-2xl border border-border/80 bg-surface px-2 py-2">
                        <p className="text-[11px] uppercase text-muted">30 дн.</p>
                        <p className="text-lg font-semibold text-text">{stats.completionRate30d}%</p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-muted">
                      <Flame className="h-4 w-4 text-accent" />
                      <span>
                        Всего выполнено: {stats.totalCompletedDays}
                        {habit.type === 'count' ? ` · Всего ${habit.unit}: ${stats.totalValue}` : ''}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </>
      )}
    </AppShell>
  );
}
