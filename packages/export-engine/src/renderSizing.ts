import { aspectRatioDimensions, exportResolutionSizes } from '@/lib/types/controls';
import type { AspectRatio, BrandDocument, ResolutionPreset } from '@packages/config-schema/src/document';
import { getOutputPreset } from '@packages/studio-shell/src/outputPresets';

export type CanvasSize = {
  width: number;
  height: number;
};

export function getAspectRatioValue(aspectRatio: AspectRatio) {
  return aspectRatioDimensions[aspectRatio];
}

export function getLogicalCanvasSize(
  document: Pick<BrandDocument, 'aspectRatio' | 'export'>,
  resolution: ResolutionPreset = document.export.resolution
): CanvasSize {
  const outputPreset = document.export.presetId
    ? getOutputPreset(document.export.presetId)
    : null;

  if (outputPreset) {
    return {
      width: outputPreset.width,
      height: outputPreset.height
    };
  }

  const base = exportResolutionSizes[resolution];
  const aspect = getAspectRatioValue(document.aspectRatio);

  return {
    width: base.width,
    height: Math.round(base.width / aspect)
  };
}

export function getOutputCanvasSize(
  document: Pick<BrandDocument, 'aspectRatio' | 'export'>,
  resolution: ResolutionPreset = document.export.resolution
): CanvasSize {
  const logicalSize = getLogicalCanvasSize(document, resolution);

  return {
    width: Math.round(logicalSize.width * document.export.scale),
    height: Math.round(logicalSize.height * document.export.scale)
  };
}

export function getPreviewDisplaySize(
  containerWidth: number,
  containerHeight: number,
  aspectRatio: AspectRatio,
  zoom: number
): CanvasSize {
  const ratio = getAspectRatioValue(aspectRatio);
  const width = Math.min(containerWidth, containerHeight * ratio) * zoom;

  return {
    width,
    height: width / ratio
  };
}
