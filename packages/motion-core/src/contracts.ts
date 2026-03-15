import type { BrandDocument } from '@packages/config-schema/src/document';

export type MotionSceneDefinition = {
  id: string;
  label: string;
  createDefaultDocument: () => BrandDocument;
};
