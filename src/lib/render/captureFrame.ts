import { exportResolutionSizes } from '@/lib/types/controls';
import type { BrandDocument, ResolutionPreset } from '@/lib/types/document';
import { drawScene } from '@/lib/render/sceneRenderer';

function resolutionFor(document: BrandDocument, resolution: ResolutionPreset) {
  const base = exportResolutionSizes[resolution];
  const aspect =
    document.aspectRatio === '4:5'
      ? 4 / 5
      : document.aspectRatio === '1:1'
        ? 1
        : document.aspectRatio === '9:16'
          ? 9 / 16
          : document.aspectRatio === 'a4-portrait'
            ? 210 / 297
            : document.aspectRatio === 'a4-landscape'
              ? 297 / 210
              : 16 / 9;

  return {
    width: Math.round(base.width * document.export.scale),
    height: Math.round((base.width / aspect) * document.export.scale)
  };
}

export async function renderDocumentToCanvas(
  brandDocument: BrandDocument,
  elapsedSeconds = 0,
  resolution: ResolutionPreset = brandDocument.export.resolution
) {
  const canvas = globalThis.document.createElement('canvas');
  const { width, height } = resolutionFor(brandDocument, resolution);
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Unable to create export canvas.');
  }

  drawScene(context, width, height, brandDocument, {
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
