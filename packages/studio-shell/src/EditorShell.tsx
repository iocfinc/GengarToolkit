'use client';

import type { ReactNode } from 'react';

export function EditorShell({
  header,
  preview,
  controls,
  footer
}: {
  header: ReactNode;
  preview: ReactNode;
  controls: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-chrome px-4 py-4 text-fog md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1680px] flex-col gap-4 rounded-[30px] border border-white/8 bg-white/[0.03] p-4 shadow-panel md:p-5">
        {header}
        <div
          className="grid flex-1 gap-4 md:grid-cols-2"
          data-testid="editor-shell-panes"
        >
          <div className="flex min-h-0 min-w-0 flex-col" data-testid="editor-shell-preview-pane">
            {preview}
          </div>
          <div className="flex min-h-0 min-w-0 flex-col" data-testid="editor-shell-controls-pane">
            {controls}
          </div>
        </div>
        {footer}
      </div>
    </main>
  );
}
