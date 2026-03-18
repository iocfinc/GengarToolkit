'use client';

import { useState } from 'react';
import { PaletteGrid } from '@packages/ui/src/PaletteGrid';
import { CollapsibleSection } from '@packages/ui/src/CollapsibleSection';
import { approvedPaletteDefinitions } from '@/lib/theme/colors';
import { AnchorGridField } from '@/components/controls/AnchorGridField';
import { ColorTokenPicker } from '@/components/controls/ColorTokenPicker';
import { SelectField } from '@/components/controls/SelectField';
import { SliderField } from '@/components/controls/SliderField';
import { ToggleField } from '@/components/controls/ToggleField';
import {
  anchorLabels,
  aspectRatioLabels,
  backgroundTypeLabels,
  layoutPresetLabels,
  motionBehaviorLabels,
  textureTypeLabels
} from '@/lib/types/controls';
import {
  anchorPositions,
  aspectRatios,
  backgroundTypes,
  exportFormats,
  layoutPresets,
  motionBehaviors,
  resolutionPresets,
  textureTypes
} from '@/lib/types/document';
import { useEditorStore } from '@/lib/store/editorStore';

type SectionId =
  | 'template'
  | 'brand-palette'
  | 'background'
  | 'motif'
  | 'texture'
  | 'typography'
  | 'motion'
  | 'export';

export function ControlPanel() {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const document = useEditorStore((state) => state.document);
  const setAspectRatio = useEditorStore((state) => state.setAspectRatio);
  const setLayoutPreset = useEditorStore((state) => state.setLayoutPreset);
  const updateBackground = useEditorStore((state) => state.updateBackground);
  const updateMotif = useEditorStore((state) => state.updateMotif);
  const updateTexture = useEditorStore((state) => state.updateTexture);
  const updateTypography = useEditorStore((state) => state.updateTypography);
  const updateMotion = useEditorStore((state) => state.updateMotion);
  const updateExport = useEditorStore((state) => state.updateExport);
  const applyApprovedPalette = useEditorStore((state) => state.applyApprovedPalette);
  const setDocumentName = useEditorStore((state) => state.setDocumentName);
  const selectedPalette =
    approvedPaletteDefinitions.find((palette) => palette.name === document.background.paletteName) ?? null;

  function handleSectionChange(sectionId: SectionId, open: boolean) {
    setActiveSection(open ? sectionId : null);
  }

  const activeSectionCardClass = 'flex min-h-0 flex-1 flex-col';
  const activeSectionContentClass = 'min-h-0 flex-1 overflow-y-auto scrollbar-thin';

  return (
    <aside
      className={`panel-surface flex h-full min-h-0 flex-col gap-3 rounded-[28px] p-3 ${
        activeSection ? 'overflow-hidden' : 'overflow-y-auto scrollbar-thin'
      }`}
      data-testid="motion-control-panel"
    >
      {(!activeSection || activeSection === 'template') ? (
      <CollapsibleSection
        className={activeSection === 'template' ? activeSectionCardClass : ''}
        contentClassName={activeSection === 'template' ? activeSectionContentClass : ''}
        onOpenChange={(open) => handleSectionChange('template', open)}
        open={activeSection === 'template'}
        title="Template"
      >
        <label className="block">
          <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Document Name</div>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
            onChange={(event) => setDocumentName(event.target.value)}
            value={document.name}
          />
        </label>
        <SelectField
          label="Aspect Ratio"
          onChange={setAspectRatio}
          options={aspectRatios.map((ratio) => ({
            value: ratio,
            label: aspectRatioLabels[ratio]
          }))}
          value={document.aspectRatio}
        />
        <SelectField
          label="Layout Preset"
          onChange={setLayoutPreset}
          options={layoutPresets.map((preset) => ({
            value: preset,
            label: layoutPresetLabels[preset]
          }))}
          value={document.layoutPreset}
        />
      </CollapsibleSection>
      ) : null}

      {(!activeSection || activeSection === 'brand-palette') ? (
      <CollapsibleSection
        className={activeSection === 'brand-palette' ? activeSectionCardClass : ''}
        contentClassName={activeSection === 'brand-palette' ? activeSectionContentClass : ''}
        onOpenChange={(open) => handleSectionChange('brand-palette', open)}
        open={activeSection === 'brand-palette'}
        title="Brand Palette"
      >
        <PaletteGrid
          onSelect={(palette) => applyApprovedPalette(palette)}
          selectedPaletteId={selectedPalette?.id ?? null}
        />
        <p className="text-sm text-white/58">
          Apply one of the image-inspired palette presets, then refine any field below with token or custom hex overrides.
        </p>
      </CollapsibleSection>
      ) : null}

      {(!activeSection || activeSection === 'background') ? (
      <CollapsibleSection
        className={activeSection === 'background' ? activeSectionCardClass : ''}
        contentClassName={activeSection === 'background' ? activeSectionContentClass : ''}
        onOpenChange={(open) => handleSectionChange('background', open)}
        open={activeSection === 'background'}
        title="Background"
      >
        <SelectField
          label="Background Type"
          onChange={(value) => updateBackground({ type: value })}
          options={backgroundTypes.map((type) => ({
            value: type,
            label: backgroundTypeLabels[type]
          }))}
          value={document.background.type}
        />
        <ColorTokenPicker
          label="Base Color"
          onChange={(value) => updateBackground({ baseColor: value })}
          value={document.background.baseColor}
        />
        <ColorTokenPicker
          label="Glow A"
          onChange={(value) => updateBackground({ glowColorA: value })}
          value={document.background.glowColorA}
        />
        <ColorTokenPicker
          label="Glow B"
          onChange={(value) => updateBackground({ glowColorB: value })}
          value={document.background.glowColorB}
        />
        <SliderField
          label="Glow Size"
          max={0.7}
          min={0.15}
          onChange={(value) => updateBackground({ glowSize: value })}
          value={document.background.glowSize}
        />
        <SliderField
          label="Glow A X"
          max={1}
          min={0}
          onChange={(value) =>
            updateBackground({
              glowPositionA: {
                ...document.background.glowPositionA,
                x: value
              }
            })
          }
          value={document.background.glowPositionA.x}
        />
        <SliderField
          label="Glow A Y"
          max={1}
          min={0}
          onChange={(value) =>
            updateBackground({
              glowPositionA: {
                ...document.background.glowPositionA,
                y: value
              }
            })
          }
          value={document.background.glowPositionA.y}
        />
        <SliderField
          label="Softness"
          max={1}
          min={0.2}
          onChange={(value) => updateBackground({ softness: value })}
          value={document.background.softness}
        />
        <SliderField
          label="Intensity"
          max={1}
          min={0.2}
          onChange={(value) => updateBackground({ intensity: value })}
          value={document.background.intensity}
        />
        <SliderField
          label="Vignette"
          max={0.8}
          min={0}
          onChange={(value) => updateBackground({ vignette: value })}
          value={document.background.vignette}
        />
      </CollapsibleSection>
      ) : null}

      {(!activeSection || activeSection === 'motif') ? (
      <CollapsibleSection
        className={activeSection === 'motif' ? activeSectionCardClass : ''}
        contentClassName={activeSection === 'motif' ? activeSectionContentClass : ''}
        onOpenChange={(open) => handleSectionChange('motif', open)}
        open={activeSection === 'motif'}
        title="Motif"
      >
        <ToggleField
          checked={document.motif.enabled}
          label="Enable Motif"
          onChange={(value) => updateMotif({ enabled: value })}
        />
        <SelectField
          label="Motif Type"
          onChange={(value) => updateMotif({ type: value })}
          options={[
            { value: 'orb', label: 'Orb' },
            { value: 'halo', label: 'Halo' },
            { value: 'light-bar', label: 'Light Bar' },
            { value: 'blob', label: 'Blob' },
            { value: 'ring', label: 'Ring' }
          ]}
          value={document.motif.type}
        />
        <ColorTokenPicker
          label="Motif Color"
          onChange={(value) => updateMotif({ color: value })}
          value={document.motif.color}
        />
        <SliderField
          label="Count"
          formatValue={(value) => Math.round(value).toString()}
          max={3}
          min={1}
          onChange={(value) => updateMotif({ count: Math.round(value) })}
          step={1}
          value={document.motif.count}
        />
        <SliderField
          label="Scale"
          max={0.4}
          min={0.1}
          onChange={(value) => updateMotif({ scale: value })}
          value={document.motif.scale}
        />
        <SliderField
          label="Opacity"
          max={0.8}
          min={0.05}
          onChange={(value) => updateMotif({ opacity: value })}
          value={document.motif.opacity}
        />
        <SliderField
          label="Blur"
          max={1}
          min={0}
          onChange={(value) => updateMotif({ blur: value })}
          value={document.motif.blur}
        />
      </CollapsibleSection>
      ) : null}

      {(!activeSection || activeSection === 'texture') ? (
      <CollapsibleSection
        className={activeSection === 'texture' ? activeSectionCardClass : ''}
        contentClassName={activeSection === 'texture' ? activeSectionContentClass : ''}
        onOpenChange={(open) => handleSectionChange('texture', open)}
        open={activeSection === 'texture'}
        title="Texture"
      >
        <ToggleField
          checked={document.texture.enabled}
          label="Enable Texture"
          onChange={(value) => updateTexture({ enabled: value })}
        />
        <SelectField
          label="Texture Mode"
          onChange={(value) => updateTexture({ type: value })}
          options={textureTypes.map((type) => ({
            value: type,
            label: textureTypeLabels[type]
          }))}
          value={document.texture.type}
        />
        <SliderField
          label="Opacity"
          max={0.28}
          min={0.02}
          onChange={(value) => updateTexture({ opacity: value })}
          value={document.texture.opacity}
        />
        <SliderField
          label="Scale"
          max={1}
          min={0.2}
          onChange={(value) => updateTexture({ scale: value })}
          value={document.texture.scale}
        />
        <SliderField
          label="Contrast"
          max={1}
          min={0.2}
          onChange={(value) => updateTexture({ contrast: value })}
          value={document.texture.contrast}
        />
        <ToggleField
          checked={document.texture.animated}
          label="Animated Jitter"
          onChange={(value) => updateTexture({ animated: value })}
        />
      </CollapsibleSection>
      ) : null}

      {(!activeSection || activeSection === 'typography') ? (
      <CollapsibleSection
        className={activeSection === 'typography' ? activeSectionCardClass : ''}
        contentClassName={activeSection === 'typography' ? activeSectionContentClass : ''}
        onOpenChange={(open) => handleSectionChange('typography', open)}
        open={activeSection === 'typography'}
        title="Typography"
      >
        <label className="block">
          <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Eyebrow</div>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
            onChange={(event) => updateTypography({ eyebrow: event.target.value })}
            value={document.typography.eyebrow}
          />
        </label>
        <label className="block">
          <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Headline</div>
          <textarea
            className="min-h-24 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
            onChange={(event) => updateTypography({ headline: event.target.value })}
            value={document.typography.headline}
          />
        </label>
        <label className="block">
          <div className="mb-2 text-xs uppercase tracking-[0.18em] text-white/48">Body</div>
          <textarea
            className="min-h-20 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-fog"
            onChange={(event) => updateTypography({ body: event.target.value })}
            value={document.typography.body}
          />
        </label>
        <SelectField
          label="Alignment"
          onChange={(value) => updateTypography({ alignment: value })}
          options={[
            { value: 'left', label: 'Left' },
            { value: 'center', label: 'Center' },
            { value: 'right', label: 'Right' }
          ]}
          value={document.typography.alignment}
        />
        <SelectField
          label="Anchor Label"
          onChange={(value) => updateTypography({ anchor: value })}
          options={anchorPositions.map((anchor) => ({
            value: anchor,
            label: anchorLabels[anchor]
          }))}
          value={document.typography.anchor}
        />
        <AnchorGridField
          onChange={(value) => updateTypography({ anchor: value })}
          value={document.typography.anchor}
        />
        <ColorTokenPicker
          label="Text Color"
          onChange={(value) => updateTypography({ textColor: value })}
          value={document.typography.textColor}
        />
        <SliderField
          label="Headline Size"
          max={120}
          min={44}
          onChange={(value) => updateTypography({ headlineSize: value })}
          step={1}
          value={document.typography.headlineSize}
        />
        <SliderField
          label="Body Size"
          max={28}
          min={14}
          onChange={(value) => updateTypography({ bodySize: value })}
          step={1}
          value={document.typography.bodySize}
        />
        <SliderField
          label="Max Width"
          max={0.8}
          min={0.2}
          onChange={(value) => updateTypography({ maxWidth: value })}
          value={document.typography.maxWidth}
        />
      </CollapsibleSection>
      ) : null}

      {(!activeSection || activeSection === 'motion') ? (
      <CollapsibleSection
        className={activeSection === 'motion' ? activeSectionCardClass : ''}
        contentClassName={activeSection === 'motion' ? activeSectionContentClass : ''}
        onOpenChange={(open) => handleSectionChange('motion', open)}
        open={activeSection === 'motion'}
        title="Motion"
      >
        <ToggleField
          checked={document.motion.enabled}
          label="Enable Motion"
          onChange={(value) => updateMotion({ enabled: value })}
        />
        <SelectField
          label="Behavior"
          onChange={(value) => updateMotion({ behavior: value })}
          options={motionBehaviors.map((behavior) => ({
            value: behavior,
            label: motionBehaviorLabels[behavior]
          }))}
          value={document.motion.behavior}
        />
        <SliderField
          label="Loop Duration"
          formatValue={(value) => `${value.toFixed(0)}s`}
          max={8}
          min={3}
          onChange={(value) => updateMotion({ loopDuration: Math.round(value) })}
          step={1}
          value={document.motion.loopDuration}
        />
        <SliderField
          label="Speed"
          max={1}
          min={0.1}
          onChange={(value) => updateMotion({ speed: value })}
          value={document.motion.speed}
        />
        <SliderField
          label="Amplitude"
          max={0.1}
          min={0.01}
          onChange={(value) => updateMotion({ amplitude: value })}
          value={document.motion.amplitude}
        />
      </CollapsibleSection>
      ) : null}

      {(!activeSection || activeSection === 'export') ? (
      <CollapsibleSection
        className={activeSection === 'export' ? activeSectionCardClass : ''}
        contentClassName={activeSection === 'export' ? activeSectionContentClass : ''}
        onOpenChange={(open) => handleSectionChange('export', open)}
        open={activeSection === 'export'}
        title="Export"
      >
        <SelectField
          label="Format"
          onChange={(value) => updateExport({ format: value })}
          options={exportFormats.map((format) => ({
            value: format,
            label: format.toUpperCase()
          }))}
          value={document.export.format}
        />
        <SelectField
          label="Resolution"
          onChange={(value) => updateExport({ resolution: value })}
          options={resolutionPresets.map((resolution) => ({
            value: resolution,
            label: resolution
          }))}
          value={document.export.resolution}
        />
        <SliderField
          label="FPS"
          formatValue={(value) => `${value.toFixed(0)} fps`}
          max={60}
          min={12}
          onChange={(value) => updateExport({ fps: Math.round(value) })}
          step={1}
          value={document.export.fps}
        />
      </CollapsibleSection>
      ) : null}
    </aside>
  );
}
