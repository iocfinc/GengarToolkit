import type {
  DatavizDataset,
  DatavizFieldMapping,
  DatavizTemplate,
  SuiteAspectRatio
} from '@packages/config-schema/src/document';

export type ChartTemplateDefinition = {
  id: DatavizTemplate;
  label: string;
  summary: string;
  requiresMultipleSeries?: boolean;
};

export type ChartRenderContext = {
  dataset: DatavizDataset;
  mapping: DatavizFieldMapping;
  aspectRatio: SuiteAspectRatio;
  headline: string;
  subheadline: string;
  source: string;
  themeId: string;
};
