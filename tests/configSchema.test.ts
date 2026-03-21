import { describe, expect, it } from 'vitest';
import {
  aspectRatios,
  brandDocumentSchema,
  toolkitDocumentSchema
} from '@packages/config-schema/src/document';
import { aspectRatios as compatAspectRatios } from '@/lib/types/document';

describe('config schema package', () => {
  it('exports the shared document contract from the package', () => {
    expect(aspectRatios).toContain('16:9');

    const parsed = brandDocumentSchema.parse({
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
        presetId: 'landscape-16x9',
        fps: 30,
        duration: 5,
        scale: 1,
        filename: 'dioscuri-editorial-hero'
      },
      createdAt: '2026-03-15T00:00:00.000Z',
      updatedAt: '2026-03-15T00:00:00.000Z'
    });

    expect(parsed.aspectRatio).toBe('16:9');
  });

  it('keeps the legacy src import path working as a compatibility layer', () => {
    expect(compatAspectRatios).toEqual(aspectRatios);
  });

  it('parses toolkit-level documents through the shared package entry point', () => {
    const parsed = toolkitDocumentSchema.parse({
      toolkit: 'dataviz',
      template: 'bar',
      theme: 'dark-editorial',
      aspectRatio: '4:5',
      export: {
        format: 'svg',
        filename: 'ridership-story'
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
  });

  it('parses social-card toolkit documents with named output presets', () => {
    const parsed = toolkitDocumentSchema.parse({
      toolkit: 'social-card',
      template: 'announcement-card',
      theme: 'dark-editorial',
      aspectRatio: '1:1',
      export: {
        format: 'png',
        filename: 'launch-update',
        presetId: 'linkedin-video-square'
      },
      presetMeta: {
        id: 'preset-2',
        name: 'Launch Update',
        createdAt: '2026-03-21T00:00:00.000Z',
        updatedAt: '2026-03-21T00:00:00.000Z'
      },
      content: {
        title: 'Launch update',
        subtitle: 'Short-form system',
        body: 'Shared shell and preset-driven export sizes.',
        footer: 'Dioscuri',
        cta: 'Read brief',
        quoteAttribution: 'Internal team'
      },
      options: {
        mascotVariant: 'none',
        backgroundStyle: 'mesh',
        accentColor: 'royal',
        includeMiniChart: false
      }
    });

    expect(parsed.toolkit).toBe('social-card');
    expect(parsed.export.presetId).toBe('linkedin-video-square');
  });
});
