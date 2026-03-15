import { vi } from 'vitest';
import { useEditorStore } from '@/lib/store/editorStore';

type MockGradient = {
  addColorStop: ReturnType<typeof vi.fn>;
};

export type MockCanvasContext = {
  radialGradients: MockGradient[];
  linearGradients: MockGradient[];
  save: ReturnType<typeof vi.fn>;
  restore: ReturnType<typeof vi.fn>;
  fillRect: ReturnType<typeof vi.fn>;
  clearRect: ReturnType<typeof vi.fn>;
  setTransform: ReturnType<typeof vi.fn>;
  beginPath: ReturnType<typeof vi.fn>;
  moveTo: ReturnType<typeof vi.fn>;
  lineTo: ReturnType<typeof vi.fn>;
  stroke: ReturnType<typeof vi.fn>;
  strokeRect: ReturnType<typeof vi.fn>;
  setLineDash: ReturnType<typeof vi.fn>;
  translate: ReturnType<typeof vi.fn>;
  rotate: ReturnType<typeof vi.fn>;
  arc: ReturnType<typeof vi.fn>;
  ellipse: ReturnType<typeof vi.fn>;
  fill: ReturnType<typeof vi.fn>;
  fillText: ReturnType<typeof vi.fn>;
  measureText: ReturnType<typeof vi.fn<[string], TextMetrics>>;
  createRadialGradient: ReturnType<
    typeof vi.fn<[number, number, number, number, number, number], CanvasGradient>
  >;
  createLinearGradient: ReturnType<typeof vi.fn<[number, number, number, number], CanvasGradient>>;
  canvas: { width: number; height: number };
  globalAlpha: number;
  globalCompositeOperation: string;
  filter: string;
  fillStyle: string | CanvasGradient;
  strokeStyle: string;
  lineWidth: number;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  font: string;
};

export function createMockCanvasContext() {
  const radialGradients: MockGradient[] = [];
  const linearGradients: MockGradient[] = [];

  const context: MockCanvasContext = {
    radialGradients,
    linearGradients,
    save: vi.fn(),
    restore: vi.fn(),
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    strokeRect: vi.fn(),
    setLineDash: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    arc: vi.fn(),
    ellipse: vi.fn(),
    fill: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn<[string], TextMetrics>((value: string) => ({ width: value.length * 10 } as TextMetrics)),
    createRadialGradient: vi.fn<[number, number, number, number, number, number], CanvasGradient>(() => {
      const gradient = { addColorStop: vi.fn() };
      radialGradients.push(gradient);
      return gradient as unknown as CanvasGradient;
    }),
    createLinearGradient: vi.fn<[number, number, number, number], CanvasGradient>(() => {
      const gradient = { addColorStop: vi.fn() };
      linearGradients.push(gradient);
      return gradient as unknown as CanvasGradient;
    }),
    canvas: { width: 0, height: 0 },
    globalAlpha: 1,
    globalCompositeOperation: 'source-over',
    filter: '',
    fillStyle: '#000000',
    strokeStyle: '#000000',
    lineWidth: 1,
    textAlign: 'left',
    textBaseline: 'alphabetic',
    font: ''
  };

  return context;
}

export function asCanvasContext(context: MockCanvasContext) {
  return context as unknown as CanvasRenderingContext2D;
}

export function resetEditorStore() {
  useEditorStore.setState(useEditorStore.getInitialState());
}
