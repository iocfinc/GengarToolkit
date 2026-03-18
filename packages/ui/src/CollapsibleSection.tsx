'use client';

import { useId, useState, type ReactNode } from 'react';
import { SurfaceCard } from './SurfaceCard';

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  actions,
  open: controlledOpen,
  onOpenChange,
  className = '',
  contentClassName = ''
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  actions?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  contentClassName?: string;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const panelId = useId();
  const open = controlledOpen ?? uncontrolledOpen;

  function handleOpenChange(nextOpen: boolean) {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  }

  return (
    <SurfaceCard className={`overflow-hidden ${className}`.trim()}>
      <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
        <button
          aria-controls={panelId}
          aria-expanded={open}
          className="flex flex-1 items-center justify-between gap-3 text-left"
          onClick={() => handleOpenChange(!open)}
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
        <div className={`space-y-4 p-4 ${contentClassName}`.trim()} id={panelId}>
          {children}
        </div>
      ) : null}
    </SurfaceCard>
  );
}
