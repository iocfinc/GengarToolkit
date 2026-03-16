'use client';

import { useId, useState, type ReactNode } from 'react';
import { SurfaceCard } from './SurfaceCard';

export function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
  actions
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  actions?: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <SurfaceCard className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
        <button
          aria-controls={panelId}
          aria-expanded={open}
          className="flex flex-1 items-center justify-between gap-3 text-left"
          onClick={() => setOpen((current) => !current)}
          type="button"
        >
          <span className="text-[11px] uppercase tracking-[0.28em] text-white/42">{title}</span>
          <span
            aria-hidden="true"
            className={`text-sm text-white/58 transition-transform ${open ? 'rotate-180' : ''}`}
          >
            ⌄
          </span>
        </button>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </div>
      {open ? (
        <div className="space-y-4 p-4" id={panelId}>
          {children}
        </div>
      ) : null}
    </SurfaceCard>
  );
}
