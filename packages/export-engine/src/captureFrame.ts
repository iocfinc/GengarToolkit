import type { BrandDocument, ResolutionPreset } from '@packages/config-schema/src/document';
import { drawScene } from '@/lib/render/sceneRenderer';
import { getLogicalCanvasSize, getOutputCanvasSize } from './renderSizing';

export async function renderDocumentToCanvas(
  brandDocument: BrandDocument,
  elapsedSeconds = 0,
  resolution: ResolutionPreset = brandDocument.export.resolution
) {
  const canvas = globalThis.document.createElement('canvas');
  const logicalSize = getLogicalCanvasSize(brandDocument, resolution);
  const outputSize = getOutputCanvasSize(brandDocument, resolution);
  canvas.width = outputSize.width;
  canvas.height = outputSize.height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to create export canvas.');
  }

  context.setTransform(brandDocument.export.scale, 0, 0, brandDocument.export.scale, 0, 0);

  drawScene(context, logicalSize.width, logicalSize.height, brandDocument, {
    elapsedSeconds
  });

  return canvas;
}

export async function exportDocumentAsPng(document: BrandDocument) {
  const canvas = await renderDocumentToCanvas(document, 0);
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('PNG export failed.'));
        return;
      }
      resolve(blob);
    }, 'image/png');
  });
}
