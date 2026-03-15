'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { aspectRatioLabels } from '@/lib/types/controls';
import { getLogicalCanvasSize } from '@/lib/render/renderSizing';
import { drawScene } from '@/lib/render/sceneRenderer';
import { useEditorStore } from '@/lib/store/editorStore';

export function CanvasStage() {
  const aspectRatio = useEditorStore((state) => state.document.aspectRatio);
  const ui = useEditorStore((state) => state.ui);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationStartRef = useRef<number | null>(null);
  const pauseTimeRef = useRef(0);
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = stageRef.current;
    if (!element) {
      return;
    }

    const observer = new ResizeObserver(() => {
      const rect = element.getBoundingClientRect();
      setBounds({
        width: rect.width,
        height: rect.height
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    let frameId = 0;

    const render = (now: number) => {
      const state = useEditorStore.getState();
      const rect = canvas.parentElement?.getBoundingClientRect();

      if (!rect) {
        frameId = requestAnimationFrame(render);
        return;
      }

      const viewportWidth = rect.width;
      const viewportHeight = rect.height;
      const logicalSize = getLogicalCanvasSize(state.document);

      // Backing store matches viewport for crisp output.
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      canvas.width = Math.max(1, Math.floor(viewportWidth * dpr));
      canvas.height = Math.max(1, Math.floor(viewportHeight * dpr));

      // Stable viewport: canvas fills container; scale/center the logical scene inside.
      const scale = Math.min(
        viewportWidth / logicalSize.width,
        viewportHeight / logicalSize.height
      ) * state.ui.zoom;
      const scaledWidth = logicalSize.width * scale;
      const scaledHeight = logicalSize.height * scale;
      const offsetX = (viewportWidth - scaledWidth) / 2;
      const offsetY = (viewportHeight - scaledHeight) / 2;

      context.setTransform(scale * dpr, 0, 0, scale * dpr, offsetX * dpr, offsetY * dpr);

      if (state.document.motion.playing) {
        if (animationStartRef.current === null) {
          animationStartRef.current = now - pauseTimeRef.current * 1000;
        }
      } else if (animationStartRef.current !== null) {
        pauseTimeRef.current = (now - animationStartRef.current) / 1000;
        animationStartRef.current = null;
      }

      const elapsedSeconds =
        animationStartRef.current === null ? pauseTimeRef.current : (now - animationStartRef.current) / 1000;

      drawScene(context, logicalSize.width, logicalSize.height, state.document, {
        elapsedSeconds,
        showGrid: state.ui.showGrid,
        showSafeMargins: state.ui.showSafeMargins
      });

      frameId = requestAnimationFrame(render);
    };

    frameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const stageLabel = useMemo(
    () => aspectRatioLabels[aspectRatio],
    [aspectRatio]
  );

  return (
    <section className="panel-surface relative flex min-h-[68vh] flex-col overflow-hidden rounded-[28px] p-4 transition-none">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Live Canvas</p>
          <h2 className="mt-1 font-display text-2xl text-fog">{stageLabel}</h2>
        </div>
        <div className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/56">
          {(ui.zoom * 100).toFixed(0)}% Zoom
        </div>
      </div>
      <div
        className="relative flex w-full flex-1 items-center justify-center overflow-hidden rounded-[24px] border border-white/8 bg-black/30 transition-none"
        ref={stageRef}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_32%)]" />
        <canvas className="relative z-10 h-full w-full shadow-stage transition-none" ref={canvasRef} />
        <div className="pointer-events-none absolute bottom-5 left-5 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-white/50">
          {bounds.width > 0 ? `${Math.round(bounds.width)}px stage` : 'Ready'}
        </div>
      </div>
    </section>
  );
}
