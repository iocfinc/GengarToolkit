'use client';

import { useEditorStore } from '@/lib/store/editorStore';

export function BottomBar() {
  const motion = useEditorStore((state) => state.document.motion);
  const ui = useEditorStore((state) => state.ui);
  const togglePlayback = useEditorStore((state) => state.togglePlayback);
  const updateMotion = useEditorStore((state) => state.updateMotion);
  const setUi = useEditorStore((state) => state.setUi);

  return (
    <div className="panel-surface flex flex-col gap-3 rounded-[22px] px-4 py-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78"
          onClick={togglePlayback}
          type="button"
        >
          {motion.playing ? 'Pause' : 'Play'}
        </button>
        <button
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78"
          onClick={() => updateMotion({ loopDuration: Math.max(3, motion.loopDuration - 1) })}
          type="button"
        >
          Shorter Loop
        </button>
        <button
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78"
          onClick={() => updateMotion({ loopDuration: Math.min(8, motion.loopDuration + 1) })}
          type="button"
        >
          Longer Loop
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          className={`rounded-full border px-4 py-2 text-sm ${
            ui.showGrid ? 'border-white/30 text-white' : 'border-white/10 text-white/56'
          }`}
          onClick={() => setUi({ showGrid: !ui.showGrid })}
          type="button"
        >
          Grid {ui.showGrid ? 'On' : 'Off'}
        </button>
        <button
          className={`rounded-full border px-4 py-2 text-sm ${
            ui.showSafeMargins ? 'border-white/30 text-white' : 'border-white/10 text-white/56'
          }`}
          onClick={() => setUi({ showSafeMargins: !ui.showSafeMargins })}
          type="button"
        >
          Safe Margins {ui.showSafeMargins ? 'On' : 'Off'}
        </button>
        <button
          className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78"
          onClick={() => setUi({ zoom: ui.zoom === 1 ? 0.85 : 1 })}
          type="button"
        >
          Zoom {ui.zoom === 1 ? 'Fit' : '100%'}
        </button>
      </div>
    </div>
  );
}
