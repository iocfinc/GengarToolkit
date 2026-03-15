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
    summary: 'Structured chart workflows will launch here once the shared shell and toolkit contracts are in place.',
    status: 'planned',
    capabilities: [
      { id: 'dataviz-data', label: 'CSV / JSON' },
      { id: 'dataviz-chart', label: 'Chart Templates' }
    ]
  },
  {
    id: 'social-card-toolkit',
    label: 'Social Card Toolkit',
    summary: 'Constrained social publishing templates will plug into the same launcher once the toolkit bootstrap lands.',
    status: 'planned',
    capabilities: [
      { id: 'social-svg', label: 'SVG / PNG' },
      { id: 'social-templates', label: 'Template Cards' }
    ]
  }
];
