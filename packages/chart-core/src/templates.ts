import type { ChartTemplateDefinition } from './types';

export const chartTemplateDefinitions: ChartTemplateDefinition[] = [
  { id: 'bar', label: 'Bar', summary: 'Single-series vertical comparison' },
  { id: 'stacked-bar', label: 'Stacked Bar', summary: 'Share-of-total comparison', requiresMultipleSeries: true },
  { id: 'line', label: 'Line', summary: 'Single-series trend line' },
  { id: 'multi-line', label: 'Multi Line', summary: 'Several trend lines', requiresMultipleSeries: true },
  { id: 'focused-line', label: 'Focused Line', summary: 'Highlight one key series', requiresMultipleSeries: true },
  { id: 'big-number', label: 'Big Number', summary: 'Headline statistic' },
  { id: 'categorical-ranking', label: 'Ranking', summary: 'Ordered categorical list' },
  { id: 'scatter', label: 'Scatter', summary: 'Two-value relationship' },
  { id: 'pie-donut', label: 'Pie / Donut', summary: 'Composition snapshot' }
];

export function getChartTemplateDefinition(id: ChartTemplateDefinition['id']) {
  return chartTemplateDefinitions.find((entry) => entry.id === id);
}
