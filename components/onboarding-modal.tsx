'use client';

import { CheckCircle2, CircleOff } from 'lucide-react';

interface OnboardingModalProps {
  open: boolean;
  onKeepDemo: () => void;
  onStartEmpty: () => void;
}

export function OnboardingModal({ open, onKeepDemo, onStartEmpty }: OnboardingModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[430px] rounded-[28px] border border-border bg-card p-6 shadow-soft animate-pop">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Добро пожаловать</p>
        <h2 className="mt-2 text-2xl font-semibold text-text">Трекер привычек готов</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Можно начать с демо-привычек, чтобы посмотреть работу приложения, или с пустого списка. Все данные хранятся только на этом устройстве.
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={onKeepDemo}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-[#0D1117] transition active:scale-[0.98]"
          >
            <CheckCircle2 className="h-4 w-4" />
            Оставить демо-привычки
          </button>

          <button
            type="button"
            onClick={onStartEmpty}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text transition active:scale-[0.98]"
          >
            <CircleOff className="h-4 w-4" />
            Начать с пустого списка
          </button>
        </div>
      </div>
    </div>
  );
}
