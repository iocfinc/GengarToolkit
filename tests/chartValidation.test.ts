import { describe, expect, it } from 'vitest';
import { getDatavizValidationMessages } from '@packages/chart-core/src/validation';

const dataset = {
  columns: ['Month', 'North', 'South', 'Engagement'],
  rows: [
    { Month: 'Jan', North: '12', South: '9', Engagement: '0.42' },
    { Month: 'Feb', North: '18', South: '14', Engagement: '0.53' }
  ]
};

describe('dataviz validation', () => {
  it('requires multiple series for grouped line templates', () => {
    expect(
      getDatavizValidationMessages({
        dataset,
        template: 'multi-line',
        mapping: {
          xColumn: 'Month',
          yColumn: 'North',
          valueColumns: ['North']
        }
      })
    ).toContain('Choose at least two numeric series columns for this template.');
  });

  it('requires numeric x and y selections for scatter charts', () => {
    expect(
      getDatavizValidationMessages({
        dataset,
        template: 'scatter',
        mapping: {
          xColumn: 'Month',
          yColumn: 'North',
          valueColumns: ['North']
        }
      })
    ).toContain('Scatter charts require a numeric X column.');
  });
});
