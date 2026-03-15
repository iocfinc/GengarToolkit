import type { SuiteAspectRatio } from '@packages/config-schema/src/document';

export type ExportRequest = {
  toolkit: 'motion' | 'dataviz' | 'social-card';
  aspectRatio: SuiteAspectRatio | string;
  format: 'png' | 'svg' | 'webm';
  filename: string;
};

export type ExportCapability = {
  format: ExportRequest['format'];
  label: string;
  vectorSafe: boolean;
};

export const suiteExportCapabilities: Record<string, ExportCapability[]> = {
  motion: [
    { format: 'png', label: 'PNG', vectorSafe: false },
    { format: 'webm', label: 'WEBM', vectorSafe: false }
  ],
  dataviz: [
    { format: 'png', label: 'PNG', vectorSafe: false },
    { format: 'svg', label: 'SVG', vectorSafe: true }
  ],
  'social-card': [
    { format: 'png', label: 'PNG', vectorSafe: false },
    { format: 'svg', label: 'SVG', vectorSafe: true }
  ]
};
