'use client';

import { useId, useMemo, useState } from 'react';
import { brandThemes } from '@packages/design-tokens/src/colors';
import type { SocialCardTemplate } from '@packages/config-schema/src/document';
import { downloadBlob, svgMarkupToBlob, svgMarkupToPngBlob } from '@packages/export-engine/src/svgExport';
import { BrandedHeader } from '@packages/studio-shell/src/BrandedHeader';
import { EditorShell } from '@packages/studio-shell/src/EditorShell';
import { PreviewSurface } from '@packages/studio-shell/src/PreviewSurface';
import { loadStoredValue, saveStoredValue } from '@packages/studio-shell/src/presetStorage';
import { CollapsibleSection } from '@packages/ui/src/CollapsibleSection';
import { SurfaceCard } from '@packages/ui/src/SurfaceCard';
import { ColorTokenPicker } from '@packages/ui/src/controls/ColorTokenPicker';
import { SelectField } from '@packages/ui/src/controls/SelectField';
import { ToggleField } from '@packages/ui/src/controls/ToggleField';
import {
  DEFAULT_OUTPUT_PRESET_ID,
  DIOSCURI_AGENT_TEAM_ANNOUNCEMENT_PRESET,
  SOCIAL_CHART_TEMPLATES,
  SOCIAL_OUTPUT_PRESETS,
  SEEDED_SOCIAL_CARD_PRESETS,
  getDefaultSocialCardDraft,
  getSocialCardTemplateDefinition,
  getSocialCardValidationMessages,
  normalizeSocialPreset,
  renderSocialCardPreview,
  socialCardTemplateDefinitions
} from './framework/registry';
import type { SocialCardDraft, SocialCardPreset } from './framework/types';

const STORAGE_KEY = 'dioscuri-social-card-presets-v1';

type SocialCardSectionId = 'template-output' | 'copy' | 'chart' | 'saved-presets';

function createId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function SocialCardToolkitPage() {
  const [draft, setDraft] = useState<SocialCardDraft>(getDefaultSocialCardDraft);
  const [activeSection, setActiveSection] = useState<SocialCardSectionId | null>(null);
  const [presetName, setPresetName] = useState(DIOSCURI_AGENT_TEAM_ANNOUNCEMENT_PRESET.name);
  const [activeSection, setActiveSection] = useState<
    'template-output' | 'copy' | 'chart' | 'saved-presets' | null
  >(null);
  const [activeSection, setActiveSection] = useState<SocialSectionId | null>(null);
  const [presets, setPresets] = useState<SocialCardPreset[]>(() =>
    loadStoredValue<SocialCardPreset[]>(STORAGE_KEY, SEEDED_SOCIAL_CARD_PRESETS).map((preset) =>
      normalizeSocialPreset(preset)
    )
  );

  const templateDefinition =
    getSocialCardTemplateDefinition(draft.template) ?? socialCardTemplateDefinitions[0];
  const outputPreset =
    SOCIAL_OUTPUT_PRESETS.find((preset) => preset.id === draft.outputPresetId) ??
    SOCIAL_OUTPUT_PRESETS[0];
  const preview = useMemo(() => renderSocialCardPreview(draft), [draft]);
  const validationMessages = useMemo(() => getSocialCardValidationMessages(draft), [draft]);

  const updateDraft = <T extends keyof SocialCardDraft>(key: T, value: SocialCardDraft[T]) => {
    setDraft((current) => ({
      ...current,
      [key]: value
    }));
  };

  const savePreset = () => {
    const nextPreset: SocialCardPreset = normalizeSocialPreset({
      ...draft,
      id: createId('social-preset'),
      name: presetName.trim() || 'Untitled social card'
    });
    const nextPresets = [
      nextPreset,
      ...presets.filter(
        (preset) => preset.name.trim().toLowerCase() !== nextPreset.name.trim().toLowerCase()
      )
    ];
    setPresets(nextPresets);
    saveStoredValue(STORAGE_KEY, nextPresets);
  };

  const exportSvg = () => {
    downloadBlob(svgMarkupToBlob(preview.svg), `${presetName || 'social-card'}.svg`);
  };

  const exportPng = async () => {
    const blob = await svgMarkupToPngBlob(preview.svg, preview.width, preview.height);
    downloadBlob(blob, `${presetName || 'social-card'}.png`);
  };

  function handleSectionChange(
    sectionId: 'template-output' | 'copy' | 'chart' | 'saved-presets',
    open: boolean
  ) {
  function handleSectionChange(sectionId: SocialCardSectionId, open: boolean) {
    setActiveSection(open ? sectionId : null);
  }

  const activeSectionCardClass = 'flex min-h-0 flex-1 flex-col';
  const activeSectionContentClass = 'min-h-0 flex-1 overflow-y-auto scrollbar-thin';

  return (
    <EditorShell
      controls={
        <div
          className={`scrollbar-thin flex h-full min-h-0 flex-col gap-4 pr-1 ${
            activeSection ? 'overflow-hidden' : 'overflow-y-auto'
          }`}
          data-testid="social-card-control-panel"
        >
          {!activeSection || activeSection === 'template-output' ? (
            <CollapsibleSection
              className={activeSection === 'template-output' ? activeSectionCardClass : ''}
              contentClassName={activeSection === 'template-output' ? activeSectionContentClass : ''}
              onOpenChange={(open) => handleSectionChange('template-output', open)}
              open={activeSection === 'template-output'}
              title="Template & Output"
            >
            <Field label="Preset Name" onChange={setPresetName} value={presetName} />
            <SelectField
              label="Template"
              onChange={(value) => updateDraft('template', value as SocialCardTemplate)}
              options={socialCardTemplateDefinitions.map((definition) => ({
                value: definition.id,
                label: definition.label
              }))}
              value={draft.template}
            />
            <SelectField
              label="Output Preset"
              onChange={(value) => updateDraft('outputPresetId', value)}
              options={SOCIAL_OUTPUT_PRESETS.map((preset) => ({
                value: preset.id,
                label: `${preset.label} · ${preset.width}×${preset.height}`
              }))}
              value={draft.outputPresetId || DEFAULT_OUTPUT_PRESET_ID}
            />
            <SelectField
              label="Theme"
              onChange={(value) => updateDraft('themeId', value)}
              options={brandThemes.map((theme) => ({
                value: theme.id,
                label: theme.name
              }))}
              value={draft.themeId}
            />
            <SelectField
              label="Background Style"
              onChange={(value) => updateDraft('backgroundStyle', value as SocialCardDraft['backgroundStyle'])}
              options={[
                { value: 'mesh', label: 'Mesh' },
                { value: 'spotlight', label: 'Spotlight' },
                { value: 'wash', label: 'Wash' }
              ]}
              value={draft.backgroundStyle}
            />
            <ColorTokenPicker
              label="Accent Color"
              onChange={(value) => updateDraft('accentColor', value)}
              value={draft.accentColor}
            />
            </CollapsibleSection>
          ) : null}

          {!activeSection || activeSection === 'copy' ? (
            <CollapsibleSection
              className={activeSection === 'copy' ? activeSectionCardClass : ''}
              contentClassName={activeSection === 'copy' ? activeSectionContentClass : ''}
              onOpenChange={(open) => handleSectionChange('copy', open)}
              open={activeSection === 'copy'}
              title="Copy"
            >
            <Field label="Title" onChange={(value) => updateDraft('title', value)} value={draft.title} />
            <Field label="Subtitle" onChange={(value) => updateDraft('subtitle', value)} value={draft.subtitle} />
            {templateDefinition.bodyLabel ? (
              <TextAreaField
                label={templateDefinition.bodyLabel}
                onChange={(value) => updateDraft('body', value)}
                value={draft.body}
              />
            ) : null}
            {templateDefinition.footerLabel ? (
              <Field
                label={templateDefinition.footerLabel}
                onChange={(value) => updateDraft('footer', value)}
                value={draft.footer}
              />
            ) : null}
            {templateDefinition.ctaLabel ? (
              <Field
                label={templateDefinition.ctaLabel}
                onChange={(value) => updateDraft('cta', value)}
                value={draft.cta}
              />
            ) : null}
            {templateDefinition.quoteAttributionLabel ? (
              <Field
                label={templateDefinition.quoteAttributionLabel}
                onChange={(value) => updateDraft('quoteAttribution', value)}
                value={draft.quoteAttribution}
              />
            ) : null}
            </CollapsibleSection>
          ) : null}

          {templateDefinition.chartEnabled && (!activeSection || activeSection === 'chart') ? (
            <CollapsibleSection
              className={activeSection === 'chart' ? activeSectionCardClass : ''}
              contentClassName={activeSection === 'chart' ? activeSectionContentClass : ''}
              onOpenChange={(open) => handleSectionChange('chart', open)}
              open={activeSection === 'chart'}
              title="Chart"
            >
              <SelectField
                label="Chart Template"
                onChange={(value) => updateDraft('chartTemplate', value as SocialCardDraft['chartTemplate'])}
                options={SOCIAL_CHART_TEMPLATES.map((template) => ({
                  value: template.value,
                  label: template.label
                }))}
                value={draft.chartTemplate}
              />
              <TextAreaField
                label="Chart Dataset (CSV)"
                onChange={(value) => updateDraft('chartInput', value)}
                value={draft.chartInput}
              />
              <ToggleField
                checked={draft.chartShowLegend}
                label="Show Chart Legend"
                onChange={(value) => updateDraft('chartShowLegend', value)}
              />
            </CollapsibleSection>
          ) : null}

          {presets.length > 0 && (!activeSection || activeSection === 'saved-presets') ? (
            <CollapsibleSection
              className={activeSection === 'saved-presets' ? activeSectionCardClass : ''}
              contentClassName={activeSection === 'saved-presets' ? activeSectionContentClass : ''}
              onOpenChange={(open) => handleSectionChange('saved-presets', open)}
              open={activeSection === 'saved-presets'}
              title="Saved Presets"
            >
              {presets.slice(0, 5).map((preset) => (
                <button
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left"
                  key={preset.id}
                  onClick={() => {
                    setPresetName(preset.name);
                    setDraft(normalizeSocialPreset(preset));
                  }}
                  type="button"
                >
                  <p className="text-sm font-semibold text-fog">{preset.name}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.18em] text-white/48">
                    {preset.template} / {preset.outputPresetId}
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
                className="rounded-full border border-white/10 px-4 py-2 text-sm text-white/78"
                onClick={exportSvg}
                type="button"
              >
                Export SVG
              </button>
              <button
                className="rounded-full bg-fog px-4 py-2 text-sm font-semibold text-ink"
                onClick={() => void exportPng()}
                type="button"
              >
                Export PNG
              </button>
            </>
          }
          subtitle="Build short-form branded publishing cards in the same shared shell, with template-driven controls, named output presets, and chart-capable variants."
          title="Social Card Toolkit"
        />
      }
      preview={
        <PreviewSurface>
          <SurfaceCard className="flex min-h-0 flex-1 flex-col p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">Preview</p>
                <h2 className="mt-2 font-display text-2xl text-fog">{templateDefinition.label}</h2>
                <p className="mt-2 text-sm text-white/58">
                  {outputPreset?.label} · {preview.width}×{preview.height}
                </p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/54">
                {templateDefinition.summary}
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

type SocialSectionId = 'template-output' | 'copy' | 'chart' | 'saved-presets';

function Field({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputId = useId();

  return (
    <label className="block" htmlFor={inputId}>
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">{label}</div>
      <input
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
        id={inputId}
        name={inputId}
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
  const inputId = useId();

  return (
    <label className="block" htmlFor={inputId}>
      <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">{label}</div>
      <textarea
        className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-fog"
        id={inputId}
        name={inputId}
        onChange={(event) => onChange(event.target.value)}
        value={value}
      />
    </label>
  );
}
