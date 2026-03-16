import { describe, expect, it } from 'vitest';
import { parseDatasetInput } from '@packages/chart-core/src/parser';
import { renderChartSvg } from '@packages/chart-core/src/renderSvg';
import { themePassesContrastGuidance } from '@packages/design-tokens/src/colors';
import {
  brandDocumentSchema,
  toolkitDocumentSchema
} from '@packages/config-schema/src/document';

describe('toolkit contracts', () => {
  it('parses dataviz toolkit documents through the shared schema', () => {
    const parsed = toolkitDocumentSchema.parse({
      toolkit: 'dataviz',
      template: 'bar',
      theme: 'dark-editorial',
      aspectRatio: '4:5',
      export: {
        format: 'svg',
        filename: 'ridership-story',
        presetId: 'portrait-4x5'
      },
      presetMeta: {
        id: 'preset-1',
        name: 'Ridership Story',
        createdAt: '2026-03-15T00:00:00.000Z',
        updatedAt: '2026-03-15T00:00:00.000Z'
      },
      content: {
        headline: 'Ridership grew',
        subheadline: 'Morning recovered first',
        annotations: [],
        source: 'Internal analytics'
      },
      data: {
        columns: ['Month', 'North'],
        rows: [{ Month: 'Jan', North: '12' }]
      },
      mapping: {
        xColumn: 'Month',
        yColumn: 'North',
        valueColumns: ['North']
      },
      options: {
        showGrid: true,
        showLegend: true,
        animate: false
      }
    });

    expect(parsed.toolkit).toBe('dataviz');
    expect(parsed.template).toBe('bar');
  });

  it('keeps the legacy motion document valid under the shared schema layer', () => {
    const motionDocument = brandDocumentSchema.parse({
      id: 'doc-1',
      name: 'Editorial Hero',
      aspectRatio: '16:9',
      layoutPreset: 'editorial-top-left',
      background: {
        type: 'mesh-field',
        paletteName: 'Royal Volt',
        baseColor: 'ink',
        glowColorA: 'royal',
        glowColorB: 'chartreuse',
        glowSize: 0.42,
        glowPositionA: { x: 0.28, y: 0.22 },
        glowPositionB: { x: 0.76, y: 0.62 },
        softness: 0.72,
        intensity: 0.84,
        vignette: 0.46
      },
      motif: {
        enabled: true,
        type: 'orb',
        count: 1,
        scale: 0.24,
        opacity: 0.48,
        blur: 0.72,
        position: { x: 0.82, y: 0.24 },
        rotation: -12,
        color: 'violetMist'
      },
      texture: {
        enabled: true,
        type: 'film-grain',
        opacity: 0.14,
        scale: 0.6,
        contrast: 0.68,
        animated: true
      },
      typography: {
        eyebrow: 'Brand Motion Toolkit',
        headline: 'Dark cinematic visuals.',
        body: 'Procedural backgrounds and restrained motion.',
        fontFamily: 'display',
        headlineSize: 82,
        bodySize: 20,
        weight: 600,
        lineHeight: 1,
        tracking: -0.03,
        alignment: 'left',
        maxWidth: 0.42,
        textColor: 'fog',
        anchor: 'top-left',
        paddingPreset: 'lg'
      },
      motion: {
        enabled: true,
        behavior: 'drift',
        playing: true,
        speed: 0.48,
        amplitude: 0.06,
        loopDuration: 6,
        easingProfile: 'ease-in-out',
        independentLayerMotion: true
      },
      export: {
        format: 'png',
        resolution: 'full-hd',
        fps: 30,
        duration: 5,
        scale: 1,
        filename: 'dioscuri-editorial-hero'
      },
      createdAt: '2026-03-15T00:00:00.000Z',
      updatedAt: '2026-03-15T00:00:00.000Z'
    });

    expect(motionDocument.name).toBe('Editorial Hero');
  });

  it('parses CSV input and renders a chart SVG', () => {
    const dataset = parseDatasetInput('Month,North,South\nJan,10,12\nFeb,14,15', 'csv');
    const chart = renderChartSvg({
      dataset,
      mapping: {
        xColumn: 'Month',
        yColumn: 'North',
        valueColumns: ['North', 'South']
      },
      template: 'multi-line',
      aspectRatio: '4:5',
      headline: 'Ridership grew',
      subheadline: 'Morning and evening recovered',
      source: 'Internal analytics',
      themeId: 'dark-editorial',
      annotations: ['North region outpaced plan'],
      options: {
        showGrid: true,
        showLegend: true,
        animate: false,
        highlightSeries: 'North'
      },
      size: {
        width: 1080,
        height: 1350
      }
    });

    expect(dataset.rows).toHaveLength(2);
    expect(chart.svg).toContain('<svg');
    expect(chart.svg).toContain('Ridership grew');
    expect(chart.svg).toContain('North region outpaced plan');
  });

  it('ships themes that pass the configured contrast guidance', () => {
    expect(themePassesContrastGuidance({
      id: 'dark-editorial',
      name: 'Dark Editorial',
      mode: 'dark',
      canvas: {
        background: 'ink',
        foreground: 'fog',
        accent: 'royal',
        accentMuted: 'chartreuse'
      },
      chartPalette: ['royal', 'chartreuse', 'blush', 'violetMist']
    })).toBe(true);
  });
});
