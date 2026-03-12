'use client';

import { Check, CheckCircle2, Flame, Minus, Plus } from 'lucide-react';
import { iconByKey } from '@/lib/habit-icons';
import { cn } from '@/lib/utils';
import type { Habit } from '@/types/habit';

interface HabitCardProps {
  habit: Habit;
  value: number;
  target: number;
  progress: number;
  completed: boolean;
  streak: number;
  onToggle: () => void;
  onIncrease: (delta: number) => void;
  onDecrease: (delta: number) => void;
  onOpenDetails?: () => void;
}

export function HabitCard({
  habit,
  value,
  target,
  progress,
  completed,
  streak,
  onToggle,
  onIncrease,
  onDecrease,
  onOpenDetails
}: HabitCardProps) {
  const Icon = iconByKey(habit.icon);
  const progressPercent = Math.max(0, Math.min(100, Math.round(progress * 100)));
  const isLightCard = completed;

  return (
    <article
      className={cn(
        'flex flex-col overflow-hidden rounded-[30px] border p-4 shadow-soft transition duration-200 active:scale-[0.99]',
        completed ? 'border-accent bg-accent text-[#11151B]' : 'border-border/90 bg-card/95 text-text'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onOpenDetails}
          className="min-w-0 flex-1 text-left"
          aria-label={`Открыть детали ${habit.name}`}
        >
          <div className="flex items-center gap-3">
            <span
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-2xl',
                isLightCard ? 'bg-black/10 text-[#11151B]' : 'text-[#0D1117]'
              )}
              style={isLightCard ? undefined : { backgroundColor: habit.color }}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h3 className={cn('truncate text-base font-semibold', isLightCard ? 'text-[#11151B]' : 'text-text')}>{habit.name}</h3>
              {habit.description ? <p className={cn('mt-0.5 truncate text-sm', isLightCard ? 'text-[#11151B]/70' : 'text-muted')}>{habit.description}</p> : null}
            </div>
          </div>
        </button>
      </div>

      {habit.type === 'count' ? (
        <div className="mt-4 flex items-end justify-between gap-3">
          <div className={cn('min-w-0', isLightCard ? 'text-[#11151B]' : 'text-text')}>
            <div className="flex items-baseline gap-1.5 overflow-hidden">
              <span className="text-4xl font-semibold leading-none">{value}</span>
              <span className={cn('truncate text-sm font-medium', isLightCard ? 'text-[#11151B]/70' : 'text-muted')}>
                / {target} {habit.unit}
              </span>
            </div>
          </div>

          <div className="shrink-0">
            <div
              className={cn(
                'grid grid-cols-3 gap-1 rounded-full border p-1',
                isLightCard ? 'border-black/15 bg-black/10' : 'border-border/80 bg-surface/85'
              )}
            >
              <button
                type="button"
                onClick={() => onDecrease(1)}
                className={cn(
                  'flex h-8 w-10 items-center justify-center rounded-full text-xs font-semibold transition active:scale-95',
                  isLightCard ? 'text-[#11151B]' : 'text-text'
                )}
                aria-label={`Уменьшить ${habit.name}`}
              >
                <Minus className="h-3.5 w-3.5" />
              </button>

              <button
                type="button"
                onClick={onToggle}
                className={cn(
                  'h-8 w-10 rounded-full text-xs font-semibold transition active:scale-95',
                  isLightCard ? 'bg-black/90 text-accent' : 'bg-accent/15 text-accent'
                )}
              >
                {completed ? 'Сброс' : 'Цель'}
              </button>

              <button
                type="button"
                onClick={() => onIncrease(1)}
                className={cn(
                  'flex h-8 w-10 items-center justify-center rounded-full text-xs font-semibold transition active:scale-95',
                  isLightCard ? 'text-[#11151B]' : 'text-text'
                )}
                aria-label={`Увеличить ${habit.name}`}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <div className={cn('mb-1 text-xs uppercase tracking-[0.15em]', isLightCard ? 'text-[#11151B]/70' : 'text-muted')}>Серия</div>
            <div className={cn('flex items-center gap-1 text-lg font-semibold', isLightCard ? 'text-[#11151B]' : 'text-text')}>
              <Flame className={cn('h-4 w-4', isLightCard ? 'text-[#11151B]/85' : 'text-accent')} />
              {streak} дн.
            </div>
          </div>

          <button
            type="button"
            onClick={onToggle}
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full transition active:scale-95',
              isLightCard ? 'bg-black/90 text-accent' : 'border border-border bg-surface text-muted'
            )}
            aria-label={completed ? `Снять отметку ${habit.name}` : `Отметить ${habit.name}`}
          >
            {completed ? <Check className="h-6 w-6" /> : <CheckCircle2 className="h-5 w-5" />}
          </button>
        </div>
      )}

      <div className={cn('mt-3 h-1.5 overflow-hidden rounded-full', isLightCard ? 'bg-black/15' : 'bg-border/70')}>
        <div
          className={cn('h-full rounded-full transition-all duration-300', isLightCard ? 'bg-black/80' : 'bg-accent')}
          style={{ width: `${Math.max(6, progressPercent)}%` }}
        />
      </div>
    </article>
  );
}
