'use client';

import { useEditorStore } from '@/lib/store/editorStore';

export function AppHeader({
  onOpenSavePreset
}: {
  onOpenSavePreset: () => void;
}) {
  const document = useEditorStore((state) => state.document);
  const randomizeDocument = useEditorStore((state) => state.randomizeDocument);
  const setUi = useEditorStore((state) => state.setUi);

  return (
    <header className="panel-surface flex flex-col gap-4 rounded-[24px] px-4 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[11px] uppercase tracking-[0.34em] text-white/42">Dioscuri</p>
        <div className="mt-1 flex flex-wrap items-end gap-3">
          <h1 className="font-display text-3xl leading-none text-fog">Brand Motion Toolkit</h1>
          <span className="rounded-full border border-white/8 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/56">
            {document.name}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78"
          onClick={() => setUi({ presetDrawerOpen: true })}
          type="button"
        >
          Presets
        </button>
        <button
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78"
          onClick={() => randomizeDocument('soft')}
          type="button"
        >
          Soft Randomize
        </button>
        <button
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78"
          onClick={() => randomizeDocument('full')}
          type="button"
        >
          Full Randomize
        </button>
        <button
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78"
          onClick={onOpenSavePreset}
          type="button"
        >
          Save Preset
        </button>
        <button
          className="rounded-full bg-fog px-4 py-2 text-sm font-semibold text-ink"
          onClick={() => setUi({ exportDialogOpen: true })}
          type="button"
        >
          Export
        </button>
      </div>
    </header>
  );
}
