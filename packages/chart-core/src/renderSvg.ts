import { brandThemes, resolveColor } from '@packages/design-tokens/src/colors';
import type {
  DatavizDataset,
  DatavizFieldMapping,
  DatavizOptions,
  DatavizTemplate,
  SuiteAspectRatio
} from '@packages/config-schema/src/document';

const aspectSizes: Record<SuiteAspectRatio, { width: number; height: number }> = {
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
  '16:9': { width: 1600, height: 900 }
};

type TextBlock = {
  fontSize: number;
  lineHeight: number;
  lines: string[];
  height: number;
};

type LegendLayout = {
  items: Array<{ label: string; x: number; y: number; color: string }>;
  height: number;
};

function escapeMarkup(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function getTheme(themeId: string) {
  return brandThemes.find((theme) => theme.id === themeId) ?? brandThemes[0];
}

function estimateTextWidth(text: string, fontSize: number, widthFactor = 0.56) {
  return text.length * fontSize * widthFactor;
}

function wrapText(text: string, maxWidth: number, fontSize: number) {
  const words = text.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return [];
  }

  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (!current || estimateTextWidth(candidate, fontSize) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function fitTextBlock({
  text,
  maxWidth,
  initialFontSize,
  minFontSize,
  lineHeight,
  maxHeight
}: {
  text: string;
  maxWidth: number;
  initialFontSize: number;
  minFontSize: number;
  lineHeight: number;
  maxHeight: number;
}) {
  if (!text.trim()) {
    return {
      fontSize: initialFontSize,
      lineHeight,
      lines: [],
      height: 0
    } satisfies TextBlock;
  }

  for (let fontSize = initialFontSize; fontSize >= minFontSize; fontSize -= 2) {
    const lines = wrapText(text, maxWidth, fontSize);
    const height = lines.length * fontSize * lineHeight;

    if (height <= maxHeight) {
      return {
        fontSize,
        lineHeight,
        lines,
        height
      } satisfies TextBlock;
    }
  }

  const lines = wrapText(text, maxWidth, minFontSize);

  return {
    fontSize: minFontSize,
    lineHeight,
    lines,
    height: lines.length * minFontSize * lineHeight
  } satisfies TextBlock;
}

function renderTextBlock({
  x,
  y,
  block,
  fill,
  opacity = 1,
  family,
  weight = 400,
  anchor = 'start',
  dataSlot
}: {
  x: number;
  y: number;
  block: TextBlock;
  fill: string;
  opacity?: number;
  family: string;
  weight?: number;
  anchor?: 'start' | 'middle' | 'end';
  dataSlot?: string;
}) {
  if (block.lines.length === 0) {
    return '';
  }

  const attributes = dataSlot ? ` data-slot="${dataSlot}"` : '';

  return `
    <text${attributes} x="${x}" y="${y}" fill="${fill}" opacity="${opacity}" font-size="${block.fontSize}" font-family="${family}" font-weight="${weight}" text-anchor="${anchor}">
      ${block.lines
        .map((line, index) => `<tspan x="${x}" y="${y + index * block.fontSize * block.lineHeight}">${escapeMarkup(line)}</tspan>`)
        .join('')}
    </text>
  `;
}

function getNumbers(dataset: DatavizDataset, mapping: DatavizFieldMapping) {
  const values = dataset.rows.map((row) => Number(row[mapping.yColumn ?? mapping.valueColumns[0] ?? ''] ?? 0));
  return values.map((value) => (Number.isFinite(value) ? value : 0));
}

function buildBarSeries(dataset: DatavizDataset, mapping: DatavizFieldMapping) {
  return dataset.rows.map((row) => ({
    label: row[mapping.xColumn ?? mapping.labelColumn ?? dataset.columns[0] ?? ''] ?? '',
    value: Number(row[mapping.yColumn ?? mapping.valueColumns[0] ?? dataset.columns[1] ?? ''] ?? 0)
  }));
}

function buildStackedSeries(dataset: DatavizDataset, mapping: DatavizFieldMapping) {
  const valueColumns = mapping.valueColumns.length > 0 ? mapping.valueColumns : dataset.columns.slice(1);
  return dataset.rows.map((row) => ({
    label: row[mapping.xColumn ?? mapping.labelColumn ?? dataset.columns[0] ?? ''] ?? '',
    values: valueColumns.map((column) => ({
      key: column,
      value: Number(row[column] ?? 0)
    }))
  }));
}

function linePoints(values: number[], chartX: number, chartY: number, chartWidth: number, chartHeight: number) {
  const maxValue = Math.max(1, ...values);
  return values
    .map((value, index) => {
      const x = chartX + (chartWidth / Math.max(1, values.length - 1)) * index;
      const y = chartY + chartHeight - (value / maxValue) * chartHeight;
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(' ');
}

function pieSlices(values: Array<{ label: string; value: number }>, cx: number, cy: number, radius: number, innerRadius = 0) {
  const total = values.reduce((sum, item) => sum + item.value, 0) || 1;
  let angle = -Math.PI / 2;
  return values.map((item) => {
    const nextAngle = angle + (item.value / total) * Math.PI * 2;
    const largeArc = nextAngle - angle > Math.PI ? 1 : 0;
    const x1 = cx + Math.cos(angle) * radius;
    const y1 = cy + Math.sin(angle) * radius;
    const x2 = cx + Math.cos(nextAngle) * radius;
    const y2 = cy + Math.sin(nextAngle) * radius;
    let path = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;

    if (innerRadius > 0) {
      const ix1 = cx + Math.cos(nextAngle) * innerRadius;
      const iy1 = cy + Math.sin(nextAngle) * innerRadius;
      const ix2 = cx + Math.cos(angle) * innerRadius;
      const iy2 = cy + Math.sin(angle) * innerRadius;
      path = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2} Z`;
    }

    angle = nextAngle;
    return path;
  });
}

function getLegendLabels(
  dataset: DatavizDataset,
  mapping: DatavizFieldMapping,
  template: DatavizTemplate
) {
  if (template === 'pie-donut') {
    return buildBarSeries(dataset, mapping).map((item) => item.label);
  }

  if (template === 'stacked-bar' || template === 'multi-line' || template === 'focused-line') {
    return mapping.valueColumns.length > 0 ? mapping.valueColumns : dataset.columns.slice(1, 4);
  }

  if (template === 'line' || template === 'bar' || template === 'big-number' || template === 'categorical-ranking') {
    return [mapping.yColumn ?? mapping.valueColumns[0] ?? 'Value'].filter(Boolean);
  }

  if (template === 'scatter') {
    return [mapping.yColumn ?? 'Value'].filter(Boolean);
  }

  return [mapping.yColumn ?? mapping.valueColumns[0] ?? 'Value'].filter(Boolean);
}

function layoutLegend(
  labels: string[],
  colors: string[],
  maxWidth: number,
  startX: number,
  startY: number
): LegendLayout {
  let cursorX = startX;
  let cursorY = startY;
  const rowHeight = 28;
  const itemGap = 20;
  const items: LegendLayout['items'] = [];

  for (const [index, label] of labels.entries()) {
    const itemWidth = 26 + estimateTextWidth(label, 18, 0.54);

    if (cursorX !== startX && cursorX + itemWidth > startX + maxWidth) {
      cursorX = startX;
      cursorY += rowHeight;
    }

    items.push({
      label,
      x: cursorX,
      y: cursorY,
      color: colors[index % colors.length]
    });

    cursorX += itemWidth + itemGap;
  }

  return {
    items,
    height: items.length > 0 ? cursorY - startY + rowHeight : 0
  };
}

function niceStep(maxValue: number, tickCount = 4) {
  const roughStep = Math.max(maxValue, 1) / tickCount;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const residual = roughStep / magnitude;

  if (residual >= 5) {
    return 5 * magnitude;
  }

  if (residual >= 2) {
    return 2 * magnitude;
  }

  return magnitude;
}

function getNumericTicks(maxValue: number, tickCount = 4) {
  const step = niceStep(maxValue, tickCount);
  const end = Math.ceil(Math.max(maxValue, step) / step) * step;
  const ticks: number[] = [];

  for (let value = 0; value <= end + step / 2; value += step) {
    ticks.push(Number(value.toFixed(2)));
  }

  return ticks;
}

function formatTick(value: number) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

function renderCartesianAxes({
  chartX,
  chartY,
  chartWidth,
  chartHeight,
  xTickLabels,
  xTickPositions,
  yMaxValue,
  baseText,
  showGrid
}: {
  chartX: number;
  chartY: number;
  chartWidth: number;
  chartHeight: number;
  xTickLabels: string[];
  xTickPositions: number[];
  yMaxValue: number;
  baseText: string;
  showGrid: boolean;
}) {
  const yTicks = getNumericTicks(yMaxValue);
  const yAxisMarkup = yTicks
    .map((value) => {
      const y = chartY + chartHeight - (value / yTicks[yTicks.length - 1]) * chartHeight;
      return `
        ${showGrid ? `<line data-axis-grid="y" x1="${chartX}" y1="${y}" x2="${chartX + chartWidth}" y2="${y}" stroke="${baseText}" opacity="0.1" />` : ''}
        <line data-axis="y-tick" x1="${chartX - 8}" y1="${y}" x2="${chartX}" y2="${y}" stroke="${baseText}" opacity="0.5" />
        <text data-axis-label="y" x="${chartX - 16}" y="${y + 5}" fill="${baseText}" opacity="0.62" font-size="18" text-anchor="end" font-family="Avenir Next, Segoe UI, sans-serif">${formatTick(value)}</text>
      `;
    })
    .join('');

  const xAxisMarkup = xTickLabels
    .map((label, index) => {
      const x = xTickPositions[index];
      return `
        <line data-axis="x-tick" x1="${x}" y1="${chartY + chartHeight}" x2="${x}" y2="${chartY + chartHeight + 8}" stroke="${baseText}" opacity="0.5" />
        <text data-axis-label="x" x="${x}" y="${chartY + chartHeight + 30}" fill="${baseText}" opacity="0.72" font-size="18" text-anchor="middle" font-family="Avenir Next, Segoe UI, sans-serif">${escapeMarkup(label)}</text>
      `;
    })
    .join('');

  return `
    <g data-axis-group="cartesian">
      <line data-axis="y" x1="${chartX}" y1="${chartY}" x2="${chartX}" y2="${chartY + chartHeight}" stroke="${baseText}" opacity="0.34" />
      <line data-axis="x" x1="${chartX}" y1="${chartY + chartHeight}" x2="${chartX + chartWidth}" y2="${chartY + chartHeight}" stroke="${baseText}" opacity="0.34" />
      ${yAxisMarkup}
      ${xAxisMarkup}
    </g>
  `;
}

function renderNumericXAxis({
  chartX,
  chartY,
  chartWidth,
  chartHeight,
  maxValue,
  baseText
}: {
  chartX: number;
  chartY: number;
  chartWidth: number;
  chartHeight: number;
  maxValue: number;
  baseText: string;
}) {
  const ticks = getNumericTicks(maxValue);
  const maxTick = ticks[ticks.length - 1] || 1;

  return ticks
    .map((value) => {
      const x = chartX + (value / maxTick) * chartWidth;
      return `
        <line data-axis="x-tick" x1="${x}" y1="${chartY + chartHeight}" x2="${x}" y2="${chartY + chartHeight + 8}" stroke="${baseText}" opacity="0.5" />
        <text data-axis-label="x" x="${x}" y="${chartY + chartHeight + 30}" fill="${baseText}" opacity="0.72" font-size="18" text-anchor="middle" font-family="Avenir Next, Segoe UI, sans-serif">${formatTick(value)}</text>
      `;
    })
    .join('');
}

export function renderChartSvg({
  dataset,
  mapping,
  template,
  aspectRatio,
  headline,
  subheadline,
  source,
  themeId,
  annotations = [],
  options,
  size
}: {
  dataset: DatavizDataset;
  mapping: DatavizFieldMapping;
  template: DatavizTemplate;
  aspectRatio: SuiteAspectRatio;
  headline: string;
  subheadline: string;
  source: string;
  themeId: string;
  annotations?: string[];
  options?: Partial<DatavizOptions>;
  size?: { width: number; height: number };
}) {
  const theme = getTheme(themeId);
  const { width, height } = size ?? aspectSizes[aspectRatio];
  const resolvedOptions: DatavizOptions = {
    showGrid: true,
    showLegend: true,
    animate: false,
    highlightSeries: undefined,
    useCustomPalette: false,
    customPalette: [],
    ...options
  };
  const paletteSource =
    resolvedOptions.useCustomPalette && resolvedOptions.customPalette.length > 0
      ? resolvedOptions.customPalette
      : theme.chartPalette;
  const palette = paletteSource.map((token) => resolveColor(token));
  const baseText = resolveColor(theme.canvas.foreground);
  const accent = resolveColor(theme.canvas.accent);
  const background = resolveColor(theme.canvas.background);
  const pad = 80;
  const annotationColumnWidth = annotations.length > 0 ? Math.min(240, width * 0.24) : 0;

  let headlineSize = 48;
  let subheadlineSize = 24;
  let headlineBlock: TextBlock = fitTextBlock({
    text: headline || 'Untitled chart',
    maxWidth: width - pad * 2,
    initialFontSize: headlineSize,
    minFontSize: 36,
    lineHeight: 1.06,
    maxHeight: 120
  });
  let subheadlineBlock: TextBlock = fitTextBlock({
    text: subheadline,
    maxWidth: width - pad * 2,
    initialFontSize: subheadlineSize,
    minFontSize: 18,
    lineHeight: 1.26,
    maxHeight: 92
  });
  const annotationBlocks = annotations.slice(0, 3).map((annotation) =>
    fitTextBlock({
      text: annotation,
      maxWidth: annotationColumnWidth,
      initialFontSize: 16,
      minFontSize: 14,
      lineHeight: 1.2,
      maxHeight: 42
    })
  );
  const legendLabels = getLegendLabels(dataset, mapping, template);
  let legendLayout: LegendLayout = { items: [], height: 0 };
  let chartY = 0;

  for (let iteration = 0; iteration < 8; iteration += 1) {
    const headlineWidth = width - pad * 2 - (annotationColumnWidth > 0 ? annotationColumnWidth + 24 : 0);

    headlineBlock = fitTextBlock({
      text: headline || 'Untitled chart',
      maxWidth: headlineWidth,
      initialFontSize: headlineSize,
      minFontSize: 36,
      lineHeight: 1.06,
      maxHeight: 120
    });
    subheadlineBlock = fitTextBlock({
      text: subheadline,
      maxWidth: width - pad * 2,
      initialFontSize: subheadlineSize,
      minFontSize: 18,
      lineHeight: 1.26,
      maxHeight: 96
    });

    const headlineBottom = 170 + headlineBlock.height;
    const subheadlineTop = headlineBottom + (subheadlineBlock.lines.length > 0 ? 18 : 0);
    const subheadlineBottom = subheadlineTop + subheadlineBlock.height;
    const legendTop = subheadlineBottom + (legendLabels.length > 0 ? 22 : 0);

    legendLayout = resolvedOptions.showLegend
      ? layoutLegend(legendLabels, palette, width - pad * 2, pad, legendTop)
      : { items: [], height: 0 };
    chartY = legendTop + legendLayout.height + 28;

    if (chartY <= height * 0.42 || (headlineSize <= 36 && subheadlineSize <= 18)) {
      break;
    }

    if (subheadlineSize > 18) {
      subheadlineSize -= 2;
    } else if (headlineSize > 36) {
      headlineSize -= 2;
    }
  }

  const chartX = pad;
  const chartWidth = width - pad * 2;
  const chartHeight = Math.max(220, height - chartY - 120);
  const headerClipHeight = chartY - 22;
  const annotationMarkup = annotationBlocks
    .map((block, index) =>
      renderTextBlock({
        x: width - pad - annotationColumnWidth,
        y: 118 + index * 34,
        block,
        fill: baseText,
        opacity: 0.68,
        family: 'Avenir Next, Segoe UI, sans-serif',
        weight: 500,
        dataSlot: 'annotation'
      })
    )
    .join('');
  const headerMarkup = `
    <g data-slot="header" clip-path="url(#header-clip)">
      <text x="${pad}" y="110" fill="${baseText}" opacity="0.62" font-size="18" font-family="Avenir Next, Segoe UI, sans-serif">Data Visualization Toolkit</text>
      ${annotationMarkup}
      ${renderTextBlock({
        x: pad,
        y: 170,
        block: headlineBlock,
        fill: baseText,
        family: 'Iowan Old Style, Times New Roman, serif',
        weight: 700,
        dataSlot: 'headline'
      })}
      ${renderTextBlock({
        x: pad,
        y: 170 + headlineBlock.height + (subheadlineBlock.lines.length > 0 ? 18 : 0),
        block: subheadlineBlock,
        fill: baseText,
        opacity: 0.72,
        family: 'Avenir Next, Segoe UI, sans-serif',
        weight: 500,
        dataSlot: 'subheadline'
      })}
    </g>
  `;
  const legendMarkup =
    resolvedOptions.showLegend && legendLayout.items.length > 0
      ? `
        <g data-slot="legend">
          ${legendLayout.items
            .map(
              (item) => `
                <circle cx="${item.x + 8}" cy="${item.y}" r="8" fill="${item.color}" />
                <text x="${item.x + 24}" y="${item.y + 6}" fill="${baseText}" opacity="0.72" font-size="18" font-family="Avenir Next, Segoe UI, sans-serif">${escapeMarkup(item.label)}</text>
              `
            )
            .join('')}
        </g>
      `
      : '';

  let chartMarkup = '';
  let axisMarkup = '';

  if (template === 'big-number') {
    const firstValue = getNumbers(dataset, mapping)[0] ?? 0;
    const valueLabel = mapping.yColumn ?? mapping.valueColumns[0] ?? 'Value';
    const bigNumber = firstValue.toLocaleString();
    const estimatedWidth = Math.max(estimateTextWidth(bigNumber, 260, 0.62), 1);
    const scaledFontSize = Math.min(260, (chartWidth * 0.72 * 260) / estimatedWidth, chartHeight * 0.42);
    const bigNumberSize = Math.max(180, Math.round(scaledFontSize));
    const centerX = chartX + chartWidth / 2;
    const valueY = chartY + chartHeight * 0.54;

    chartMarkup = `
      <g data-template="big-number">
        <text data-role="big-number-value" x="${centerX}" y="${valueY}" fill="${accent}" font-size="${bigNumberSize}" font-family="Avenir Next, Segoe UI, sans-serif" font-weight="700" text-anchor="middle">${bigNumber}</text>
        <text x="${centerX}" y="${valueY + bigNumberSize * 0.3}" fill="${baseText}" opacity="0.72" font-size="30" font-family="Avenir Next, Segoe UI, sans-serif" text-anchor="middle">${escapeMarkup(valueLabel)}</text>
      </g>
    `;
  } else if (template === 'line' || template === 'multi-line' || template === 'focused-line') {
    const valueColumns =
      template === 'line'
        ? [mapping.yColumn ?? mapping.valueColumns[0] ?? dataset.columns[1] ?? '']
        : mapping.valueColumns.length > 0
          ? mapping.valueColumns
          : dataset.columns.slice(1, 4);
    const highlightSeries = resolvedOptions.highlightSeries ?? valueColumns[0];
    const xLabels = dataset.rows.map(
      (row) => row[mapping.xColumn ?? mapping.labelColumn ?? dataset.columns[0] ?? ''] ?? ''
    );
    const xPositions = xLabels.map((_, index) =>
      chartX + (chartWidth / Math.max(1, xLabels.length - 1)) * index
    );
    const allValues = valueColumns.flatMap((column) =>
      dataset.rows.map((row) => Number(row[column] ?? 0))
    );
    const maxValue = Math.max(1, ...allValues);

    axisMarkup = renderCartesianAxes({
      chartX,
      chartY,
      chartWidth,
      chartHeight,
      xTickLabels: xLabels,
      xTickPositions: xPositions,
      yMaxValue: maxValue,
      baseText,
      showGrid: resolvedOptions.showGrid
    });

    chartMarkup += `<g data-template="line-family">`;
    valueColumns.forEach((column, index) => {
      const values = dataset.rows.map((row) => Number(row[column] ?? 0));
      const highlight = template !== 'focused-line' || column === highlightSeries;
      chartMarkup += `
        <path data-role="plot-line" d="${linePoints(values, chartX, chartY, chartWidth, chartHeight)}" fill="none" stroke="${palette[index % palette.length]}" stroke-width="${highlight ? 5 : 3}" opacity="${highlight ? 1 : 0.34}" />
      `;
    });
    chartMarkup += `</g>`;
  } else if (template === 'scatter') {
    const xValues = dataset.rows.map((row) => Number(row[mapping.xColumn ?? dataset.columns[0] ?? ''] ?? 0));
    const yValues = dataset.rows.map((row) => Number(row[mapping.yColumn ?? dataset.columns[1] ?? ''] ?? 0));
    const maxX = Math.max(1, ...xValues);
    const maxY = Math.max(1, ...yValues);
    const xTicks = getNumericTicks(maxX);
    const xPositions = xTicks.map((value) => chartX + (value / xTicks[xTicks.length - 1]) * chartWidth);

    axisMarkup = renderCartesianAxes({
      chartX,
      chartY,
      chartWidth,
      chartHeight,
      xTickLabels: xTicks.map(formatTick),
      xTickPositions: xPositions,
      yMaxValue: maxY,
      baseText,
      showGrid: resolvedOptions.showGrid
    });

    chartMarkup += dataset.rows
      .map((row, index) => {
        const x = chartX + (xValues[index] / maxX) * chartWidth;
        const y = chartY + chartHeight - (yValues[index] / maxY) * chartHeight;
        return `<circle data-role="plot-point" cx="${x}" cy="${y}" r="10" fill="${palette[index % palette.length]}" opacity="0.88" />`;
      })
      .join('');
  } else if (template === 'pie-donut') {
    const series = buildBarSeries(dataset, mapping);
    const paths = pieSlices(
      series,
      chartX + chartWidth / 2,
      chartY + chartHeight / 2,
      Math.min(chartWidth, chartHeight) / 2.3,
      120
    );
    chartMarkup = paths
      .map((path, index) => `<path data-role="plot-slice" d="${path}" fill="${palette[index % palette.length]}" opacity="0.94" />`)
      .join('');
  } else if (template === 'stacked-bar') {
    const rows = buildStackedSeries(dataset, mapping);
    const maxTotal = Math.max(1, ...rows.map((row) => row.values.reduce((sum, item) => sum + item.value, 0)));
    const slotWidth = chartWidth / Math.max(1, rows.length);
    const barWidth = Math.max(24, slotWidth - 28);
    const xLabels = rows.map((row) => row.label);
    const xPositions = rows.map((_, index) => chartX + index * slotWidth + slotWidth / 2);

    axisMarkup = renderCartesianAxes({
      chartX,
      chartY,
      chartWidth,
      chartHeight,
      xTickLabels: xLabels,
      xTickPositions: xPositions,
      yMaxValue: maxTotal,
      baseText,
      showGrid: resolvedOptions.showGrid
    });

    chartMarkup += rows
      .map((row, index) => {
        let cursorY = chartY + chartHeight;
        const x = chartX + index * slotWidth + (slotWidth - barWidth) / 2;
        return row.values
          .map((item, stackIndex) => {
            const segmentHeight = (item.value / maxTotal) * chartHeight;
            cursorY -= segmentHeight;
            return `<rect data-role="plot-bar" x="${x}" y="${cursorY}" width="${barWidth}" height="${segmentHeight}" rx="10" fill="${palette[stackIndex % palette.length]}" />`;
          })
          .join('');
      })
      .join('');
  } else if (template === 'categorical-ranking') {
    const series = buildBarSeries(dataset, mapping).sort((a, b) => b.value - a.value).slice(0, 6);
    const maxValue = Math.max(1, ...series.map((item) => item.value));

    axisMarkup = `
      <g data-axis-group="ranking">
        <line data-axis="x" x1="${chartX}" y1="${chartY + chartHeight}" x2="${chartX + chartWidth}" y2="${chartY + chartHeight}" stroke="${baseText}" opacity="0.34" />
        ${renderNumericXAxis({
          chartX,
          chartY,
          chartWidth,
          chartHeight,
          maxValue,
          baseText
        })}
      </g>
    `;

    chartMarkup += series
      .map((item, index) => {
        const y = chartY + index * 66;
        const widthValue = (item.value / maxValue) * chartWidth;
        return `
          <text x="${chartX}" y="${y - 12}" fill="${baseText}" font-size="22">${escapeMarkup(item.label)}</text>
          <rect data-role="plot-bar" x="${chartX}" y="${y}" width="${widthValue}" height="24" rx="12" fill="${palette[index % palette.length]}" />
          <text x="${chartX + widthValue + 14}" y="${y + 19}" fill="${baseText}" font-size="20">${item.value.toLocaleString()}</text>
        `;
      })
      .join('');
  } else {
    const series = buildBarSeries(dataset, mapping);
    const maxValue = Math.max(1, ...series.map((item) => item.value));
    const slotWidth = chartWidth / Math.max(1, series.length);
    const barWidth = Math.max(28, slotWidth - 28);
    const xLabels = series.map((item) => item.label);
    const xPositions = series.map((_, index) => chartX + index * slotWidth + slotWidth / 2);

    axisMarkup = renderCartesianAxes({
      chartX,
      chartY,
      chartWidth,
      chartHeight,
      xTickLabels: xLabels,
      xTickPositions: xPositions,
      yMaxValue: maxValue,
      baseText,
      showGrid: resolvedOptions.showGrid
    });

    chartMarkup += series
      .map((item, index) => {
        const heightValue = (item.value / maxValue) * chartHeight;
        const x = chartX + index * slotWidth + (slotWidth - barWidth) / 2;
        const y = chartY + chartHeight - heightValue;
        return `<rect data-role="plot-bar" x="${x}" y="${y}" width="${barWidth}" height="${heightValue}" rx="18" fill="${palette[index % palette.length]}" />`;
      })
      .join('');
  }

  return {
    width,
    height,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <defs>
          <clipPath id="header-clip">
            <rect x="${pad}" y="72" width="${width - pad * 2}" height="${headerClipHeight}" rx="0" />
          </clipPath>
        </defs>
        <rect width="${width}" height="${height}" fill="${background}" />
        <rect x="32" y="32" width="${width - 64}" height="${height - 64}" rx="36" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
        ${headerMarkup}
        ${legendMarkup}
        ${axisMarkup}
        <g data-slot="chart">${chartMarkup}</g>
        <text x="${pad}" y="${height - 80}" fill="${baseText}" opacity="0.58" font-size="18" font-family="Avenir Next, Segoe UI, sans-serif">${escapeMarkup(source)}</text>
      </svg>
    `.trim()
  };
}
