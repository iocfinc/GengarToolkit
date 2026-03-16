import { z } from 'zod';

export const aspectRatios = [
  '16:9',
  '4:5',
  '1:1',
  '9:16',
  'a4-portrait',
  'a4-landscape'
] as const;

export const layoutPresets = [
  'hero-title-left',
  'centered-poster',
  'lower-third-caption',
  'editorial-top-left',
  'background-only'
] as const;

export const backgroundTypes = [
  'radial-glow',
  'linear-wash',
  'dual-orb',
  'mesh-field'
] as const;

export const motifTypes = [
  'orb',
  'halo',
  'light-bar',
  'blob',
  'ring'
] as const;

export const textureTypes = [
  'film-grain',
  'mono-noise',
  'scanline',
  'paper-grain'
] as const;

export const motionBehaviors = [
  'drift',
  'pulse',
  'float',
  'pan',
  'breathe'
] as const;

export const textAlignments = ['left', 'center', 'right'] as const;

export const anchorPositions = [
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right'
] as const;

export const paddingPresets = ['sm', 'md', 'lg'] as const;

export const exportFormats = ['png', 'webm'] as const;
export const resolutionPresets = ['preview', 'hd', 'full-hd', 'square'] as const;
export const suiteAspectRatios = ['1:1', '4:5', '16:9'] as const;
export const toolkitKinds = ['motion', 'dataviz', 'social-card'] as const;
export const datavizTemplates = [
  'bar',
  'stacked-bar',
  'line',
  'multi-line',
  'focused-line',
  'big-number',
  'categorical-ranking',
  'scatter',
  'pie-donut'
] as const;
export const socialCardTemplates = [
  'quote-card',
  'stat-card',
  'announcement-card',
  'explainer-card',
  'chart-caption-card'
] as const;

const pointSchema = z.object({
  x: z.number(),
  y: z.number()
});

export const backgroundConfigSchema = z.object({
  type: z.enum(backgroundTypes),
  paletteName: z.string(),
  baseColor: z.string(),
  glowColorA: z.string(),
  glowColorB: z.string(),
  glowSize: z.number(),
  glowPositionA: pointSchema,
  glowPositionB: pointSchema,
  softness: z.number(),
  intensity: z.number(),
  vignette: z.number()
});

export const motifConfigSchema = z.object({
  enabled: z.boolean(),
  type: z.enum(motifTypes),
  count: z.number(),
  scale: z.number(),
  opacity: z.number(),
  blur: z.number(),
  position: pointSchema,
  rotation: z.number(),
  color: z.string()
});

export const textureConfigSchema = z.object({
  enabled: z.boolean(),
  type: z.enum(textureTypes),
  opacity: z.number(),
  scale: z.number(),
  contrast: z.number(),
  animated: z.boolean()
});

export const typographyConfigSchema = z.object({
  eyebrow: z.string(),
  headline: z.string(),
  body: z.string(),
  fontFamily: z.enum(['display', 'body']),
  headlineSize: z.number(),
  bodySize: z.number(),
  weight: z.number(),
  lineHeight: z.number(),
  tracking: z.number(),
  alignment: z.enum(textAlignments),
  maxWidth: z.number(),
  textColor: z.string(),
  anchor: z.enum(anchorPositions),
  paddingPreset: z.enum(paddingPresets)
});

export const motionConfigSchema = z.object({
  enabled: z.boolean(),
  behavior: z.enum(motionBehaviors),
  playing: z.boolean(),
  speed: z.number(),
  amplitude: z.number(),
  loopDuration: z.number(),
  easingProfile: z.enum(['linear', 'ease-in-out']),
  independentLayerMotion: z.boolean()
});

export const exportConfigSchema = z.object({
  format: z.enum(exportFormats),
  resolution: z.enum(resolutionPresets),
  fps: z.number(),
  duration: z.number(),
  scale: z.number(),
  filename: z.string()
});

export const brandDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  aspectRatio: z.enum(aspectRatios),
  layoutPreset: z.enum(layoutPresets),
  background: backgroundConfigSchema,
  motif: motifConfigSchema,
  texture: textureConfigSchema,
  typography: typographyConfigSchema,
  motion: motionConfigSchema,
  export: exportConfigSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

export const savedPresetSchema = z.object({
  id: z.string(),
  name: z.string(),
  document: brandDocumentSchema,
  createdAt: z.string(),
  updatedAt: z.string()
});

export const presetMetaSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export const datavizFieldMappingSchema = z.object({
  labelColumn: z.string().optional(),
  xColumn: z.string().optional(),
  yColumn: z.string().optional(),
  valueColumns: z.array(z.string()).default([]),
  highlightColumn: z.string().optional()
});

export const datavizContentSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  annotations: z.array(z.string()).default([]),
  source: z.string()
});

export const datavizDatasetSchema = z.object({
  columns: z.array(z.string()),
  rows: z.array(z.record(z.string(), z.string()))
});

export const datavizOptionsSchema = z.object({
  showGrid: z.boolean().default(true),
  showLegend: z.boolean().default(true),
  animate: z.boolean().default(false),
  highlightSeries: z.string().optional()
});

export const datavizToolkitDocumentSchema = z.object({
  toolkit: z.literal('dataviz'),
  template: z.enum(datavizTemplates),
  theme: z.string(),
  aspectRatio: z.enum(suiteAspectRatios),
  export: z.object({
    format: z.enum(['png', 'svg']),
    filename: z.string()
  }),
  presetMeta: presetMetaSchema,
  content: datavizContentSchema,
  data: datavizDatasetSchema,
  mapping: datavizFieldMappingSchema,
  options: datavizOptionsSchema
});

export const socialCardContentSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  body: z.string(),
  footer: z.string(),
  cta: z.string(),
  quoteAttribution: z.string()
});

export const socialCardOptionsSchema = z.object({
  mascotVariant: z.enum(['none', 'orb', 'spark']).default('none'),
  backgroundStyle: z.enum(['mesh', 'spotlight', 'wash']).default('mesh'),
  accentColor: z.string().default('royal'),
  includeMiniChart: z.boolean().default(false)
});

export const socialCardToolkitDocumentSchema = z.object({
  toolkit: z.literal('social-card'),
  template: z.enum(socialCardTemplates),
  theme: z.string(),
  aspectRatio: z.enum(suiteAspectRatios),
  export: z.object({
    format: z.enum(['png', 'svg']),
    filename: z.string()
  }),
  presetMeta: presetMetaSchema,
  content: socialCardContentSchema,
  options: socialCardOptionsSchema
});

export const motionToolkitDocumentSchema = z.object({
  toolkit: z.literal('motion'),
  template: z.string(),
  theme: z.string(),
  aspectRatio: z.enum(aspectRatios),
  export: exportConfigSchema,
  presetMeta: presetMetaSchema,
  scene: brandDocumentSchema
});

export const toolkitDocumentSchema = z.discriminatedUnion('toolkit', [
  motionToolkitDocumentSchema,
  datavizToolkitDocumentSchema,
  socialCardToolkitDocumentSchema
]);

export type AspectRatio = (typeof aspectRatios)[number];
export type LayoutPreset = (typeof layoutPresets)[number];
export type BackgroundType = (typeof backgroundTypes)[number];
export type MotifType = (typeof motifTypes)[number];
export type TextureType = (typeof textureTypes)[number];
export type MotionBehavior = (typeof motionBehaviors)[number];
export type TextAlignment = (typeof textAlignments)[number];
export type AnchorPosition = (typeof anchorPositions)[number];
export type PaddingPreset = (typeof paddingPresets)[number];
export type ExportFormat = (typeof exportFormats)[number];
export type ResolutionPreset = (typeof resolutionPresets)[number];
export type SuiteAspectRatio = (typeof suiteAspectRatios)[number];
export type ToolkitKind = (typeof toolkitKinds)[number];
export type DatavizTemplate = (typeof datavizTemplates)[number];
export type SocialCardTemplate = (typeof socialCardTemplates)[number];

export type Point = z.infer<typeof pointSchema>;
export type BackgroundConfig = z.infer<typeof backgroundConfigSchema>;
export type MotifConfig = z.infer<typeof motifConfigSchema>;
export type TextureConfig = z.infer<typeof textureConfigSchema>;
export type TypographyConfig = z.infer<typeof typographyConfigSchema>;
export type MotionConfig = z.infer<typeof motionConfigSchema>;
export type ExportConfig = z.infer<typeof exportConfigSchema>;
export type BrandDocument = z.infer<typeof brandDocumentSchema>;
export type SavedPreset = z.infer<typeof savedPresetSchema>;
export type PresetMeta = z.infer<typeof presetMetaSchema>;
export type DatavizFieldMapping = z.infer<typeof datavizFieldMappingSchema>;
export type DatavizContent = z.infer<typeof datavizContentSchema>;
export type DatavizDataset = z.infer<typeof datavizDatasetSchema>;
export type DatavizOptions = z.infer<typeof datavizOptionsSchema>;
export type DatavizToolkitDocument = z.infer<typeof datavizToolkitDocumentSchema>;
export type SocialCardContent = z.infer<typeof socialCardContentSchema>;
export type SocialCardOptions = z.infer<typeof socialCardOptionsSchema>;
export type SocialCardToolkitDocument = z.infer<typeof socialCardToolkitDocumentSchema>;
export type MotionToolkitDocument = z.infer<typeof motionToolkitDocumentSchema>;
export type ToolkitDocument = z.infer<typeof toolkitDocumentSchema>;
