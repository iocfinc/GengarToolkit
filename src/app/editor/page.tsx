'use client';

import { useEffect, useState } from 'react';
import { AppHeader } from '@/components/editor/AppHeader';
import { BottomBar } from '@/components/editor/BottomBar';
import { CanvasStage } from '@/components/editor/CanvasStage';
import { ControlPanel } from '@/components/editor/ControlPanel';
import { ExportDialog } from '@/components/editor/ExportDialog';
import { PresetDrawer } from '@/components/editor/PresetDrawer';
import { useEditorStore } from '@/lib/store/editorStore';

export default function EditorPage() {
  const hydrate = useEditorStore((state) => state.hydrate);
  const [presetPromptOpen, setPresetPromptOpen] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <main className="min-h-screen bg-chrome px-4 py-4 text-fog md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1680px] flex-col gap-4 rounded-[30px] border border-white/8 bg-white/[0.03] p-4 shadow-panel md:p-5">
        <AppHeader onOpenSavePreset={() => setPresetPromptOpen(true)} />
        <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
          <CanvasStage />
          <ControlPanel />
        </div>
        <BottomBar />
      </div>
      <PresetDrawer />
      <ExportDialog />
      {presetPromptOpen ? (
        <SavePresetPrompt onClose={() => setPresetPromptOpen(false)} />
      ) : null}
    </main>
  );
}

function SavePresetPrompt({ onClose }: { onClose: () => void }) {
  const savePreset = useEditorStore((state) => state.savePreset);
  const name = useEditorStore((state) => state.document.name);
  const [value, setValue] = useState(`${name} Preset`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
      <div className="panel-surface w-full max-w-md rounded-[24px] p-5 shadow-panel">
        <div className="mb-4">
          <p className="text-xs uppercase tracking-[0.28em] text-white/45">Save Preset</p>
          <h2 className="mt-2 font-display text-2xl text-fog">Store the current composition</h2>
        </div>
        <input
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-fog"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <div className="mt-5 flex justify-end gap-2">
          <button
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/72"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-full bg-fog px-4 py-2 text-sm font-semibold text-ink"
            onClick={() => {
              savePreset(value.trim() || 'Untitled Preset');
              onClose();
            }}
            type="button"
          >
            Save Preset
          </button>
        </div>
      </div>
    </div>
  );
}
