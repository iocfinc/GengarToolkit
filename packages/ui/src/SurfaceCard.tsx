import type { ReactNode } from 'react';

export function SurfaceCard({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`panel-surface rounded-[24px] ${className}`.trim()}>{children}</div>;
}
