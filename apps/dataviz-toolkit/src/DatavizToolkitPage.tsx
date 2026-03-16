'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { chartTemplateDefinitions } from '@packages/chart-core/src/templates';
import { inferNumericColumns, parseDatasetInput } from '@packages/chart-core/src/parser';
import { renderChartSvg } from '@packages/chart-core/src/renderSvg';
import { brandThemes, themePassesContrastGuidance } from '@packages/design-tokens/src/colors';
import type {
  DatavizDataset,
  DatavizFieldMapping,
  DatavizTemplate,
  SuiteAspectRatio
} from '@packages/config-schema/src/document';
import { downloadBlob, svgMarkupToBlob, svgMarkupToPngBlob } from '@packages/export-engine/src/svgExport';
import { loadStoredValue, saveStoredValue } from '@packages/studio-shell/src/presetStorage';
import { SurfaceCard } from '@packages/ui/src/SurfaceCard';

const STORAGE_KEY = 'dioscuri-dataviz-presets-v1';

type DatavizPreset = {
  id: string;
  name: string;
  template: DatavizTemplate;
  aspectRatio: SuiteAspectRatio;
  themeId: string;
  inputMode: 'csv' | 'table' | 'json';
  rawInput: string;
  mapping: DatavizFieldMapping;
  headline: string;
  subheadline: string;
  source: string;
};

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function defaultInput() {
  return 'Month,North,South,West\nJan,12,9,7\nFeb,18,11,10\nMar,22,16,13\nApr,28,19,17';
}

const emptyDataset: DatavizDataset = {
  columns: [],
  rows: []
};

export function DatavizToolkitPage() {
  const [template, setTemplate] = useState<DatavizTemplate>('bar');
  const [aspectRatio, setAspectRatio] = useState<SuiteAspectRatio>('4:5');
  const [themeId, setThemeId] = useState('dark-editorial');
  const [inputMode, setInputMode] = useState<'csv' | 'table' | 'json'>('csv');
  const [rawInput, setRawInput] = useState(defaultInput);
  const [headline, setHeadline] = useState('Ridership grew across peak hours');
  const [subheadline, setSubheadline] = useState('Morning demand recovered faster than evening demand');
  const [source, setSource] = useState('Source: Internal analytics');
  const [mapping, setMapping] = useState<DatavizFieldMapping>({
    xColumn: 'Month',
    valueColumns: ['North', 'South', 'West'],
    yColumn: 'North'
  });
  const [presetName, setPresetName] = useState('Peak Hours Story');
  const [presets, setPresets] = useState<DatavizPreset[]>(() =>
    loadStoredValue<DatavizPreset[]>(STORAGE_KEY, [])
  );

  const deferredInput = useDeferredValue(rawInput);

  const parsedInput = useMemo(() => {
    try {
      return {
        dataset: parseDatasetInput(deferredInput, inputMode),
        error: null
      };
    } catch (nextError) {
      return {
        dataset: emptyDataset,
        error: nextError instanceof Error ? nextError.message : 'Unable to parse dataset.'
      };
    }
  }, [deferredInput, inputMode]);

  const { dataset, error } = parsedInput;

  const numericColumns = useMemo(() => inferNumericColumns(dataset), [dataset]);

  const resolvedMapping = useMemo<DatavizFieldMapping>(() => {
    if (dataset.columns.length === 0) {
      return {
        xColumn: undefined,
        yColumn: undefined,
        valueColumns: [],
        labelColumn: undefined,
        highlightColumn: undefined
      };
    }

    const availableColumns = dataset.columns;
    const valueColumns = mapping.valueColumns.filter((column) => availableColumns.includes(column));

    return {
      xColumn:
        mapping.xColumn && availableColumns.includes(mapping.xColumn)
          ? mapping.xColumn
          : availableColumns[0],
      yColumn:
        mapping.yColumn && availableColumns.includes(mapping.yColumn)
          ? mapping.yColumn
          : numericColumns[0] ?? availableColumns[1] ?? availableColumns[0],
      valueColumns: valueColumns.length > 0 ? valueColumns : numericColumns.slice(0, 3),
      labelColumn:
        mapping.labelColumn && availableColumns.includes(mapping.labelColumn)
          ? mapping.labelColumn
          : availableColumns[0],
      highlightColumn:
        mapping.highlightColumn && availableColumns.includes(mapping.highlightColumn)
          ? mapping.highlightColumn
          : undefined
    };
  }, [dataset.columns, mapping, numericColumns]);

  const preview = useMemo(
    () =>
      renderChartSvg({
        dataset,
        mapping: resolvedMapping,
        template,
        aspectRatio,
        headline,
        subheadline,
        source,
        themeId
      }),
    [aspectRatio, dataset, headline, resolvedMapping, source, subheadline, template, themeId]
  );

  const validationMessages = [
    dataset.rows.length === 0 ? 'Add data to unlock a valid chart preview.' : null,
    !resolvedMapping.xColumn ? 'Choose a category or x-axis column.' : null,
    template !== 'big-number' && !resolvedMapping.yColumn && resolvedMapping.valueColumns.length === 0
      ? 'Choose at least one numeric value column.'
      : null,
    !themePassesContrastGuidance(brandThemes.find((theme) => theme.id === themeId) ?? brandThemes[0], 3.8)
      ? 'Selected theme fails the current contrast guidance.'
      : null
  ].filter(Boolean) as string[];

  const savePreset = () => {
    const nextPreset: DatavizPreset = {
      id: createId('dataviz-preset'),
      name: presetName.trim() || 'Untitled preset',
      template,
      aspectRatio,
      themeId,
      inputMode,
      rawInput,
      mapping: resolvedMapping,
      headline,
      subheadline,
      source
    };
    const nextPresets = [nextPreset, ...presets];
    setPresets(nextPresets);
    saveStoredValue(STORAGE_KEY, nextPresets);
  };

  return (
    <main className="min-h-screen px-4 py-4 text-fog md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1680px] flex-col gap-4 rounded-[32px] border border-white/8 bg-white/[0.03] p-4 shadow-panel">
        <SurfaceCard className="px-5 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-white/42">Dataviz Toolkit</p>
              <h1 className="mt-2 font-display text-4xl text-fog">Structured editorial charts</h1>
              <p className="mt-3 max-w-3xl text-sm text-white/62">
                Upload structured data, map fields into approved templates, and export a branded chart without leaving the platform.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78"
                onClick={savePreset}
                type="button"
              >
                Save Preset
              </button>
              <button
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78"
                onClick={() => downloadBlob(svgMarkupToBlob(preview.svg), `${presetName || 'dataviz'}.svg`)}
                type="button"
              >
                Export SVG
              </button>
              <button
                className="rounded-full bg-fog px-4 py-2 text-sm font-semibold text-ink"
                onClick={async () => {
                  const blob = await svgMarkupToPngBlob(preview.svg, preview.width, preview.height);
                  downloadBlob(blob, `${presetName || 'dataviz'}.png`);
                }}
                type="button"
              >
                Export PNG
              </button>
            </div>
          </div>
        </SurfaceCard>

        <div className="grid gap-4 xl:grid-cols-[420px_minmax(0,1fr)_320px]">
          <SurfaceCard className="space-y-4 p-4">
            <SectionLabel title="Template" />
            <Select
              label="Chart Template"
              onChange={(value) => setTemplate(value as DatavizTemplate)}
              options={chartTemplateDefinitions.map((entry) => ({
                value: entry.id,
                label: entry.label
              }))}
              value={template}
            />
            <Select
              label="Aspect Ratio"
              onChange={(value) => setAspectRatio(value as SuiteAspectRatio)}
              options={[
                { value: '1:1', label: '1:1 Square' },
                { value: '4:5', label: '4:5 Portrait' },
                { value: '16:9', label: '16:9 Presentation' }
              ]}
              value={aspectRatio}
            />
            <Select
              label="Theme"
              onChange={setThemeId}
              options={brandThemes.map((theme) => ({
                value: theme.id,
                label: theme.name
              }))}
              value={themeId}
            />
            <Field label="Preset Name" onChange={setPresetName} value={presetName} />
            <Field label="Headline" onChange={setHeadline} value={headline} />
            <Field label="Subheadline" onChange={setSubheadline} value={subheadline} />
            <Field label="Source" onChange={setSource} value={source} />
          </SurfaceCard>

          <SurfaceCard className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">Preview</p>
                <h2 className="mt-2 font-display text-2xl text-fog">{chartTemplateDefinitions.find((entry) => entry.id === template)?.label}</h2>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/54">
                {dataset.rows.length} rows
              </span>
            </div>
            <div className="overflow-hidden rounded-[28px] border border-white/8 bg-black/30">
              <div
                className="aspect-[4/5] w-full [&_svg]:h-full [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: preview.svg }}
              />
            </div>
            {validationMessages.length > 0 ? (
              <div className="mt-4 space-y-2">
                {validationMessages.map((message) => (
                  <p className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/68" key={message}>
                    {message}
                  </p>
                ))}
              </div>
            ) : null}
          </SurfaceCard>

          <SurfaceCard className="space-y-4 p-4">
            <SectionLabel title="Data" />
            <Select
              label="Input Mode"
              onChange={(value) => setInputMode(value as 'csv' | 'table' | 'json')}
              options={[
                { value: 'csv', label: 'CSV' },
                { value: 'table', label: 'Pasted Table' },
                { value: 'json', label: 'JSON' }
              ]}
              value={inputMode}
            />
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Dataset</div>
              <textarea
                className="min-h-[220px] w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-fog"
                onChange={(event) => setRawInput(event.target.value)}
                value={rawInput}
              />
            </label>
            {error ? <p className="text-sm text-red-200">{error}</p> : null}
            <Select
              label="Category / X Column"
              onChange={(value) => setMapping((current) => ({ ...current, xColumn: value, labelColumn: value }))}
              options={dataset.columns.map((column) => ({ value: column, label: column }))}
              value={resolvedMapping.xColumn ?? ''}
            />
            <Select
              label="Primary Value Column"
              onChange={(value) => setMapping((current) => ({ ...current, yColumn: value }))}
              options={numericColumns.map((column) => ({ value: column, label: column }))}
              value={resolvedMapping.yColumn ?? ''}
            />
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Series Columns</div>
              <div className="flex flex-wrap gap-2">
                {numericColumns.map((column) => {
                  const selected = resolvedMapping.valueColumns.includes(column);
                  return (
                    <button
                      className={`rounded-full border px-3 py-1.5 text-sm ${selected ? 'border-chartreuse/60 bg-chartreuse/15 text-fog' : 'border-white/10 text-white/62'}`}
                      key={column}
                      onClick={() =>
                        setMapping((current) => ({
                          ...current,
                          valueColumns: selected
                            ? current.valueColumns.filter((entry) => entry !== column)
                            : [...current.valueColumns, column]
                        }))
                      }
                      type="button"
                    >
                      {column}
                    </button>
                  );
                })}
              </div>
            </label>
            {presets.length > 0 ? (
              <div className="space-y-2">
                <SectionLabel title="Saved Presets" />
                {presets.slice(0, 4).map((preset) => (
                  <button
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
                    key={preset.id}
                    onClick={() => {
                      setTemplate(preset.template);
                      setAspectRatio(preset.aspectRatio);
                      setThemeId(preset.themeId);
                      setInputMode(preset.inputMode);
                      setRawInput(preset.rawInput);
                      setMapping(preset.mapping);
                      setHeadline(preset.headline);
                      setSubheadline(preset.subheadline);
                      setSource(preset.source);
                      setPresetName(preset.name);
                    }}
                    type="button"
                  >
                    <p className="text-sm font-semibold text-fog">{preset.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/48">
                      {preset.template} / {preset.aspectRatio}
                    </p>
                  </button>
                ))}
              </div>
            ) : null}
          </SurfaceCard>
        </div>
      </div>
    </main>
  );
}

function SectionLabel({ title }: { title: string }) {
  return <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">{title}</p>;
}

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">{label}</div>
      <input
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">{label}</div>
      <select
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      >
        {options.map((option) => (
          <option className="bg-[#111111]" key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
