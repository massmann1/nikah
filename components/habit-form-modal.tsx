'use client';

import { useEffect, useMemo, useState } from 'react';
import { Calendar, Save, Trash2, X } from 'lucide-react';
import { HABIT_COLORS, WEEKDAY_LABELS_SHORT } from '@/lib/constants';
import { getTodayKey } from '@/lib/date';
import { HABIT_ICON_OPTIONS } from '@/lib/habit-icons';
import { cn } from '@/lib/utils';
import type { Habit, HabitFormInput, Weekday } from '@/types/habit';

interface HabitFormModalProps {
  open: boolean;
  habit?: Habit;
  onClose: () => void;
  onSubmit: (input: HabitFormInput) => void;
  onDelete?: () => void;
}

const defaultForm = (): HabitFormInput => ({
  name: '',
  description: '',
  color: HABIT_COLORS[0],
  icon: 'sparkles',
  type: 'binary',
  targetValue: 1,
  unit: 'раз',
  frequencyMode: 'daily',
  frequencyDays: [0, 1, 2, 3, 4, 5, 6],
  startDate: getTodayKey(),
  archived: false
});

const habitToForm = (habit: Habit): HabitFormInput => ({
  name: habit.name,
  description: habit.description ?? '',
  color: habit.color,
  icon: habit.icon,
  type: habit.type,
  targetValue: habit.targetValue,
  unit: habit.type === 'binary' ? 'выполнено' : habit.unit,
  frequencyMode: habit.frequency.mode,
  frequencyDays: habit.frequency.days,
  startDate: habit.startDate,
  archived: habit.archived
});

export function HabitFormModal({ open, habit, onClose, onSubmit, onDelete }: HabitFormModalProps) {
  const [form, setForm] = useState<HabitFormInput>(defaultForm);
  const [error, setError] = useState<string>('');

  const isEdit = Boolean(habit);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(habit ? habitToForm(habit) : defaultForm());
    setError('');
  }, [open, habit]);

  const canSubmit = useMemo(() => {
    if (!form.name.trim()) {
      return false;
    }

    if (form.type === 'count' && form.targetValue <= 0) {
      return false;
    }

    if (form.frequencyMode === 'weekly' && form.frequencyDays.length === 0) {
      return false;
    }

    return true;
  }, [form]);

  const toggleWeekday = (day: Weekday) => {
    setForm((prev) => {
      const hasDay = prev.frequencyDays.includes(day);
      const nextDays = hasDay ? prev.frequencyDays.filter((value) => value !== day) : [...prev.frequencyDays, day];
      nextDays.sort((a, b) => a - b);

      return {
        ...prev,
        frequencyDays: nextDays
      };
    });
  };

  const submit = () => {
    if (!form.name.trim()) {
      setError('Введите название.');
      return;
    }

    if (form.type === 'count' && form.targetValue <= 0) {
      setError('Цель должна быть больше 0.');
      return;
    }

    if (form.frequencyMode === 'weekly' && form.frequencyDays.length === 0) {
      setError('Выберите хотя бы один день недели.');
      return;
    }

    onSubmit(form);
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/65 p-2 backdrop-blur-md">
      <div className="max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-[32px] border border-border/90 bg-card/95 p-4 shadow-soft animate-pop">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-border/80 bg-surface/70 px-3 py-2.5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Форма привычки</p>
            <h2 className="text-xl font-semibold text-text">{isEdit ? 'Редактировать привычку' : 'Новая привычка'}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted transition active:scale-95"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-text">Название</span>
            <input
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Утренняя прогулка"
              className="w-full rounded-2xl border border-border/80 bg-surface px-4 py-3 text-sm text-text outline-none ring-accent/30 transition focus:border-accent/50 focus:ring"
              maxLength={60}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-text">Описание (необязательно)</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Короткая мотивация или детали"
              className="h-20 w-full resize-none rounded-2xl border border-border/80 bg-surface px-4 py-3 text-sm text-text outline-none ring-accent/30 transition focus:border-accent/50 focus:ring"
              maxLength={160}
            />
          </label>

          <div>
            <span className="mb-2 block text-sm font-medium text-text">Тип</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'binary', label: 'Бинарная' },
                { key: 'count', label: 'Количественная' }
              ].map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      type: option.key as HabitFormInput['type'],
                      targetValue: option.key === 'binary' ? 1 : Math.max(1, prev.targetValue),
                      unit: option.key === 'binary' ? 'выполнено' : prev.unit
                    }))
                  }
                  className={cn(
                    'rounded-2xl px-3 py-3 text-sm font-semibold transition active:scale-95',
                    form.type === option.key ? 'bg-accent text-[#0D1117]' : 'border border-border bg-surface text-text'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {form.type === 'count' ? (
            <div className="grid grid-cols-2 gap-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-text">Цель</span>
                <input
                  type="number"
                  min={1}
                  value={form.targetValue}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      targetValue: Number(event.target.value || 1)
                    }))
                  }
                  className="w-full rounded-2xl border border-border/80 bg-surface px-4 py-3 text-sm text-text outline-none ring-accent/30 transition focus:border-accent/50 focus:ring"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-text">Единица</span>
                <input
                  value={form.unit}
                  onChange={(event) => setForm((prev) => ({ ...prev, unit: event.target.value }))}
                  placeholder="мин"
                  className="w-full rounded-2xl border border-border/80 bg-surface px-4 py-3 text-sm text-text outline-none ring-accent/30 transition focus:border-accent/50 focus:ring"
                  maxLength={20}
                />
              </label>
            </div>
          ) : null}

          <div>
            <span className="mb-2 block text-sm font-medium text-text">Цвет</span>
            <div className="grid grid-cols-8 gap-2">
              {HABIT_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, color }))}
                  className={cn(
                    'h-9 w-9 rounded-xl border transition active:scale-95',
                    form.color === color ? 'border-accent ring-2 ring-accent/40' : 'border-transparent'
                  )}
                  style={{ backgroundColor: color }}
                  aria-label={`Select ${color}`}
                />
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-text">Иконка</span>
            <div className="grid grid-cols-6 gap-2">
              {HABIT_ICON_OPTIONS.map(({ key, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, icon: key }))}
                  className={cn(
                    'flex h-10 items-center justify-center rounded-xl border bg-surface transition active:scale-95',
                    form.icon === key ? 'border-accent bg-accent/15 text-accent' : 'border-border text-muted'
                  )}
                  aria-label={`Select ${key}`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="mb-2 block text-sm font-medium text-text">Частота</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, frequencyMode: 'daily', frequencyDays: [0, 1, 2, 3, 4, 5, 6] }))}
                className={cn(
                  'rounded-2xl px-3 py-3 text-sm font-semibold transition active:scale-95',
                  form.frequencyMode === 'daily' ? 'bg-accent text-[#0D1117]' : 'border border-border bg-surface text-text'
                )}
              >
                Каждый день
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    frequencyMode: 'weekly',
                    frequencyDays: prev.frequencyDays.length ? prev.frequencyDays : [1, 2, 3, 4, 5]
                  }))
                }
                className={cn(
                  'rounded-2xl px-3 py-3 text-sm font-semibold transition active:scale-95',
                  form.frequencyMode === 'weekly' ? 'bg-accent text-[#0D1117]' : 'border border-border bg-surface text-text'
                )}
              >
                Выбранные дни
              </button>
            </div>

            {form.frequencyMode === 'weekly' ? (
              <div className="mt-2 grid grid-cols-7 gap-1.5">
                {WEEKDAY_LABELS_SHORT.map((label, day) => {
                  const active = form.frequencyDays.includes(day as Weekday);
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleWeekday(day as Weekday)}
                      className={cn(
                        'rounded-xl px-2 py-2 text-xs font-semibold transition active:scale-95',
                        active ? 'bg-accent text-[#0D1117]' : 'border border-border bg-surface text-muted'
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-text">Дата начала</span>
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-muted" />
              <input
                type="date"
                value={form.startDate}
                onChange={(event) => setForm((prev) => ({ ...prev, startDate: event.target.value }))}
                className="w-full rounded-2xl border border-border/80 bg-surface py-3 pl-10 pr-4 text-sm text-text outline-none ring-accent/30 transition focus:border-accent/50 focus:ring"
              />
            </div>
          </label>

          {isEdit ? (
            <label className="flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
              <span className="text-sm font-medium text-text">Архивировать привычку</span>
              <input
                type="checkbox"
                checked={Boolean(form.archived)}
                onChange={(event) => setForm((prev) => ({ ...prev, archived: event.target.checked }))}
                className="h-5 w-5 accent-accent"
              />
            </label>
          ) : null}

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              disabled={!canSubmit}
              onClick={submit}
              className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-[#0D1117] transition active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isEdit ? 'Сохранить' : 'Создать привычку'}
            </button>

            {isEdit && onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-300 bg-red-50 text-red-600 transition active:scale-[0.98] dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
                aria-label="Удалить привычку"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
