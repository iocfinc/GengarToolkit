export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function svgMarkupToBlob(svgMarkup: string) {
  return new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
}

export async function svgMarkupToPngBlob(svgMarkup: string, width: number, height: number) {
  const svgBlob = svgMarkupToBlob(svgMarkup);
  const url = URL.createObjectURL(svgBlob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image();
      nextImage.onload = () => resolve(nextImage);
      nextImage.onerror = () => reject(new Error('Unable to render SVG to image.'));
      nextImage.src = url;
    });

    const canvas = window.document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Unable to create export canvas.');
    }

    context.drawImage(image, 0, 0, width, height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('PNG export failed.'));
          return;
        }
        resolve(blob);
      }, 'image/png');
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}
