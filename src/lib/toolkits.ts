import type { ToolkitDefinition } from '@packages/studio-shell/src/types';

export const toolkitRegistry: ToolkitDefinition[] = [
  {
    id: 'motion-toolkit',
    label: 'Motion Toolkit',
    summary: 'Canvas-based branded still and motion scenes with presets, overlays, and in-browser export.',
    href: '/motion-toolkit/editor',
    status: 'live',
    capabilities: [
      { id: 'motion-png', label: 'PNG' },
      { id: 'motion-webm', label: 'WEBM' }
    ]
  },
  {
    id: 'dataviz-toolkit',
    label: 'Data Visualization Toolkit',
    summary: 'Structured chart workflows with guided mapping, shared presets, and branded SVG/PNG export.',
    href: '/dataviz-toolkit',
    status: 'live',
    capabilities: [
      { id: 'dataviz-data', label: 'CSV / JSON' },
      { id: 'dataviz-chart', label: 'Chart Templates' },
      { id: 'dataviz-export', label: 'SVG / PNG' }
    ]
  },
  {
    id: 'social-card-toolkit',
    label: 'Social Card Toolkit',
    summary: 'Template-driven social publishing cards with shared presets, shared shell behavior, and chart-capable variants.',
    href: '/social-card-toolkit',
    status: 'live',
    capabilities: [
      { id: 'social-svg', label: 'SVG / PNG' },
      { id: 'social-templates', label: 'Template Cards' }
    ]
  }
  ,
  {
    id: 'pattern-toolkit',
    label: 'Pattern Toolkit',
    summary: 'Quarter-circle “Cells → Modules” patterns with seeded randomness, edit mode, and 300 DPI export.',
    href: '/pattern-toolkit',
    status: 'live',
    capabilities: [
      { id: 'pattern-svg', label: 'SVG' },
      { id: 'pattern-png', label: 'PNG 300 DPI' },
      { id: 'pattern-jpg', label: 'JPG' }
    ]
  }
];
