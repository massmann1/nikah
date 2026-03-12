import type { LucideIcon } from 'lucide-react';
import {
  Brain,
  Check,
  Droplets,
  Dumbbell,
  Footprints,
  HeartPulse,
  Leaf,
  Moon,
  Sparkles,
  Sun,
  Timer,
  BookOpen
} from 'lucide-react';
import type { HabitIconKey } from '@/types/habit';

export const HABIT_ICON_OPTIONS: { key: HabitIconKey; label: string; icon: LucideIcon }[] = [
  { key: 'sparkles', label: 'Фокус', icon: Sparkles },
  { key: 'droplets', label: 'Вода', icon: Droplets },
  { key: 'book', label: 'Чтение', icon: BookOpen },
  { key: 'dumbbell', label: 'Тренировка', icon: Dumbbell },
  { key: 'heart', label: 'Здоровье', icon: HeartPulse },
  { key: 'brain', label: 'Мозг', icon: Brain },
  { key: 'leaf', label: 'Природа', icon: Leaf },
  { key: 'footprints', label: 'Шаги', icon: Footprints },
  { key: 'moon', label: 'Сон', icon: Moon },
  { key: 'sun', label: 'Утро', icon: Sun },
  { key: 'timer', label: 'Время', icon: Timer },
  { key: 'check', label: 'Готово', icon: Check }
];

export const iconByKey = (key: HabitIconKey): LucideIcon => {
  return HABIT_ICON_OPTIONS.find((item) => item.key === key)?.icon ?? Sparkles;
};
