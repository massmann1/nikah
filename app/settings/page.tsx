'use client';

import { useRef, useState } from 'react';
import { Download, Upload, Trash2, Moon, Sun, MonitorSmartphone } from 'lucide-react';
import { AppShell } from '@/components/app-shell';
import { APP_VERSION } from '@/lib/constants';
import { useAppData } from '@/hooks/use-app-data';
import { cn } from '@/lib/utils';
import type { ThemePreference } from '@/types/habit';

const themeOptions: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
  { value: 'system', label: 'Система', icon: MonitorSmartphone },
  { value: 'light', label: 'Светлая', icon: Sun },
  { value: 'dark', label: 'Тёмная', icon: Moon }
];

export default function SettingsPage() {
  const { data, updateTheme, toggleSeedDemoOnReset, exportToJson, importFromJson, resetAllData } = useAppData();
  const [statusMessage, setStatusMessage] = useState<string>('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleExport = () => {
    const payload = exportToJson();
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `habit-pulse-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
    setStatusMessage('Резервная копия успешно экспортирована.');
  };

  const handleImportFile = async (file: File) => {
    const text = await file.text();
    const result = importFromJson(text);

    if (!result.ok) {
      setStatusMessage(result.error);
      return;
    }

    setStatusMessage('Данные успешно импортированы.');
  };

  return (
    <AppShell title="Настройки" subtitle="Локальные данные и параметры">
      <section className="rounded-[30px] border border-border/90 bg-card/95 p-4 shadow-soft">
        <h2 className="text-base font-semibold text-text">Тема</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const active = data.settings.theme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => updateTheme(option.value)}
                className={cn(
                  'flex items-center justify-center gap-1 rounded-2xl px-3 py-3 text-sm font-semibold transition active:scale-95',
                  active ? 'bg-accent text-[#0D1117]' : 'border border-border bg-surface text-text'
                )}
              >
                <Icon className="h-4 w-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-4 rounded-[30px] border border-border/90 bg-card/95 p-4 shadow-soft">
        <h2 className="text-base font-semibold text-text">Данные</h2>

        <label className="mt-3 flex items-center justify-between rounded-2xl border border-border bg-surface px-4 py-3">
          <span className="text-sm text-text">Добавлять демо-привычки после сброса</span>
          <input
            type="checkbox"
            checked={data.settings.seedDemoHabitsOnReset}
            onChange={(event) => toggleSeedDemoOnReset(event.target.checked)}
            className="h-5 w-5 accent-accent"
          />
        </label>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-3 py-3 text-sm font-semibold text-text transition active:scale-95"
          >
            <Download className="h-4 w-4" />
            Экспорт JSON
          </button>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-3 py-3 text-sm font-semibold text-text transition active:scale-95"
          >
            <Upload className="h-4 w-4" />
            Импорт JSON
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) {
              return;
            }
            void handleImportFile(file);
            event.target.value = '';
          }}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => {
            const confirmed = window.confirm('Очистить все привычки, записи и статистику на этом устройстве?');
            if (!confirmed) {
              return;
            }

            resetAllData(data.settings.seedDemoHabitsOnReset);
            setStatusMessage('Все данные сброшены.');
          }}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-300 bg-red-50 px-3 py-3 text-sm font-semibold text-red-600 transition active:scale-95 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          <Trash2 className="h-4 w-4" />
          Очистить все данные
        </button>

        {statusMessage ? (
          <p className="mt-3 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-muted">{statusMessage}</p>
        ) : null}
      </section>

      <section className="mt-4 rounded-[30px] border border-border/90 bg-card/95 p-4 shadow-soft">
        <h2 className="text-base font-semibold text-text">О приложении</h2>
        <p className="mt-2 text-sm text-muted">Приложение работает офлайн и хранит данные только на этом устройстве.</p>
        <p className="mt-2 text-sm text-muted">Версия: {APP_VERSION}</p>
      </section>
    </AppShell>
  );
}
