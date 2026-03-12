'use client';

import type { ReactNode } from 'react';
import { BottomTabNav } from '@/components/bottom-tab-nav';
import { cn } from '@/lib/utils';

interface AppShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AppShell({ title, subtitle, actions, children, className }: AppShellProps) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] bg-surface pb-28 pt-[calc(env(safe-area-inset-top)+14px)]">
      <header className="sticky top-0 z-30 px-4 pb-3">
        <div className="rounded-[30px] border border-border/80 bg-card/92 px-5 py-4 shadow-soft backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-[34px] font-semibold leading-[0.95] tracking-[-0.03em] text-text">{title}</h1>
              {subtitle ? <p className="mt-1 text-sm text-muted">{subtitle}</p> : null}
            </div>
            {actions ? <div className="shrink-0">{actions}</div> : null}
          </div>
        </div>
      </header>

      <main className={cn('px-4 pt-2 animate-slideUp', className)}>{children}</main>

      <BottomTabNav />
    </div>
  );
}
