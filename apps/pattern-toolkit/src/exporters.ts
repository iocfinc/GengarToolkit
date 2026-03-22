import { downloadBlob, svgMarkupToBlob, svgMarkupToPngBlob } from '@packages/export-engine/src/svgExport';
import { ensurePngDPI } from '@packages/export-engine/src/pngDpi';

export type ExportType = 'png' | 'svg' | 'jpg';

export async function exportPattern(
  svgMarkup: string,
  size: number,
  type: ExportType,
  filenameBase: string,
  dpi = 300
) {
  const safeName = filenameBase.replace(/[^a-z0-9-_]+/gi, '_');
  if (type === 'svg') {
    const blob = svgMarkupToBlob(svgMarkup);
    downloadBlob(blob, `${safeName}.svg`);
    return;
  }

  // Raster path
  if (type === 'png') {
    let blob = await svgMarkupToPngBlob(svgMarkup, size, size);
    blob = await ensurePngDPI(blob, dpi);
    downloadBlob(blob, `${safeName}.png`);
    return;
  }

  // JPG path via canvas
  const image = await svgToImage(svgMarkup);
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Unable to create export canvas.');
  // JPG doesn't support alpha — use white background; callers can pre-bake desired bg
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(image, 0, 0, size, size);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('JPG export failed.'))), 'image/jpeg', 0.92)
  );
  downloadBlob(blob, `${safeName}.jpg`);
}

async function svgToImage(svgMarkup: string) {
  const url = URL.createObjectURL(new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error('Unable to render SVG to image.'));
      nextImage.src = url;
    });
    return image;
  } finally {
    URL.revokeObjectURL(url);
  }
}

