'use client';

import type { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[30px] border border-dashed border-border bg-card px-6 py-10 text-center shadow-soft">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-[#0D1117]">
        <Sparkles className="h-5 w-5" />
      </div>
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      <p className="mx-auto mt-2 max-w-[240px] text-sm text-muted">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
