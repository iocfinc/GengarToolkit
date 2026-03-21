'use client';

import { useMemo, useState } from 'react';
import { brandThemes, resolveColor } from '@packages/design-tokens/src/colors';
import type { SocialCardTemplate, SuiteAspectRatio } from '@packages/config-schema/src/document';
import { downloadBlob, svgMarkupToBlob, svgMarkupToPngBlob } from '@packages/export-engine/src/svgExport';
import { getOutputPreset } from '@packages/studio-shell/src/outputPresets';
import { loadStoredValue, saveStoredValue } from '@packages/studio-shell/src/presetStorage';
import { SurfaceCard } from '@packages/ui/src/SurfaceCard';

const STORAGE_KEY = 'dioscuri-social-card-presets-v1';
const DEFAULT_OUTPUT_PRESET_ID = 'square-1080';
const SOCIAL_OUTPUT_PRESET_IDS = [
  'square-1080',
  'portrait-4x5',
  'stories-9x16',
  'linkedin-shared-image',
  'landscape-16x9',
  'linkedin-video-landscape',
  'linkedin-video-square'
] as const;
const SOCIAL_OUTPUT_PRESETS = SOCIAL_OUTPUT_PRESET_IDS
  .map((presetId) => getOutputPreset(presetId))
  .filter((preset): preset is NonNullable<ReturnType<typeof getOutputPreset>> => Boolean(preset));

type SocialPreset = {
  id: string;
  name: string;
  template: SocialCardTemplate;
  outputPresetId: string;
  themeId: string;
  title: string;
  subtitle: string;
  body: string;
  footer: string;
  cta: string;
  quoteAttribution: string;
  accentColor: string;
  backgroundStyle: 'mesh' | 'spotlight' | 'wash';
  includeMiniChart: boolean;
};

function escapeMarkup(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function inferLegacyOutputPresetId(aspectRatio?: SuiteAspectRatio) {
  switch (aspectRatio) {
    case '4:5':
      return 'portrait-4x5';
    case '16:9':
      return 'landscape-16x9';
    case '1:1':
    default:
      return DEFAULT_OUTPUT_PRESET_ID;
  }
}

function normalizeSocialPreset(
  preset: SocialPreset & { aspectRatio?: SuiteAspectRatio }
): SocialPreset {
  return {
    ...preset,
    outputPresetId: preset.outputPresetId || inferLegacyOutputPresetId(preset.aspectRatio)
  };
}

function renderSocialSvg({
  template,
  outputPresetId,
  themeId,
  title,
  subtitle,
  body,
  footer,
  cta,
  quoteAttribution,
  accentColor,
  backgroundStyle,
  includeMiniChart
}: Omit<SocialPreset, 'id' | 'name'>) {
  const theme = brandThemes.find((entry) => entry.id === themeId) ?? brandThemes[0];
  const outputPreset =
    getOutputPreset(outputPresetId) ?? getOutputPreset(DEFAULT_OUTPUT_PRESET_ID) ?? SOCIAL_OUTPUT_PRESETS[0];
  const width = outputPreset?.width ?? 1080;
  const height = outputPreset?.height ?? 1080;
  const background = resolveColor(theme.canvas.background);
  const foreground = resolveColor(theme.canvas.foreground);
  const accent = resolveColor(accentColor);
  const pad = width > height ? 92 : 74;
  const bodyY = template === 'quote-card' ? 360 : 440;

  const backgroundMarkup =
    backgroundStyle === 'spotlight'
      ? `<radialGradient id="bg-grad" cx="20%" cy="15%"><stop offset="0%" stop-color="${accent}" stop-opacity="0.45" /><stop offset="100%" stop-color="${background}" stop-opacity="1" /></radialGradient><rect width="${width}" height="${height}" fill="url(#bg-grad)" />`
      : backgroundStyle === 'wash'
        ? `<linearGradient id="bg-grad" x1="0%" x2="100%" y1="0%" y2="100%"><stop offset="0%" stop-color="${background}" /><stop offset="100%" stop-color="${accent}" stop-opacity="0.3" /></linearGradient><rect width="${width}" height="${height}" fill="url(#bg-grad)" />`
        : `<rect width="${width}" height="${height}" fill="${background}" /><circle cx="${width * 0.82}" cy="${height * 0.18}" r="${Math.min(width, height) * 0.18}" fill="${accent}" opacity="0.22" /><circle cx="${width * 0.24}" cy="${height * 0.76}" r="${Math.min(width, height) * 0.11}" fill="${accent}" opacity="0.12" />`;

  const miniChartMarkup = includeMiniChart
    ? `
        <rect x="${pad}" y="${height - 260}" width="${width - pad * 2}" height="120" rx="22" fill="rgba(255,255,255,0.05)" />
        <rect x="${pad + 40}" y="${height - 190}" width="${width * 0.16}" height="28" rx="14" fill="${accent}" />
        <rect x="${pad + 40}" y="${height - 146}" width="${width * 0.28}" height="28" rx="14" fill="${accent}" opacity="0.75" />
        <rect x="${pad + 40}" y="${height - 102}" width="${width * 0.12}" height="28" rx="14" fill="${accent}" opacity="0.52" />
      `
    : '';

  const templateLabel = template.replaceAll('-', ' ').toUpperCase();

  return {
    width,
    height,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <defs>
          <linearGradient id="card-stroke" x1="0%" x2="100%">
            <stop offset="0%" stop-color="rgba(255,255,255,0.18)" />
            <stop offset="100%" stop-color="rgba(255,255,255,0.04)" />
          </linearGradient>
        </defs>
        ${backgroundMarkup}
        <rect x="28" y="28" width="${width - 56}" height="${height - 56}" rx="34" fill="rgba(255,255,255,0.03)" stroke="url(#card-stroke)" />
        <text x="${pad}" y="112" fill="${foreground}" opacity="0.58" font-size="18" font-family="Avenir Next, Segoe UI, sans-serif">${templateLabel}</text>
        <text x="${pad}" y="184" fill="${foreground}" font-size="${template === 'stat-card' ? 96 : 64}" font-family="Iowan Old Style, Times New Roman, serif" font-weight="700">${escapeMarkup(title)}</text>
        <text x="${pad}" y="${template === 'stat-card' ? 252 : 240}" fill="${foreground}" opacity="0.72" font-size="26" font-family="Avenir Next, Segoe UI, sans-serif">${escapeMarkup(subtitle)}</text>
        ${
          template === 'quote-card'
            ? `<text x="${pad}" y="${bodyY}" fill="${foreground}" font-size="42" font-family="Iowan Old Style, Times New Roman, serif">"${escapeMarkup(body)}"</text>`
            : `<foreignObject x="${pad}" y="${bodyY}" width="${width - pad * 2}" height="260"><div xmlns="http://www.w3.org/1999/xhtml" style="color:${foreground};font:500 28px 'Avenir Next','Segoe UI',sans-serif;line-height:1.45;">${escapeMarkup(body)}</div></foreignObject>`
        }
        <text x="${pad}" y="${height - 168}" fill="${foreground}" opacity="0.76" font-size="22" font-family="Avenir Next, Segoe UI, sans-serif">${escapeMarkup(template === 'quote-card' ? quoteAttribution : footer)}</text>
        <rect x="${pad}" y="${height - 126}" width="220" height="48" rx="24" fill="${accent}" />
        <text x="${pad + 28}" y="${height - 94}" fill="${background}" font-size="20" font-family="Avenir Next, Segoe UI, sans-serif" font-weight="700">${escapeMarkup(cta)}</text>
        ${miniChartMarkup}
      </svg>
    `.trim()
  };
}

export function SocialCardToolkitPage() {
  const [template, setTemplate] = useState<SocialCardTemplate>('announcement-card');
  const [outputPresetId, setOutputPresetId] = useState(DEFAULT_OUTPUT_PRESET_ID);
  const [themeId, setThemeId] = useState('dark-editorial');
  const [title, setTitle] = useState('Q2 launches moved faster than forecast');
  const [subtitle, setSubtitle] = useState('Constrained templates for fast internal publishing');
  const [body, setBody] = useState('Package your key message with strong defaults, approved brand treatments, and social-ready export sizes without rebuilding the same composition from scratch.');
  const [footer, setFooter] = useState('Dioscuri platform update');
  const [cta, setCta] = useState('Read brief');
  const [quoteAttribution, setQuoteAttribution] = useState('Internal Comms Team');
  const [accentColor, setAccentColor] = useState('royal');
  const [backgroundStyle, setBackgroundStyle] = useState<'mesh' | 'spotlight' | 'wash'>('mesh');
  const [includeMiniChart, setIncludeMiniChart] = useState(false);
  const [presetName, setPresetName] = useState('Launch update card');
  const [presets, setPresets] = useState<SocialPreset[]>(() =>
    loadStoredValue<Array<SocialPreset & { aspectRatio?: SuiteAspectRatio }>>(STORAGE_KEY, []).map(
      normalizeSocialPreset
    )
  );

  const preview = useMemo(
    () =>
      renderSocialSvg({
        template,
        outputPresetId,
        themeId,
        title,
        subtitle,
        body,
        footer,
        cta,
        quoteAttribution,
        accentColor,
        backgroundStyle,
        includeMiniChart
      }),
    [accentColor, backgroundStyle, body, cta, footer, includeMiniChart, outputPresetId, quoteAttribution, subtitle, template, themeId, title]
  );

  const savePreset = () => {
    const nextPreset: SocialPreset = {
      id: createId('social-preset'),
      name: presetName.trim() || 'Untitled social card',
      template,
      outputPresetId,
      themeId,
      title,
      subtitle,
      body,
      footer,
      cta,
      quoteAttribution,
      accentColor,
      backgroundStyle,
      includeMiniChart
    };
    const nextPresets = [nextPreset, ...presets];
    setPresets(nextPresets);
    saveStoredValue(STORAGE_KEY, nextPresets);
  };

  return (
    <main className="min-h-screen px-4 py-4 text-fog md:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1640px] flex-col gap-4 rounded-[32px] border border-white/8 bg-white/[0.03] p-4 shadow-panel">
        <SurfaceCard className="px-5 py-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-white/42">Social Card Toolkit</p>
              <h1 className="mt-2 font-display text-4xl text-fog">Branded short-form content system</h1>
              <p className="mt-3 max-w-3xl text-sm text-white/62">
                Turn repeatable announcement, quote, stat, and explainer formats into governed social assets with shared themes and exports.
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
                onClick={() => downloadBlob(svgMarkupToBlob(preview.svg), `${presetName || 'social-card'}.svg`)}
                type="button"
              >
                Export SVG
              </button>
              <button
                className="rounded-full bg-fog px-4 py-2 text-sm font-semibold text-ink"
                onClick={async () => {
                  const blob = await svgMarkupToPngBlob(preview.svg, preview.width, preview.height);
                  downloadBlob(blob, `${presetName || 'social-card'}.png`);
                }}
                type="button"
              >
                Export PNG
              </button>
            </div>
          </div>
        </SurfaceCard>

        <div className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)_320px]">
          <SurfaceCard className="space-y-4 p-4">
            <SectionLabel title="Template" />
            <Select
              label="Template"
              onChange={(value) => setTemplate(value as SocialCardTemplate)}
              options={[
                { value: 'quote-card', label: 'Quote Card' },
                { value: 'stat-card', label: 'Stat Card' },
                { value: 'announcement-card', label: 'Announcement Card' },
                { value: 'explainer-card', label: 'Explainer Card' },
                { value: 'chart-caption-card', label: 'Chart + Caption Card' }
              ]}
              value={template}
            />
            <Select
              label="Output Preset"
              onChange={setOutputPresetId}
              options={SOCIAL_OUTPUT_PRESETS.map((preset) => ({
                value: preset.id,
                label: `${preset.label} · ${preset.width}×${preset.height}`
              }))}
              value={outputPresetId}
            />
            <Select
              label="Theme"
              onChange={setThemeId}
              options={brandThemes.map((theme) => ({ value: theme.id, label: theme.name }))}
              value={themeId}
            />
            <Select
              label="Background Style"
              onChange={(value) => setBackgroundStyle(value as 'mesh' | 'spotlight' | 'wash')}
              options={[
                { value: 'mesh', label: 'Mesh' },
                { value: 'spotlight', label: 'Spotlight' },
                { value: 'wash', label: 'Wash' }
              ]}
              value={backgroundStyle}
            />
            <Field label="Preset Name" onChange={setPresetName} value={presetName} />
            <Field label="Title" onChange={setTitle} value={title} />
            <Field label="Subtitle" onChange={setSubtitle} value={subtitle} />
            <Field label="Footer" onChange={setFooter} value={footer} />
            <Field label="CTA" onChange={setCta} value={cta} />
            <Field label="Quote Attribution" onChange={setQuoteAttribution} value={quoteAttribution} />
          </SurfaceCard>

          <SurfaceCard className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">Preview</p>
                <h2 className="mt-2 font-display text-2xl text-fog">{template.replaceAll('-', ' ')}</h2>
              </div>
              <label className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs uppercase tracking-[0.18em] text-white/54">
                <input
                  checked={includeMiniChart}
                  onChange={(event) => setIncludeMiniChart(event.target.checked)}
                  type="checkbox"
                />
                Mini chart
              </label>
            </div>
            <div className="overflow-hidden rounded-[28px] border border-white/8 bg-black/30">
              <div
                className="w-full [&_svg]:h-full [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: preview.svg }}
                style={{ aspectRatio: `${preview.width} / ${preview.height}` }}
              />
            </div>
          </SurfaceCard>

          <SurfaceCard className="space-y-4 p-4">
            <SectionLabel title="Content" />
            <label className="block">
              <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Body Copy</div>
              <textarea
                className="min-h-[220px] w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-fog"
                onChange={(event) => setBody(event.target.value)}
                value={body}
              />
            </label>
            <Select
              label="Accent Color"
              onChange={setAccentColor}
              options={[
                { value: 'royal', label: 'Royal' },
                { value: 'orange', label: 'Orange' },
                { value: 'chartreuse', label: 'Chartreuse' },
                { value: 'emerald', label: 'Emerald' },
                { value: 'blush', label: 'Blush' }
              ]}
              value={accentColor}
            />
            {presets.length > 0 ? (
              <div className="space-y-2">
                <SectionLabel title="Saved Presets" />
                {presets.slice(0, 4).map((preset) => (
                  <button
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
                    key={preset.id}
                    onClick={() => {
                      setPresetName(preset.name);
                      setTemplate(preset.template);
                      setOutputPresetId(preset.outputPresetId);
                      setThemeId(preset.themeId);
                      setTitle(preset.title);
                      setSubtitle(preset.subtitle);
                      setBody(preset.body);
                      setFooter(preset.footer);
                      setCta(preset.cta);
                      setQuoteAttribution(preset.quoteAttribution);
                      setAccentColor(preset.accentColor);
                      setBackgroundStyle(preset.backgroundStyle);
                      setIncludeMiniChart(preset.includeMiniChart);
                    }}
                    type="button"
                  >
                    <p className="text-sm font-semibold text-fog">{preset.name}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/48">
                      {preset.template} / {getOutputPreset(preset.outputPresetId)?.label ?? 'Custom'}
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
