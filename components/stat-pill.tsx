'use client';

interface StatPillProps {
  label: string;
  value: string;
  tone?: 'default' | 'accent';
}

export function StatPill({ label, value, tone = 'default' }: StatPillProps) {
  return (
    <div
      className={`rounded-[20px] border px-3 py-3 ${
        tone === 'accent' ? 'border-accent bg-accent text-[#0D1117]' : 'border-border/80 bg-surface'
      }`}
    >
      <p className={`text-[11px] uppercase tracking-[0.14em] ${tone === 'accent' ? 'text-[#0D1117]/70' : 'text-muted'}`}>{label}</p>
      <p className={`mt-1 text-xl font-semibold ${tone === 'accent' ? 'text-[#0D1117]' : 'text-text'}`}>{value}</p>
    </div>
  );
}
