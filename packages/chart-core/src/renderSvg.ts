import { brandThemes, resolveColor } from '@packages/design-tokens/src/colors';
import type { DatavizDataset, DatavizFieldMapping, DatavizTemplate, SuiteAspectRatio } from '@packages/config-schema/src/document';

const aspectSizes: Record<SuiteAspectRatio, { width: number; height: number }> = {
  '1:1': { width: 1080, height: 1080 },
  '4:5': { width: 1080, height: 1350 },
  '16:9': { width: 1600, height: 900 }
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
    const outer = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    let path = outer;

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

export function renderChartSvg({
  dataset,
  mapping,
  template,
  aspectRatio,
  headline,
  subheadline,
  source,
  themeId
}: {
  dataset: DatavizDataset;
  mapping: DatavizFieldMapping;
  template: DatavizTemplate;
  aspectRatio: SuiteAspectRatio;
  headline: string;
  subheadline: string;
  source: string;
  themeId: string;
}) {
  const theme = getTheme(themeId);
  const { width, height } = aspectSizes[aspectRatio];
  const pad = 80;
  const chartX = pad;
  const chartY = 250;
  const chartWidth = width - pad * 2;
  const chartHeight = height - 380;
  const palette = theme.chartPalette.map((token) => resolveColor(token));
  const baseText = resolveColor(theme.canvas.foreground);
  const accent = resolveColor(theme.canvas.accent);
  const background = resolveColor(theme.canvas.background);

  let chartMarkup = '';

  if (template === 'big-number') {
    const firstValue = getNumbers(dataset, mapping)[0] ?? 0;
    chartMarkup = `
      <text x="${pad}" y="${chartY + 120}" fill="${accent}" font-size="180" font-family="Avenir Next, Segoe UI, sans-serif" font-weight="700">${firstValue.toLocaleString()}</text>
      <text x="${pad}" y="${chartY + 200}" fill="${baseText}" opacity="0.72" font-size="28" font-family="Avenir Next, Segoe UI, sans-serif">${escapeMarkup(mapping.yColumn ?? mapping.valueColumns[0] ?? 'Value')}</text>
    `;
  } else if (template === 'line' || template === 'multi-line' || template === 'focused-line') {
    const valueColumns = template === 'line'
      ? [mapping.yColumn ?? mapping.valueColumns[0] ?? dataset.columns[1] ?? '']
      : (mapping.valueColumns.length > 0 ? mapping.valueColumns : dataset.columns.slice(1, 4));
    chartMarkup += `<line x1="${chartX}" y1="${chartY + chartHeight}" x2="${chartX + chartWidth}" y2="${chartY + chartHeight}" stroke="${baseText}" opacity="0.18" />`;
    chartMarkup += `<line x1="${chartX}" y1="${chartY}" x2="${chartX}" y2="${chartY + chartHeight}" stroke="${baseText}" opacity="0.18" />`;
    valueColumns.forEach((column, index) => {
      const values = dataset.rows.map((row) => Number(row[column] ?? 0));
      const highlight = template !== 'focused-line' || index === 0;
      chartMarkup += `
        <path d="${linePoints(values, chartX, chartY, chartWidth, chartHeight)}" fill="none" stroke="${palette[index % palette.length]}" stroke-width="${highlight ? 5 : 3}" opacity="${highlight ? 1 : 0.34}" />
      `;
    });
  } else if (template === 'scatter') {
    const xValues = dataset.rows.map((row) => Number(row[mapping.xColumn ?? dataset.columns[0] ?? ''] ?? 0));
    const yValues = dataset.rows.map((row) => Number(row[mapping.yColumn ?? dataset.columns[1] ?? ''] ?? 0));
    const maxX = Math.max(1, ...xValues);
    const maxY = Math.max(1, ...yValues);
    chartMarkup += `<rect x="${chartX}" y="${chartY}" width="${chartWidth}" height="${chartHeight}" fill="none" stroke="${baseText}" opacity="0.12" />`;
    chartMarkup += dataset.rows
      .map((row, index) => {
        const x = chartX + (xValues[index] / maxX) * chartWidth;
        const y = chartY + chartHeight - (yValues[index] / maxY) * chartHeight;
        return `<circle cx="${x}" cy="${y}" r="10" fill="${palette[index % palette.length]}" opacity="0.88" />`;
      })
      .join('');
  } else if (template === 'pie-donut') {
    const series = buildBarSeries(dataset, mapping);
    const paths = pieSlices(series, width / 2, chartY + chartHeight / 2, Math.min(chartWidth, chartHeight) / 2.3, 120);
    chartMarkup += paths
      .map((path, index) => `<path d="${path}" fill="${palette[index % palette.length]}" opacity="0.94" />`)
      .join('');
  } else if (template === 'stacked-bar') {
    const rows = buildStackedSeries(dataset, mapping);
    const maxTotal = Math.max(1, ...rows.map((row) => row.values.reduce((sum, item) => sum + item.value, 0)));
    const barWidth = chartWidth / Math.max(1, rows.length) - 24;
    chartMarkup += rows
      .map((row, index) => {
        let cursorY = chartY + chartHeight;
        const x = chartX + index * (barWidth + 24);
        const stacks = row.values
          .map((item, stackIndex) => {
            const segmentHeight = (item.value / maxTotal) * chartHeight;
            cursorY -= segmentHeight;
            return `<rect x="${x}" y="${cursorY}" width="${barWidth}" height="${segmentHeight}" rx="10" fill="${palette[stackIndex % palette.length]}" />`;
          })
          .join('');
        return `${stacks}<text x="${x + barWidth / 2}" y="${chartY + chartHeight + 34}" fill="${baseText}" opacity="0.7" text-anchor="middle" font-size="20">${escapeMarkup(row.label)}</text>`;
      })
      .join('');
  } else {
    const series = buildBarSeries(dataset, mapping).sort((a, b) =>
      template === 'categorical-ranking' ? b.value - a.value : 0
    );
    const maxValue = Math.max(1, ...series.map((item) => item.value));

    if (template === 'categorical-ranking') {
      chartMarkup += series
        .slice(0, 6)
        .map((item, index) => {
          const y = chartY + index * 66;
          const widthValue = (item.value / maxValue) * chartWidth;
          return `
            <text x="${chartX}" y="${y - 12}" fill="${baseText}" font-size="22">${escapeMarkup(item.label)}</text>
            <rect x="${chartX}" y="${y}" width="${widthValue}" height="24" rx="12" fill="${palette[index % palette.length]}" />
            <text x="${chartX + widthValue + 14}" y="${y + 19}" fill="${baseText}" font-size="20">${item.value.toLocaleString()}</text>
          `;
        })
        .join('');
    } else {
      const barWidth = chartWidth / Math.max(1, series.length) - 24;
      chartMarkup += series
        .map((item, index) => {
          const heightValue = (item.value / maxValue) * chartHeight;
          const x = chartX + index * (barWidth + 24);
          const y = chartY + chartHeight - heightValue;
          return `
            <rect x="${x}" y="${y}" width="${barWidth}" height="${heightValue}" rx="18" fill="${palette[index % palette.length]}" />
            <text x="${x + barWidth / 2}" y="${chartY + chartHeight + 34}" fill="${baseText}" opacity="0.7" text-anchor="middle" font-size="20">${escapeMarkup(item.label)}</text>
          `;
        })
        .join('');
    }
  }

  return {
    width,
    height,
    svg: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
        <rect width="${width}" height="${height}" fill="${background}" />
        <rect x="32" y="32" width="${width - 64}" height="${height - 64}" rx="36" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" />
        <text x="${pad}" y="110" fill="${baseText}" opacity="0.62" font-size="18" font-family="Avenir Next, Segoe UI, sans-serif">Data Visualization Toolkit</text>
        <text x="${pad}" y="170" fill="${baseText}" font-size="48" font-family="Iowan Old Style, Times New Roman, serif" font-weight="700">${escapeMarkup(headline || 'Untitled chart')}</text>
        <text x="${pad}" y="212" fill="${baseText}" opacity="0.72" font-size="24" font-family="Avenir Next, Segoe UI, sans-serif">${escapeMarkup(subheadline)}</text>
        ${chartMarkup}
        <text x="${pad}" y="${height - 80}" fill="${baseText}" opacity="0.58" font-size="18" font-family="Avenir Next, Segoe UI, sans-serif">${escapeMarkup(source)}</text>
      </svg>
    `.trim()
  };
}
