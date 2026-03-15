import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

function createCanvasGradientMock() {
  return {
    addColorStop: vi.fn()
  };
}

function createCanvasContextMock() {
  return {
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
    createRadialGradient: vi.fn(() => createCanvasGradientMock()),
    createLinearGradient: vi.fn(() => createCanvasGradientMock()),
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
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

class MediaRecorderMock {
  static isTypeSupported = vi.fn(() => true);

  ondataavailable: ((event: { data: Blob }) => void) | null = null;
  onerror: (() => void) | null = null;
  onstop: (() => void) | null = null;

  constructor(public stream: MediaStream, public options?: MediaRecorderOptions) {}

  start() {
    this.ondataavailable?.({
      data: new Blob(['frame'], { type: this.options?.mimeType ?? 'video/webm' })
    });
  }

  stop() {
    this.onstop?.();
  }
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock
});

Object.defineProperty(window, 'MediaRecorder', {
  writable: true,
  value: MediaRecorderMock
});

Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'blob:mock-url')
});

Object.defineProperty(window.URL, 'revokeObjectURL', {
  writable: true,
  value: vi.fn()
});

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: vi.fn((callback: FrameRequestCallback) => {
    callback(16);
    return 1;
  })
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: vi.fn()
});

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: vi.fn(() => createCanvasContextMock())
});

Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  writable: true,
  value: vi.fn((callback: BlobCallback) => {
    callback(new Blob(['png'], { type: 'image/png' }));
  })
});

Object.defineProperty(HTMLCanvasElement.prototype, 'captureStream', {
  writable: true,
  value: vi.fn(() => ({}) as MediaStream)
});

afterEach(() => {
  cleanup();
  window.localStorage.clear();
  vi.useRealTimers();
  vi.restoreAllMocks();
});
