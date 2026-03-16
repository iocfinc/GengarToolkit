import type {
  DatavizDataset,
  DatavizFieldMapping,
  DatavizTemplate
} from '@packages/config-schema/src/document';
import { inferNumericColumns } from './parser';
import { getChartTemplateDefinition } from './templates';

function hasNumericSelection(mapping: DatavizFieldMapping) {
  return Boolean(mapping.yColumn) || mapping.valueColumns.length > 0;
}

function isNumericColumn(dataset: DatavizDataset, column?: string) {
  if (!column) {
    return false;
  }

  return inferNumericColumns(dataset).includes(column);
}

export function getDatavizValidationMessages({
  dataset,
  mapping,
  template,
  highlightSeries
}: {
  dataset: DatavizDataset;
  mapping: DatavizFieldMapping;
  template: DatavizTemplate;
  highlightSeries?: string;
}) {
  const messages: string[] = [];
  const templateDefinition = getChartTemplateDefinition(template);

  if (dataset.rows.length === 0) {
    messages.push('Add data to unlock a valid chart preview.');
    return messages;
  }

  if (template !== 'big-number' && !mapping.xColumn) {
    messages.push('Choose a category or x-axis column.');
  }

  if (templateDefinition?.requiresMultipleSeries && mapping.valueColumns.length < 2) {
    messages.push('Choose at least two numeric series columns for this template.');
  }

  if (!hasNumericSelection(mapping)) {
    messages.push('Choose at least one numeric value column.');
  }

  if (template === 'scatter') {
    if (!isNumericColumn(dataset, mapping.xColumn)) {
      messages.push('Scatter charts require a numeric X column.');
    }

    if (!isNumericColumn(dataset, mapping.yColumn)) {
      messages.push('Scatter charts require a numeric Y column.');
    }
  }

  if (template === 'focused-line' && highlightSeries && !mapping.valueColumns.includes(highlightSeries)) {
    messages.push('Focused line highlight must match one of the selected series columns.');
  }

  return Array.from(new Set(messages));
}
