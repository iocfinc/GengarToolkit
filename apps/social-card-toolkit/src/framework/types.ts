'use client';

import type {
  DatavizTemplate,
  SocialCardTemplate,
  SuiteAspectRatio
} from '@packages/config-schema/src/document';

export type SocialBackgroundStyle = 'mesh' | 'spotlight' | 'wash';

export type SocialCardDraft = {
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
  backgroundStyle: SocialBackgroundStyle;
  chartTemplate: DatavizTemplate;
  chartInput: string;
  chartShowLegend: boolean;
};

export type SocialCardPreset = SocialCardDraft & {
  id: string;
  name: string;
  aspectRatio?: SuiteAspectRatio;
};

export type SocialCardPreview = {
  width: number;
  height: number;
  svg: string;
};

export type SocialCardTemplateDefinition = {
  id: SocialCardTemplate;
  label: string;
  summary: string;
  bodyLabel?: string;
  footerLabel?: string;
  ctaLabel?: string;
  quoteAttributionLabel?: string;
  chartEnabled?: boolean;
  render: (draft: SocialCardDraft) => SocialCardPreview;
};
