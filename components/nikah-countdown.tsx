'use client';

import { useEffect, useState } from 'react';

type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
};

const TARGET_DATE = '2026-06-05T15:30:00+03:00';

function getCountdownState(): CountdownState {
  const target = new Date(TARGET_DATE).getTime();
  const diff = target - Date.now();

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isComplete: true
    };
  }

  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
    isComplete: false
  };
}

function formatValue(value: number | null) {
  if (value === null) {
    return '--';
  }

  return String(value).padStart(2, '0');
}

export function NikahCountdown() {
  const [state, setState] = useState<CountdownState | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      setState(getCountdownState());
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const countdownItems = [
    { label: 'дней', value: state?.days ?? null },
    { label: 'часов', value: state?.hours ?? null },
    { label: 'минут', value: state?.minutes ?? null },
    { label: 'секунд', value: state?.seconds ?? null }
  ];

  return (
    <div className="grid grid-cols-4 gap-2 text-center sm:gap-3">
      {countdownItems.map(({ label, value }) => (
        <div key={label} className="rounded-[22px] bg-white/60 px-2 py-3">
          <div className="font-heading text-[1.8rem] leading-none text-[#2a443d]" suppressHydrationWarning>
            {formatValue(value)}
          </div>
          <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[#8c6a49]">{label}</div>
        </div>
      ))}
    </div>
  );
}
