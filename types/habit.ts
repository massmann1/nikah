export type HabitType = 'binary' | 'count';

export type ThemePreference = 'system' | 'light' | 'dark';

export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type HabitIconKey =
  | 'sparkles'
  | 'droplets'
  | 'book'
  | 'dumbbell'
  | 'heart'
  | 'brain'
  | 'leaf'
  | 'footprints'
  | 'moon'
  | 'sun'
  | 'timer'
  | 'check';

export interface HabitFrequency {
  mode: 'daily' | 'weekly';
  days: Weekday[];
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: HabitIconKey;
  type: HabitType;
  targetValue: number;
  unit: string;
  frequency: HabitFrequency;
  startDate: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HabitEntry {
  value: number;
  updatedAt: string;
}

export type HabitEntriesByDate = Record<string, Record<string, HabitEntry>>;

export interface AppSettings {
  theme: ThemePreference;
  hasSeenOnboarding: boolean;
  seedDemoHabitsOnReset: boolean;
  updatedAt: string;
}

export interface AppMeta {
  createdAt: string;
  lastUpdatedAt: string;
}

export interface AppData {
  version: number;
  habits: Habit[];
  habitEntriesByDate: HabitEntriesByDate;
  settings: AppSettings;
  meta: AppMeta;
}

export interface HabitFormInput {
  name: string;
  description?: string;
  color: string;
  icon: HabitIconKey;
  type: HabitType;
  targetValue: number;
  unit: string;
  frequencyMode: 'daily' | 'weekly';
  frequencyDays: Weekday[];
  startDate: string;
  archived?: boolean;
}

export interface HabitStats {
  currentStreak: number;
  bestStreak: number;
  completionRate7d: number;
  completionRate30d: number;
  totalCompletedDays: number;
  totalValue: number;
}
