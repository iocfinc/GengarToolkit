'use client';

import {
  inferNumericColumns,
  parseDatasetInput
} from '@packages/chart-core/src/parser';
import { renderChartSvg } from '@packages/chart-core/src/renderSvg';
import { getDatavizValidationMessages } from '@packages/chart-core/src/validation';
import type {
  DatavizFieldMapping,
  DatavizTemplate,
  SuiteAspectRatio
} from '@packages/config-schema/src/document';
import type { SocialCardDraft } from './types';

type ResolvedChartCard = {
  dataUri: string | null;
  messages: string[];
};

function toSvgDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function getSuiteAspectRatio(width: number, height: number): SuiteAspectRatio {
  if (width === height) {
    return '1:1';
  }

  return height > width ? '4:5' : '16:9';
}

function getDefaultChartMapping(columns: string[], numericColumns: string[]): DatavizFieldMapping {
  return {
    xColumn: columns[0],
    labelColumn: columns[0],
    yColumn: numericColumns[0] ?? columns[1] ?? columns[0],
    valueColumns: numericColumns.slice(0, 3)
  };
}

function isAllowedChartTemplate(template: DatavizTemplate) {
  return ['bar', 'line', 'big-number'].includes(template);
}

export function getChartCaptionValidationMessages(draft: SocialCardDraft) {
  if (draft.template !== 'chart-caption-card') {
    return [];
  }

  try {
    const dataset = parseDatasetInput(draft.chartInput, 'csv');
    const numericColumns = inferNumericColumns(dataset);
    const mapping = getDefaultChartMapping(dataset.columns, numericColumns);
    const messages = getDatavizValidationMessages({
      dataset,
      mapping,
      template: draft.chartTemplate,
      highlightSeries: undefined
    });

    if (!isAllowedChartTemplate(draft.chartTemplate)) {
      messages.unshift('Chart + Caption cards only support bar, line, and big-number chart templates.');
    }

    return messages;
  } catch (error) {
    return [error instanceof Error ? error.message : 'Unable to parse chart dataset.'];
  }
}

export function buildChartCaptionCard(
  draft: SocialCardDraft,
  width: number,
  height: number
): ResolvedChartCard {
  if (draft.template !== 'chart-caption-card') {
    return {
      dataUri: null,
      messages: []
    };
  }

  const messages = getChartCaptionValidationMessages(draft);

  if (messages.length > 0) {
    return {
      dataUri: null,
      messages
    };
  }

  try {
    const dataset = parseDatasetInput(draft.chartInput, 'csv');
    const numericColumns = inferNumericColumns(dataset);
    const mapping = getDefaultChartMapping(dataset.columns, numericColumns);
    const chartWidth = Math.round(width - 160);
    const chartHeight = Math.round(height * 0.52);
    const chart = renderChartSvg({
      dataset,
      mapping,
      template: draft.chartTemplate,
      aspectRatio: getSuiteAspectRatio(chartWidth, chartHeight),
      headline: draft.title,
      subheadline: draft.subtitle,
      source: draft.footer,
      themeId: draft.themeId,
      annotations: [],
      options: {
        showGrid: true,
        showLegend: draft.chartShowLegend,
        animate: false
      },
      size: {
        width: chartWidth,
        height: chartHeight
      }
    });

    return {
      dataUri: toSvgDataUri(chart.svg),
      messages: []
    };
  } catch (error) {
    return {
      dataUri: null,
      messages: [error instanceof Error ? error.message : 'Unable to render chart embed.']
    };
  }
}
