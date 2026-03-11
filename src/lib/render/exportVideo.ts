import type { BrandDocument } from '@/lib/types/document';
import { renderDocumentToCanvas } from '@/lib/render/captureFrame';
import { drawScene } from '@/lib/render/sceneRenderer';

export async function exportDocumentAsWebM(documentState: BrandDocument) {
  const canvas = await renderDocumentToCanvas(documentState, 0, documentState.export.resolution);
  const stream = canvas.captureStream(documentState.export.fps);
  const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
    ? 'video/webm;codecs=vp9'
    : 'video/webm';
  const recorder = new MediaRecorder(stream, {
    mimeType
  });
  const chunks: BlobPart[] = [];

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      chunks.push(event.data);
    }
  };

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Unable to acquire video export context.');
  }

  return new Promise<Blob>((resolve, reject) => {
    recorder.onerror = () => reject(new Error('WEBM export failed.'));
    recorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));

    recorder.start();

    const duration = documentState.export.duration;
    const startedAt = performance.now();

    const tick = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      drawScene(ctx, canvas.width, canvas.height, documentState, {
        elapsedSeconds: elapsed
      });

      if (elapsed >= duration) {
        recorder.stop();
        return;
      }

      requestAnimationFrame(tick);
    };

    tick();
  });
}
