'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, CheckCircle2, ListTodo, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
  {
    href: '/today',
    label: 'Сегодня',
    icon: CheckCircle2
  },
  {
    href: '/habits',
    label: 'Привычки',
    icon: ListTodo
  },
  {
    href: '/stats',
    label: 'Статистика',
    icon: BarChart3
  },
  {
    href: '/settings',
    label: 'Настройки',
    icon: Settings
  }
];

const isTabActive = (pathname: string, href: string): boolean => {
  if (href === '/today') {
    return pathname === '/today' || pathname === '/';
  }

  return pathname === href || pathname.startsWith(`${href}/`);
};

export function BottomTabNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[430px] px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2">
      <ul className="grid grid-cols-4 gap-1.5 rounded-[26px] border border-border/90 bg-card/92 p-2 shadow-soft backdrop-blur-xl">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isTabActive(pathname, tab.href);

          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                className={cn(
                  'flex h-14 flex-col items-center justify-center rounded-[18px] text-[11px] font-semibold transition active:scale-[0.97]',
                  active ? 'bg-accent text-[#0D1117]' : 'text-muted hover:bg-surface/70 hover:text-text'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="mb-1 h-5 w-5" strokeWidth={2.2} />
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
