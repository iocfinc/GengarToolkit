'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { BrandedHeader } from '@packages/studio-shell/src/BrandedHeader';
import { EditorShell } from '@packages/studio-shell/src/EditorShell';
import { PreviewSurface } from '@packages/studio-shell/src/PreviewSurface';
import { SurfaceCard } from '@packages/ui/src/SurfaceCard';
import { CollapsibleSection } from '@packages/ui/src/CollapsibleSection';
import { buildSvgMarkup, cellsPerSide, quarterPath, regenOrientations, type PatternState } from './core';
import { exportPattern, type ExportType } from './exporters';

const PRESETS = [
  { id: 'custom', label: 'Custom' },
  { id: 'klein-citric', label: 'Klein Blue + Citric', bg: '#4100F5', shape: '#CDF564' },
  { id: 'citric-klein', label: 'Citric + Klein Blue', bg: '#CDF564', shape: '#4100F5' },
  { id: 'aqua-fuchsia', label: 'Aquamarine + Fuchsia', bg: '#9BF0E1', shape: '#F037A5' },
  { id: 'fuchsia-aqua', label: 'Fuchsia + Aquamarine', bg: '#F037A5', shape: '#9BF0E1' },
  { id: 'tangerine-black', label: 'Tangerine + Black', bg: '#FF4632', shape: '#191414' },
  { id: 'black-tangerine', label: 'Black + Tangerine', bg: '#191414', shape: '#FF4632' }
];

function defaultState(): PatternState {
  return {
    size: 800,
    modules: 1,
    shapeColor: '#CDF564',
    bgColor: '#4100F5',
    mode: 'filled',
    strokeWidth: 8,
    seed: 'pattern-001',
    orientations: regenOrientations(1, 'pattern-001'),
    editEnabled: false,
    selectedIndex: -1
  };
}

export function PatternToolkitPage() {
  const [state, setState] = useState<PatternState>(() => defaultState());
  const [name, setName] = useState('pattern');
  const [type, setType] = useState<ExportType>('png');
  const [palette, setPalette] = useState('custom');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [statusText, setStatusText] = useState('');

  // Derived preview SVG with optional selection overlay (not included in exports)
  const previewSvg = useMemo(() => buildPreviewSvg(state), [state]);

  useEffect(() => {
    // Event delegation for clicks/dblclicks on tiles when edit is enabled
    const el = containerRef.current;
    if (!el) return;
    function onClick(e: MouseEvent) {
      if (!state.editEnabled) return;
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('tile') && target.getAttribute('data-idx')) {
        const idx = parseInt(target.getAttribute('data-idx') || '-1', 10);
        if (Number.isFinite(idx)) setState((s) => ({ ...s, selectedIndex: idx }));
      }
    }
    function onDblClick(e: MouseEvent) {
      if (!state.editEnabled) return;
      const target = e.target as HTMLElement;
      if (target && target.classList.contains('tile') && target.getAttribute('data-idx')) {
        const idx = parseInt(target.getAttribute('data-idx') || '-1', 10);
        if (Number.isFinite(idx)) rotateSelected(+1);
      }
    }
    el.addEventListener('click', onClick);
    el.addEventListener('dblclick', onDblClick);
    return () => {
      el.removeEventListener('click', onClick);
      el.removeEventListener('dblclick', onDblClick);
    };
  }, [state.editEnabled]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!state.editEnabled) return;
      if (e.key === 'r' || e.key === 'R') {
        rotateSelected(e.shiftKey ? -1 : +1);
      } else if (e.key === 'ArrowLeft') {
        rotateSelected(-1);
      } else if (e.key === 'ArrowRight') {
        rotateSelected(+1);
      } else if (e.key === 'Escape') {
        setState((s) => ({ ...s, selectedIndex: -1 }));
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state.editEnabled]);

  function rotateSelected(dir: number) {
    setState((s) => {
      const idx = s.selectedIndex;
      const n = cellsPerSide(s.modules);
      if (idx < 0 || idx >= n * n) return s;
      const o = s.orientations[idx] ?? 0;
      const delta = dir > 0 ? 1 : -1;
      const next = s.orientations.slice();
      next[idx] = ((o + delta) % 4 + 4) % 4;
      return { ...s, orientations: next };
    });
  }

  const exportBase = `${name}-${String(state.seed).replace(/[^a-z0-9-_]+/gi, '_')}`;

  const onExport = async () => {
    const svg = buildSvgMarkup({ ...state });
    await exportPattern(svg, state.size, type, exportBase, 300);
    setStatusText('Export complete');
    setTimeout(() => setStatusText(''), 1200);
  };

  const onCopyConfig = async () => {
    const cfg = serializeConfig(state);
    const text = JSON.stringify(cfg, null, 2);
    try {
      await navigator.clipboard?.writeText(text);
      setStatusText('Config copied');
    } catch {
      setStatusText('Copy failed');
    } finally {
      setTimeout(() => setStatusText(''), 1200);
    }
  };

  const [configText, setConfigText] = useState('');
  const onApplyConfig = () => {
    try {
      const parsed = JSON.parse(configText);
      const next = applyConfig(state, parsed);
      setState(next);
      setStatusText('Config applied');
    } catch {
      setStatusText('Invalid JSON');
    } finally {
      setTimeout(() => setStatusText(''), 1400);
    }
  };

  return (
    <EditorShell
      controls={
        <div className="scrollbar-thin flex h-full min-h-0 flex-col gap-4 overflow-y-auto pr-1">
          <CollapsibleSection defaultOpen title="Layout">
            <Field
              label="Edge size (px)"
              type="number"
              min={200}
              max={2000}
              step={10}
              value={state.size}
              onChange={(v) => setState((s) => ({ ...s, size: clampInt(v, 200, 2000, 10) }))}
            />
            <RangeField
              label={`Modules per side (${state.modules})`}
              min={1}
              max={5}
              step={1}
              value={state.modules}
              onChange={(v) =>
                setState((s) => ({
                  ...s,
                  modules: clampInt(v, 1, 5, 1) as PatternState['modules'],
                  orientations: regenOrientations(clampInt(v, 1, 5, 1), s.seed)
                }))
              }
            />
          </CollapsibleSection>

          <CollapsibleSection defaultOpen title="Colors">
            <SelectField
              label="Palette"
              options={PRESETS.map((p) => ({ value: p.id, label: p.label }))}
              value={palette}
              onChange={(id) => {
                setPalette(id);
                const preset = PRESETS.find((p) => p.id === id) as any;
                if (preset && preset.bg && preset.shape) {
                  setState((s) => ({ ...s, bgColor: preset.bg, shapeColor: preset.shape }));
                }
              }}
            />
            <ColorField
              label="Shape color"
              value={state.shapeColor}
              onChange={(v) => {
                setPalette('custom');
                setState((s) => ({ ...s, shapeColor: v }));
              }}
            />
            <ColorField
              label="Background color"
              value={state.bgColor}
              onChange={(v) => {
                setPalette('custom');
                setState((s) => ({ ...s, bgColor: v }));
              }}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Interact">
            <ToggleField
              label="Enable cell edit"
              checked={state.editEnabled}
              onChange={(v) => setState((s) => ({ ...s, editEnabled: v }))}
            />
            <div className="mt-2 flex gap-2">
              <button
                className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/78 disabled:opacity-50"
                disabled={state.selectedIndex < 0}
                onClick={() => rotateSelected(-1)}
                type="button"
              >
                ⟲ Rotate -90
              </button>
              <button
                className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/78 disabled:opacity-50"
                disabled={state.selectedIndex < 0}
                onClick={() => rotateSelected(+1)}
                type="button"
              >
                ⟳ Rotate +90
              </button>
              <button
                className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/78 disabled:opacity-50"
                disabled={state.selectedIndex < 0}
                onClick={() => setState((s) => ({ ...s, selectedIndex: -1 }))}
                type="button"
              >
                Clear selection
              </button>
              <button
                className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/78"
                onClick={() =>
                  setState((s) => ({ ...s, orientations: regenOrientations(s.modules, s.seed) }))
                }
                type="button"
              >
                Reset orientations
              </button>
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.18em] text-white/48">
              {state.selectedIndex >= 0
                ? selectionLabel(state.selectedIndex, cellsPerSide(state.modules))
                : 'Selected: none'}
            </p>
          </CollapsibleSection>

          <CollapsibleSection title="Shape">
            <RadioRow
              label="Render mode"
              options={[
                { value: 'filled', label: 'Shape (filled)' },
                { value: 'arc', label: 'Arc (stroke)' }
              ]}
              value={state.mode}
              onChange={(v) => setState((s) => ({ ...s, mode: v as PatternState['mode'] }))}
            />
            <RangeField
              disabled={state.mode !== 'arc'}
              label={`Arc thickness (${state.strokeWidth})`}
              min={1}
              max={40}
              step={1}
              value={state.strokeWidth}
              onChange={(v) => setState((s) => ({ ...s, strokeWidth: clampInt(v, 1, 40, 1) }))}
            />
          </CollapsibleSection>

          <CollapsibleSection title="Process">
            <Field
              label="Seed"
              value={state.seed}
              onChange={(v) =>
                setState((s) => {
                  const seed = String(v);
                  return { ...s, seed, orientations: regenOrientations(s.modules, seed) };
                })
              }
            />
            <div className="flex gap-2">
              <button
                className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/78"
                onClick={() =>
                  setState((s) => {
                    const seed = randomSeed();
                    return { ...s, seed, orientations: regenOrientations(s.modules, seed) };
                  })
                }
                type="button"
              >
                Randomize
              </button>
              <button
                className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/78"
                onClick={onCopyConfig}
                type="button"
              >
                Copy Config
              </button>
            </div>
            <label className="mt-2 block">
              <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Config JSON</div>
              <textarea
                className="min-h-[100px] w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-fog"
                placeholder="Paste config JSON here"
                spellCheck={false}
                value={configText}
                onChange={(e) => setConfigText(e.target.value)}
              />
            </label>
            <div className="mt-2">
              <button
                className="rounded-full border border-white/10 px-3 py-2 text-sm text-white/78"
                onClick={onApplyConfig}
                type="button"
              >
                Apply Config
              </button>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Output">
            <Field label="Name" value={name} onChange={(v) => setName(String(v))} />
            <SelectField
              label="Type"
              options={[
                { value: 'png', label: 'PNG (300 DPI)' },
                { value: 'svg', label: 'SVG' },
                { value: 'jpg', label: 'JPG' }
              ]}
              value={type}
              onChange={(v) => setType(v as ExportType)}
            />
            <div className="mt-2 flex items-center gap-3">
              <button
                className="rounded-full bg-fog px-4 py-2 text-sm font-semibold text-ink"
                onClick={() => void onExport()}
                type="button"
              >
                Export
              </button>
              <span className="text-xs uppercase tracking-[0.18em] text-white/48">{statusText}</span>
            </div>
          </CollapsibleSection>
        </div>
      }
      header={
        <BrandedHeader
          subtitle="Quarter-circle cells in 2×2 modules with seeded randomness and exact JSON round-trips."
          title="Pattern Toolkit"
        />
      }
      preview={
        <PreviewSurface>
          <SurfaceCard className="flex min-h-0 flex-1 flex-col p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">Preview</p>
                <h2 className="mt-2 font-display text-2xl text-fog">Cells → Modules</h2>
                <p className="mt-2 text-sm text-white/58">{state.size}×{state.size}</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/54">
                {state.modules} modules · {cellsPerSide(state.modules)}×{cellsPerSide(state.modules)} cells
              </span>
            </div>
            <div
              className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto rounded-[28px] border border-white/8 bg-black/30 p-4"
              ref={containerRef}
            >
              <div
                className="max-h-full max-w-full overflow-hidden rounded-[24px] [&_svg]:h-full [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: previewSvg }}
                style={{ aspectRatio: '1 / 1', width: '100%' }}
              />
            </div>
          </SurfaceCard>
        </PreviewSurface>
      }
    />
  );
}

// ---------- UI Helpers ----------
function Field({
  label,
  value,
  onChange,
  type = 'text',
  min,
  max,
  step
}: {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  type?: 'text' | 'number';
  min?: number;
  max?: number;
  step?: number;
}) {
  const id = useIdCompat();
  return (
    <label className="block" htmlFor={id}>
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">{label}</div>
      <input
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
        id={id}
        name={id}
        type={type}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      />
    </label>
  );
}

function RangeField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  disabled
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  disabled?: boolean;
}) {
  const id = useIdCompat();
  return (
    <label className="block" htmlFor={id}>
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">{label}</div>
      <input
        className="w-full"
        id={id}
        name={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
      />
    </label>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useIdCompat();
  return (
    <label className="flex items-center justify-between gap-3" htmlFor={id}>
      <div className="text-xs uppercase tracking-[0.18em] text-white/48">{label}</div>
      <input
        className="h-9 w-12 rounded-xl border border-white/10 bg-transparent"
        id={id}
        name={id}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const id = useIdCompat();
  return (
    <label className="block" htmlFor={id}>
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">{label}</div>
      <select
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const id = useIdCompat();
  return (
    <label className="flex items-center justify-between" htmlFor={id}>
      <div className="text-xs uppercase tracking-[0.18em] text-white/48">{label}</div>
      <input
        className="h-5 w-5"
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  );
}

function RadioRow({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  const name = `radio-${useIdCompat()}`;
  return (
    <div>
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">{label}</div>
      <div className="flex gap-3">
        {options.map((opt) => (
          <label className="flex items-center gap-2" key={opt.value}>
            <input
              checked={value === opt.value}
              name={name}
              onChange={() => onChange(opt.value)}
              type="radio"
              value={opt.value}
            />
            <span className="text-sm text-fog">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function useIdCompat() {
  return useId();
}

function clampInt(v: string | number, min: number, max: number, step: number) {
  let n = typeof v === 'number' ? v : parseInt(v as string, 10);
  if (isNaN(n as number)) n = min;
  n = Math.max(min, Math.min(max, n));
  if (step) n = Math.round((n as number) / step) * step;
  return n as number;
}

function randomSeed() {
  if (typeof window !== 'undefined' && (window.crypto as any)?.getRandomValues) {
    const buf = new Uint32Array(2);
    (window.crypto as any).getRandomValues(buf);
    return 's' + buf[0].toString(36) + buf[1].toString(36);
  }
  return 's' + Math.floor(Math.random() * 1e12).toString(36);
}

function selectionLabel(idx: number, n: number) {
  if (idx < 0 || idx >= n * n) return 'Selected: none';
  const r = Math.floor(idx / n) + 1;
  const c = (idx % n) + 1;
  return `Selected: r${r}, c${c} (#${idx})`;
}

function serializeConfig(s: PatternState) {
  return {
    size: s.size,
    modules: s.modules,
    shapeColor: s.shapeColor,
    bgColor: s.bgColor,
    mode: s.mode,
    strokeWidth: s.strokeWidth,
    seed: s.seed,
    orientations: s.orientations,
    selectedIndex: s.selectedIndex
  };
}

function applyConfig(state: PatternState, cfg: any): PatternState {
  const next: PatternState = { ...state };
  next.size = clampInt(cfg.size ?? next.size, 200, 2000, 10);
  next.modules = clampInt(cfg.modules ?? next.modules, 1, 5, 1) as PatternState['modules'];
  next.shapeColor = cfg.shapeColor || next.shapeColor;
  next.bgColor = cfg.bgColor || next.bgColor;
  next.mode = cfg.mode === 'arc' ? 'arc' : 'filled';
  next.strokeWidth = clampInt(cfg.strokeWidth ?? next.strokeWidth, 1, 40, 1);
  next.seed = String(cfg.seed ?? next.seed);
  next.orientations = Array.isArray(cfg.orientations)
    ? (cfg.orientations as number[]).slice()
    : regenOrientations(next.modules, next.seed);
  next.selectedIndex = typeof cfg.selectedIndex === 'number' ? cfg.selectedIndex : -1;
  return next;
}

function buildPreviewSvg(state: PatternState) {
  const n = cellsPerSide(state.modules);
  const size = state.size;
  const cell = size / n;
  let svg = '';
  svg += `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
  svg += `<rect x="0" y="0" width="${size}" height="${size}" fill="${state.bgColor}"/>`;
  svg += `<g fill="${state.mode === 'filled' ? state.shapeColor : 'none'}" stroke="${
    state.mode === 'arc' ? state.shapeColor : 'none'
  }" stroke-width="${state.strokeWidth}" stroke-linecap="round" vector-effect="non-scaling-stroke">`;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const idx = r * n + c;
      const orient = state.orientations[idx] ?? 0;
      const x0 = c * cell;
      const y0 = r * cell;
      svg += `<path class="tile" data-idx="${idx}" d="${quarterPath(x0, y0, cell, orient, state.mode)}"/>`;
    }
  }
  svg += `</g>`;
  if (state.editEnabled && state.selectedIndex >= 0 && state.selectedIndex < n * n) {
    const r = Math.floor(state.selectedIndex / n);
    const c = state.selectedIndex % n;
    svg += `<rect x="${c * cell + 1}" y="${r * cell + 1}" width="${cell - 2}" height="${cell - 2}" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 4" />`;
  }
  svg += `</svg>`;
  return svg;
}
