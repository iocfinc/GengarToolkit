'use client';

import { useState } from 'react';
import { exportDocumentAsPng } from '@/lib/render/captureFrame';
import { exportDocumentAsWebM } from '@/lib/render/exportVideo';
import { useEditorStore } from '@/lib/store/editorStore';

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ExportDialog() {
  const { exportDialogOpen } = useEditorStore((state) => state.ui);
  const setUi = useEditorStore((state) => state.setUi);
  const document = useEditorStore((state) => state.document);
  const updateExport = useEditorStore((state) => state.updateExport);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!exportDialogOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="panel-surface w-full max-w-lg rounded-[26px] p-5 shadow-panel">
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Export Asset</p>
          <h2 className="mt-2 font-display text-3xl text-fog">Render current composition</h2>
          <p className="mt-2 text-sm text-white/58">
            PNG export is instant. Motion export records a short WEBM loop in-browser.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Format</div>
            <select
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
              onChange={(event) =>
                updateExport({ format: event.target.value as 'png' | 'webm' })
              }
              value={document.export.format}
            >
              <option className="bg-[#111111]" value="png">
                PNG
              </option>
              <option className="bg-[#111111]" value="webm">
                WEBM
              </option>
            </select>
          </label>
          <label className="block">
            <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Filename</div>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
              onChange={(event) => updateExport({ filename: event.target.value })}
              value={document.export.filename}
            />
          </label>
          <label className="block">
            <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Resolution</div>
            <select
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
              onChange={(event) =>
                updateExport({
                  resolution: event.target.value as
                    | 'preview'
                    | 'hd'
                    | 'full-hd'
                    | 'square'
                })
              }
              value={document.export.resolution}
            >
              <option className="bg-[#111111]" value="preview">
                Preview
              </option>
              <option className="bg-[#111111]" value="hd">
                HD
              </option>
              <option className="bg-[#111111]" value="full-hd">
                Full HD
              </option>
              <option className="bg-[#111111]" value="square">
                Square
              </option>
            </select>
          </label>
          <label className="block">
            <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Duration</div>
            <input
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
              max={8}
              min={3}
              onChange={(event) => updateExport({ duration: Number(event.target.value) })}
              type="number"
              value={document.export.duration}
            />
          </label>
          <label className="block">
            <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Scale</div>
            <select
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
              onChange={(event) => updateExport({ scale: Number(event.target.value) })}
              value={document.export.scale}
            >
              <option className="bg-[#111111]" value={1}>
                1x
              </option>
              <option className="bg-[#111111]" value={2}>
                2x
              </option>
            </select>
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-2">
          <button
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/76"
            onClick={() => setUi({ exportDialogOpen: false })}
            type="button"
          >
            Cancel
          </button>
          <button
            className="rounded-full bg-fog px-4 py-2 text-sm font-semibold text-ink disabled:opacity-50"
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setError(null);
              try {
                const blob =
                  document.export.format === 'png'
                    ? await exportDocumentAsPng(document)
                    : await exportDocumentAsWebM(document);
                downloadBlob(
                  blob,
                  `${document.export.filename}.${document.export.format}`
                );
                setUi({ exportDialogOpen: false });
              } catch (nextError) {
                setError(
                  nextError instanceof Error ? nextError.message : 'Export failed.'
                );
              } finally {
                setBusy(false);
              }
            }}
            type="button"
          >
            {busy ? 'Exporting…' : 'Export'}
          </button>
        </div>
      </div>
    </div>
  );
}
