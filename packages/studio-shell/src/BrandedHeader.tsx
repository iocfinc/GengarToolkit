'use client';

import type { ReactNode } from 'react';

export function BrandedHeader({
  eyebrow = 'Dioscuri Platform',
  title,
  subtitle,
  actions
}: {
  eyebrow?: string;
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <header className="panel-surface flex flex-col gap-4 rounded-[28px] px-5 py-5 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-[0.34em] text-white/42">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl text-fog md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm text-white/62 md:text-base">{subtitle}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
