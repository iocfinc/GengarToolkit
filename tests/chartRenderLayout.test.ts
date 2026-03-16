import { describe, expect, it } from 'vitest';
import { renderChartSvg } from '@packages/chart-core/src/renderSvg';

const dataset = {
  columns: ['Month', 'North', 'South', 'West'],
  rows: [
    { Month: 'Jan', North: '12', South: '9', West: '7' },
    { Month: 'Feb', North: '18', South: '11', West: '10' },
    { Month: 'Mar', North: '22', South: '16', West: '13' },
    { Month: 'Apr', North: '28', South: '19', West: '17' }
  ]
};

describe('renderChartSvg layout', () => {
  it('wraps long subheadlines and renders the legend above the plot area', () => {
    const chart = renderChartSvg({
      dataset,
      mapping: {
        xColumn: 'Month',
        yColumn: 'North',
        valueColumns: ['North', 'South', 'West']
      },
      template: 'multi-line',
      aspectRatio: '4:5',
      headline: 'Ridership grew',
      subheadline:
        'This is a deliberately long subheadline that should wrap and shrink before it overflows outside the chart frame.',
      source: 'Internal analytics',
      themeId: 'dark-editorial',
      options: {
        showLegend: true
      }
    });

    expect(chart.svg).toContain('<tspan');
    expect(chart.svg).toContain('data-slot="legend"');
    expect(chart.svg.indexOf('data-slot="legend"')).toBeLessThan(
      chart.svg.indexOf('data-role="plot-line"')
    );
  });

  it('always renders cartesian axes and y-axis tick labels for bar charts', () => {
    const chart = renderChartSvg({
      dataset,
      mapping: {
        xColumn: 'Month',
        yColumn: 'North',
        valueColumns: ['North']
      },
      template: 'bar',
      aspectRatio: '4:5',
      headline: 'Ridership grew',
      subheadline: 'Morning recovered first',
      source: 'Internal analytics',
      themeId: 'dark-editorial'
    });

    expect(chart.svg).toContain('data-axis-group="cartesian"');
    expect(chart.svg).toContain('data-axis-label="y"');
    expect(chart.svg).toContain('data-axis-label="x"');
  });

  it('centers big numbers and honors custom palette overrides', () => {
    const bigNumber = renderChartSvg({
      dataset,
      mapping: {
        xColumn: 'Month',
        yColumn: 'North',
        valueColumns: ['North']
      },
      template: 'big-number',
      aspectRatio: '1:1',
      headline: 'Ridership grew',
      subheadline: 'Morning recovered first',
      source: 'Internal analytics',
      themeId: 'dark-editorial'
    });

    expect(bigNumber.svg).toContain('data-role="big-number-value"');
    expect(bigNumber.svg).toContain('text-anchor="middle"');

    const barChart = renderChartSvg({
      dataset,
      mapping: {
        xColumn: 'Month',
        yColumn: 'North',
        valueColumns: ['North']
      },
      template: 'bar',
      aspectRatio: '1:1',
      headline: 'Ridership grew',
      subheadline: 'Morning recovered first',
      source: 'Internal analytics',
      themeId: 'dark-editorial',
      options: {
        useCustomPalette: true,
        customPalette: ['orange']
      }
    });

    expect(barChart.svg).toContain('fill="#FF7A00"');
  });
});
