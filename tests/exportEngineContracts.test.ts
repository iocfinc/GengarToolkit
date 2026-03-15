import { describe, expect, it } from 'vitest';
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
});
