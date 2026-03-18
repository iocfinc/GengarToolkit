import React from 'react';
import { act, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CanvasStage } from '@/components/editor/CanvasStage';
import { useEditorStore } from '@/lib/store/editorStore';
import { resetEditorStore } from './testUtils';

const drawScene = vi.fn();

vi.mock('@/lib/render/sceneRenderer', () => ({
  drawScene: (...args: unknown[]) => drawScene(...args)
}));

describe('CanvasStage', () => {
  beforeEach(() => {
    resetEditorStore();
    drawScene.mockReset();
  });

  it('renders a static preview on startup using the same logical dimensions as export', () => {
    const rafCallbacks: FrameRequestCallback[] = [];

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
      width: 900,
      height: 700,
      top: 0,
      left: 0,
      bottom: 700,
      right: 900,
      x: 0,
      y: 0,
      toJSON: () => ({})
    }));

    class ImmediateResizeObserver {
      constructor(private readonly callback: ResizeObserverCallback) {}

      observe = vi.fn(() => {
        this.callback([], this as unknown as ResizeObserver);
      });

      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      value: ImmediateResizeObserver
    });

    render(<CanvasStage />);

    expect(drawScene).toHaveBeenCalled();
    expect(drawScene.mock.calls[0]?.[1]).toBe(1920);
    expect(drawScene.mock.calls[0]?.[2]).toBe(1080);
    expect(rafCallbacks).toHaveLength(0);
    expect(document.body.textContent).toContain('Preview Scale 100%');
  });

  it('starts the animation loop only when playback is enabled', () => {
    const rafCallbacks: FrameRequestCallback[] = [];

    useEditorStore.setState((state) => ({
      ...state,
      document: {
        ...state.document,
        motion: {
          ...state.document.motion,
          playing: true
        }
      }
    }));

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
      rafCallbacks.push(callback);
      return rafCallbacks.length;
    });
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(() => ({
      width: 900,
      height: 700,
      top: 0,
      left: 0,
      bottom: 700,
      right: 900,
      x: 0,
      y: 0,
      toJSON: () => ({})
    }));

    class ImmediateResizeObserver {
      constructor(private readonly callback: ResizeObserverCallback) {}

      observe = vi.fn(() => {
        this.callback([], this as unknown as ResizeObserver);
      });

      unobserve = vi.fn();
      disconnect = vi.fn();
    }

    Object.defineProperty(window, 'ResizeObserver', {
      writable: true,
      value: ImmediateResizeObserver
    });

    render(<CanvasStage />);

    expect(drawScene).toHaveBeenCalled();
    expect(rafCallbacks.length).toBeGreaterThan(0);
  });

  it('updates the visible zoom label when store zoom changes', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 1);
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});

    render(<CanvasStage />);

    expect(document.body.textContent).toContain('Preview Scale 100%');

    act(() => {
      useEditorStore.getState().setUi({ zoom: 0.85 });
    });

    expect(document.body.textContent).toContain('Preview Scale 85%');
  });
});
