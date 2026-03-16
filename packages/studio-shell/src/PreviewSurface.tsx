'use client';

import type { ReactNode } from 'react';

export function PreviewSurface({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-0 flex-1 items-stretch overflow-hidden"
      data-testid="preview-surface"
    >
      {children}
    </div>
  );
}
