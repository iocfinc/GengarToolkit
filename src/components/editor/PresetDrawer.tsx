'use client';

import { useState } from 'react';
import { useEditorStore } from '@/lib/store/editorStore';

export function PresetDrawer() {
  const { presetDrawerOpen } = useEditorStore((state) => state.ui);
  const presets = useEditorStore((state) => state.presets);
  const activePresetId = useEditorStore((state) => state.activePresetId);
  const loadPreset = useEditorStore((state) => state.loadPreset);
  const renamePreset = useEditorStore((state) => state.renamePreset);
  const duplicatePreset = useEditorStore((state) => state.duplicatePreset);
  const deletePreset = useEditorStore((state) => state.deletePreset);
  const setUi = useEditorStore((state) => state.setUi);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nextName, setNextName] = useState('');

  if (!presetDrawerOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/40">
      <div className="panel-surface scrollbar-thin h-full w-full max-w-md overflow-y-auto rounded-l-[28px] p-4 shadow-panel">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/42">Presets</p>
            <h2 className="mt-2 font-display text-3xl text-fog">Saved looks</h2>
          </div>
          <button
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/76"
            onClick={() => setUi({ presetDrawerOpen: false })}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="space-y-3">
          {presets.map((preset) => (
            <article
              className={`rounded-[22px] border p-4 ${
                activePresetId === preset.id
                  ? 'border-white/28 bg-white/[0.06]'
                  : 'border-white/8 bg-white/[0.03]'
              }`}
              key={preset.id}
            >
              {editingId === preset.id ? (
                <div className="space-y-3">
                  <input
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
                    onChange={(event) => setNextName(event.target.value)}
                    value={nextName}
                  />
                  <div className="flex gap-2">
                    <button
                      className="rounded-full bg-fog px-4 py-2 text-sm font-semibold text-ink"
                      onClick={() => {
                        renamePreset(preset.id, nextName.trim() || preset.name);
                        setEditingId(null);
                      }}
                      type="button"
                    >
                      Save
                    </button>
                    <button
                      className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/76"
                      onClick={() => setEditingId(null)}
                      type="button"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    className="w-full text-left"
                    onClick={() => loadPreset(preset.id)}
                    type="button"
                  >
                    <p className="text-sm uppercase tracking-[0.22em] text-white/40">
                      {preset.document.layoutPreset.split('-').join(' ')}
                    </p>
                    <h3 className="mt-1 font-display text-2xl text-fog">{preset.name}</h3>
                    <p className="mt-2 text-sm text-white/54">
                      {preset.document.aspectRatio} · {preset.document.background.type} ·{' '}
                      {preset.document.motion.behavior}
                    </p>
                  </button>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/76"
                      onClick={() => loadPreset(preset.id)}
                      type="button"
                    >
                      Load
                    </button>
                    <button
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/76"
                      onClick={() => {
                        setEditingId(preset.id);
                        setNextName(preset.name);
                      }}
                      type="button"
                    >
                      Rename
                    </button>
                    <button
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/76"
                      onClick={() => duplicatePreset(preset.id)}
                      type="button"
                    >
                      Duplicate
                    </button>
                    <button
                      className="rounded-full border border-red-500/20 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-red-200"
                      onClick={() => deletePreset(preset.id)}
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
