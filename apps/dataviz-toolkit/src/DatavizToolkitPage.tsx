'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { datasetToDelimitedText, inferNumericColumns, parseDatasetInput } from '@packages/chart-core/src/parser';
import { renderChartSvg } from '@packages/chart-core/src/renderSvg';
import { getChartTemplateDefinition, chartTemplateDefinitions } from '@packages/chart-core/src/templates';
import { getDatavizValidationMessages } from '@packages/chart-core/src/validation';
import {
  brandThemes,
  themePassesContrastGuidance,
  type ThemeDefinition
} from '@packages/design-tokens/src/colors';
import type {
  DatavizDataset,
  DatavizFieldMapping,
  DatavizOptions,
  DatavizTemplate,
  DatavizToolkitDocument,
  SuiteAspectRatio
} from '@packages/config-schema/src/document';
import { suiteExportCapabilities } from '@packages/export-engine/src/contracts';
import { downloadBlob, svgMarkupToBlob, svgMarkupToPngBlob } from '@packages/export-engine/src/svgExport';
import { BrandedHeader } from '@packages/studio-shell/src/BrandedHeader';
import { EditorShell } from '@packages/studio-shell/src/EditorShell';
import { getOutputPreset } from '@packages/studio-shell/src/outputPresets';
import { loadVersionedStoredValue, saveVersionedStoredValue } from '@packages/studio-shell/src/presetStorage';
import { PreviewSurface } from '@packages/studio-shell/src/PreviewSurface';
import { CollapsibleSection } from '@packages/ui/src/CollapsibleSection';
import { SurfaceCard } from '@packages/ui/src/SurfaceCard';
import { ColorTokenPicker } from '@packages/ui/src/controls/ColorTokenPicker';
import { SelectField } from '@packages/ui/src/controls/SelectField';
import { ToggleField } from '@packages/ui/src/controls/ToggleField';

const STORAGE_KEY = 'dioscuri-dataviz-presets-v1';
const STORAGE_VERSION = 1;
const DATAVIZ_OUTPUT_PRESET_IDS = ['portrait-4x5', 'landscape-16x9', 'square-1080'] as const;
const DATAVIZ_OUTPUT_PRESETS = DATAVIZ_OUTPUT_PRESET_IDS
  .map((presetId) => getOutputPreset(presetId))
  .filter((preset): preset is NonNullable<ReturnType<typeof getOutputPreset>> => Boolean(preset));
const DEFAULT_OUTPUT_PRESET_ID = DATAVIZ_OUTPUT_PRESETS[0]?.id ?? 'portrait-4x5';
const DEFAULT_OPTIONS: DatavizOptions = {
  showGrid: true,
  showLegend: true,
  animate: false,
  highlightSeries: undefined,
  useCustomPalette: false,
  customPalette: []
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

function getSuiteAspectRatioForPreset(presetId: string): SuiteAspectRatio {
  const aspectRatio = getOutputPreset(presetId)?.aspectRatio;

  if (aspectRatio === '1:1' || aspectRatio === '4:5' || aspectRatio === '16:9') {
    return aspectRatio;
  }

  return '4:5';
}

function slugifyFilename(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'dataviz-chart'
  );
}

function getTheme(themeId: string) {
  return brandThemes.find((theme) => theme.id === themeId) ?? brandThemes[0];
}

function buildPaletteSlots(theme: ThemeDefinition, options: DatavizOptions) {
  return Array.from({ length: 4 }, (_, index) => {
    return options.customPalette[index] ?? theme.chartPalette[index % theme.chartPalette.length];
  });
}

export function DatavizToolkitPage() {
  const [template, setTemplate] = useState<DatavizTemplate>('bar');
  const [outputPresetId, setOutputPresetId] = useState(DEFAULT_OUTPUT_PRESET_ID);
  const [exportFormat, setExportFormat] = useState<'png' | 'svg'>('png');
  const [themeId, setThemeId] = useState('dark-editorial');
  const [inputMode, setInputMode] = useState<'csv' | 'table' | 'json'>('csv');
  const [rawInput, setRawInput] = useState(defaultInput);
  const [headline, setHeadline] = useState('Ridership grew across peak hours');
  const [subheadline, setSubheadline] = useState(
    'Morning demand recovered faster than evening demand'
  );
  const [source, setSource] = useState('Source: Internal analytics');
  const [annotationsInput, setAnnotationsInput] = useState('North region reopened in March');
  const [mapping, setMapping] = useState<DatavizFieldMapping>({
    xColumn: 'Month',
    valueColumns: ['North', 'South', 'West'],
    yColumn: 'North'
  });
  const [options, setOptions] = useState<DatavizOptions>(DEFAULT_OPTIONS);
  const [presetName, setPresetName] = useState('Peak Hours Story');
  const [presets, setPresets] = useState<DatavizToolkitDocument[]>(() =>
    loadVersionedStoredValue<DatavizToolkitDocument[]>(STORAGE_KEY, STORAGE_VERSION, [])
  );

  const deferredInput = useDeferredValue(rawInput);
  const aspectRatio = getSuiteAspectRatioForPreset(outputPresetId);
  const outputPreset =
    getOutputPreset(outputPresetId) ?? getOutputPreset(DEFAULT_OUTPUT_PRESET_ID) ?? DATAVIZ_OUTPUT_PRESETS[0];
  const annotations = useMemo(
    () =>
      annotationsInput
        .split(/\r?\n/)
        .map((value) => value.trim())
        .filter(Boolean),
    [annotationsInput]
  );
  const templateDefinition = getChartTemplateDefinition(template);
  const exportCapabilities = suiteExportCapabilities.dataviz;
  const activeTheme = getTheme(themeId);
  const editablePalette = buildPaletteSlots(activeTheme, options);

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
        themeId,
        annotations,
        options,
        size: outputPreset
          ? {
              width: outputPreset.width,
              height: outputPreset.height
            }
          : undefined
      }),
    [
      annotations,
      aspectRatio,
      dataset,
      headline,
      options,
      outputPreset,
      resolvedMapping,
      source,
      subheadline,
      template,
      themeId
    ]
  );

  const validationMessages = [
    ...(!error
      ? getDatavizValidationMessages({
          dataset,
          mapping: resolvedMapping,
          template,
          highlightSeries: options.highlightSeries
        })
      : []),
    !themePassesContrastGuidance(activeTheme, 3.8)
      ? 'Selected theme fails the current contrast guidance.'
      : null
  ].filter(Boolean) as string[];

  const exportCurrentPreview = async () => {
    const filename = slugifyFilename(presetName);

    if (exportFormat === 'svg') {
      downloadBlob(svgMarkupToBlob(preview.svg), `${filename}.svg`);
      return;
    }

    const blob = await svgMarkupToPngBlob(preview.svg, preview.width, preview.height);
    downloadBlob(blob, `${filename}.png`);
  };

  const savePreset = () => {
    const timestamp = new Date().toISOString();
    const nextPreset: DatavizToolkitDocument = {
      toolkit: 'dataviz',
      template,
      theme: themeId,
      aspectRatio,
      export: {
        format: exportFormat,
        filename: slugifyFilename(presetName),
        presetId: outputPresetId
      },
      presetMeta: {
        id: createId('dataviz-preset'),
        name: presetName.trim() || 'Untitled preset',
        createdAt: timestamp,
        updatedAt: timestamp
      },
      content: {
        headline,
        subheadline,
        annotations,
        source
      },
      data: dataset,
      mapping: resolvedMapping,
      options
    };
    const nextPresets = [nextPreset, ...presets];
    setPresets(nextPresets);
    saveVersionedStoredValue(STORAGE_KEY, STORAGE_VERSION, nextPresets);
  };

  const updateCustomPalette = (index: number, value: string) => {
    setOptions((current) => {
      const nextPalette = buildPaletteSlots(activeTheme, current);
      nextPalette[index] = value;

      return {
        ...current,
        useCustomPalette: true,
        customPalette: nextPalette
      };
    });
  };

  return (
    <EditorShell
      controls={
        <div className="space-y-4 overflow-y-auto pr-1">
          <CollapsibleSection defaultOpen title="Story">
            <Field label="Preset Name" onChange={setPresetName} value={presetName} />
            <Field label="Headline" onChange={setHeadline} value={headline} />
            <TextAreaField label="Subheadline" onChange={setSubheadline} value={subheadline} />
            <Field label="Source" onChange={setSource} value={source} />
            <TextAreaField label="Annotations" onChange={setAnnotationsInput} value={annotationsInput} />
          </CollapsibleSection>

          <CollapsibleSection defaultOpen title="Template & Output">
            <SelectField
              label="Chart Template"
              onChange={(value) => setTemplate(value as DatavizTemplate)}
              options={chartTemplateDefinitions.map((entry) => ({
                value: entry.id,
                label: entry.label
              }))}
              value={template}
            />
            <SelectField
              label="Output Preset"
              onChange={setOutputPresetId}
              options={DATAVIZ_OUTPUT_PRESETS.map((preset) => ({
                value: preset.id,
                label: `${preset.label} · ${preset.aspectRatio}`
              }))}
              value={outputPresetId}
            />
            <SelectField
              label="Export Format"
              onChange={(value) => setExportFormat(value as 'png' | 'svg')}
              options={exportCapabilities.map((capability) => ({
                value: capability.format,
                label: capability.label
              }))}
              value={exportFormat}
            />
            <SelectField
              label="Theme"
              onChange={setThemeId}
              options={brandThemes.map((theme) => ({
                value: theme.id,
                label: theme.name
              }))}
              value={themeId}
            />
            <ToggleField
              checked={options.showGrid}
              label="Show Grid"
              onChange={(checked) => setOptions((current) => ({ ...current, showGrid: checked }))}
            />
            <ToggleField
              checked={options.showLegend}
              label="Show Legend"
              onChange={(checked) => setOptions((current) => ({ ...current, showLegend: checked }))}
            />
          </CollapsibleSection>

          <CollapsibleSection defaultOpen title="Data & Mapping">
            <SelectField
              label="Input Mode"
              onChange={(value) => setInputMode(value as 'csv' | 'table' | 'json')}
              options={[
                { value: 'csv', label: 'CSV' },
                { value: 'table', label: 'Pasted Table' },
                { value: 'json', label: 'JSON' }
              ]}
              value={inputMode}
            />
            <TextAreaField label="Dataset" onChange={setRawInput} value={rawInput} />
            {error ? <p className="text-sm text-red-200">{error}</p> : null}
            <SelectField
              label="Category / X Column"
              onChange={(value) =>
                setMapping((current) => ({ ...current, xColumn: value, labelColumn: value }))
              }
              options={dataset.columns.map((column) => ({ value: column, label: column }))}
              value={resolvedMapping.xColumn ?? ''}
            />
            <SelectField
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
                      className={`rounded-full border px-3 py-1.5 text-sm ${
                        selected
                          ? 'border-chartreuse/60 bg-chartreuse/15 text-fog'
                          : 'border-white/10 text-white/62'
                      }`}
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
            {templateDefinition?.requiresMultipleSeries && resolvedMapping.valueColumns.length > 0 ? (
              <SelectField
                label="Highlight Series"
                onChange={(value) =>
                  setOptions((current) => ({ ...current, highlightSeries: value || undefined }))
                }
                options={resolvedMapping.valueColumns.map((column) => ({
                  value: column,
                  label: column
                }))}
                value={options.highlightSeries ?? resolvedMapping.valueColumns[0] ?? ''}
              />
            ) : null}
          </CollapsibleSection>

          <CollapsibleSection defaultOpen={false} title="Palettes">
            <ToggleField
              checked={options.useCustomPalette}
              label="Use Custom Palette"
              onChange={(checked) =>
                setOptions((current) => ({
                  ...current,
                  useCustomPalette: checked,
                  customPalette: checked ? buildPaletteSlots(activeTheme, current) : []
                }))
              }
            />
            {options.useCustomPalette ? (
              <div className="space-y-4">
                {editablePalette.map((token, index) => (
                  <ColorTokenPicker
                    key={`${index}-${token}`}
                    label={`Series ${index + 1}`}
                    onChange={(value) => updateCustomPalette(index, value)}
                    value={token}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-white/58">
                The current theme palette stays as the default until you enable custom overrides.
              </p>
            )}
          </CollapsibleSection>

          {presets.length > 0 ? (
            <CollapsibleSection defaultOpen={false} title="Saved Presets">
              {presets.slice(0, 4).map((preset) => (
                <button
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
                  key={preset.presetMeta.id}
                  onClick={() => {
                    setTemplate(preset.template);
                    setThemeId(preset.theme);
                    setOutputPresetId(preset.export.presetId ?? DEFAULT_OUTPUT_PRESET_ID);
                    setExportFormat(preset.export.format);
                    setInputMode('csv');
                    setRawInput(datasetToDelimitedText(preset.data));
                    setMapping(preset.mapping);
                    setHeadline(preset.content.headline);
                    setSubheadline(preset.content.subheadline);
                    setSource(preset.content.source);
                    setAnnotationsInput(preset.content.annotations.join('\n'));
                    setOptions({
                      ...DEFAULT_OPTIONS,
                      ...preset.options
                    });
                    setPresetName(preset.presetMeta.name);
                  }}
                  type="button"
                >
                  <p className="text-sm font-semibold text-fog">{preset.presetMeta.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/48">
                    {preset.template} / {preset.export.presetId}
                  </p>
                </button>
              ))}
            </CollapsibleSection>
          ) : null}
        </div>
      }
      header={
        <BrandedHeader
          actions={
            <>
              <button
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78"
                onClick={savePreset}
                type="button"
              >
                Save Preset
              </button>
              <button
                className="rounded-full bg-fog px-4 py-2 text-sm font-semibold text-ink"
                onClick={() => void exportCurrentPreview()}
                type="button"
              >
                Export {exportFormat.toUpperCase()}
              </button>
            </>
          }
          subtitle="Use dropdown editing panels, fixed chart geometry, and branded output presets to build production-ready editorial graphics."
          title="Data Visualization Toolkit"
        />
      }
      preview={
        <PreviewSurface>
          <SurfaceCard className="flex min-h-0 flex-1 flex-col p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">Preview</p>
                <h2 className="mt-2 font-display text-2xl text-fog">{templateDefinition?.label}</h2>
                <p className="mt-2 text-sm text-white/58">
                  {outputPreset?.label} · {preview.width}×{preview.height}
                </p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/54">
                {dataset.rows.length} rows
              </span>
            </div>
            <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[28px] border border-white/8 bg-black/30 p-4">
              <div
                className="max-h-full max-w-full overflow-hidden rounded-[24px] [&_svg]:h-full [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: preview.svg }}
                style={{ aspectRatio: `${preview.width} / ${preview.height}`, width: '100%' }}
              />
            </div>
            {validationMessages.length > 0 ? (
              <div className="mt-4 space-y-2">
                {validationMessages.map((message) => (
                  <p
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/68"
                    key={message}
                  >
                    {message}
                  </p>
                ))}
              </div>
            ) : null}
          </SurfaceCard>
        </PreviewSurface>
      }
    />
  );
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

function TextAreaField({
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
      <textarea
        className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-fog"
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}
