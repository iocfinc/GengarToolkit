import { describe, expect, it } from 'vitest';
import {
  suiteExportCapabilities
} from '@packages/export-engine/src/contracts';
import {
  getLogicalCanvasSize,
  getOutputCanvasSize,
  getPreviewDisplaySize
} from '@packages/export-engine/src/renderSizing';
import {
  exportDocumentAsPng,
  renderDocumentToCanvas
} from '@packages/export-engine/src/captureFrame';
import { exportDocumentAsWebM } from '@packages/export-engine/src/exportVideo';
import { svgMarkupToBlob } from '@packages/export-engine/src/svgExport';

describe('export engine package', () => {
  it('exports shared sizing helpers', () => {
    expect(typeof getLogicalCanvasSize).toBe('function');
    expect(typeof getOutputCanvasSize).toBe('function');
    expect(typeof getPreviewDisplaySize).toBe('function');
  });

  it('exports raster and motion export entry points', () => {
    expect(typeof renderDocumentToCanvas).toBe('function');
    expect(typeof exportDocumentAsPng).toBe('function');
    expect(typeof exportDocumentAsWebM).toBe('function');
  });

  it('exports capability contracts for each toolkit', () => {
    expect(suiteExportCapabilities.motion.map((entry) => entry.format)).toEqual(['png', 'webm']);
    expect(suiteExportCapabilities.dataviz.map((entry) => entry.format)).toEqual(['png', 'svg']);
    expect(suiteExportCapabilities['social-card'].map((entry) => entry.format)).toEqual(['png', 'svg']);
  });

  it('exports a browser-safe svg blob helper', async () => {
    const blob = svgMarkupToBlob('<svg xmlns="http://www.w3.org/2000/svg"></svg>');

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toContain('image/svg+xml');
    expect(blob.size).toBeGreaterThan(0);
  });
});
