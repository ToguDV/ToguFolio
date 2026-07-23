import { useEffect } from 'react';
import { pickRandomChar } from './chars.js';

const QUERY = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

const FONT_PX = 14;
const LINE_HEIGHT = 1.2;
const CELL_HEIGHT = Math.round(FONT_PX * LINE_HEIGHT);
const TAIL_LENGTH = 16;
const FADE_ALPHA = 0.05;
const HEAD_ALPHA = 0.22;
const FRAME_INTERVAL_MS = 1000 / 30;

function readVar(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function spawnColumn() {
  return {
    head: -Math.floor(Math.random() * 20),
    speed: 0.4 + Math.random() * 0.6,
    trail: Array.from({ length: TAIL_LENGTH }, () => pickRandomChar()),
    tick: 0,
  };
}

export default function useMatrixRain(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion()) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lime = readVar('--color-ink', '#d1ff19');
    const softLime = readVar('--color-ink-soft', '#a3e635');
    const canvasColor = readVar('--color-canvas', '#0a0a0a');
    const dpr = window.devicePixelRatio || 1;

    let columns = [];
    let cellWidth = 8;
    let cssWidth = 0;
    let cssHeight = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      cssWidth = rect.width;
      cssHeight = rect.height;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.font = `${FONT_PX}px "JetBrains Mono", ui-monospace, Menlo, monospace`;
      ctx.textBaseline = 'top';
      cellWidth = Math.max(6, Math.ceil(ctx.measureText('M').width));
      const cols = Math.max(1, Math.floor(rect.width / cellWidth));
      columns = Array.from({ length: cols }, spawnColumn);
      ctx.globalAlpha = 1;
      ctx.fillStyle = canvasColor;
      ctx.fillRect(0, 0, cssWidth, cssHeight);
    }

    let rafId = 0;
    let lastTime = 0;

    function frame(time) {
      if (time - lastTime < FRAME_INTERVAL_MS) {
        rafId = requestAnimationFrame(frame);
        return;
      }
      lastTime = time;

      const rows = Math.max(1, Math.floor(cssHeight / CELL_HEIGHT));

      ctx.globalAlpha = FADE_ALPHA;
      ctx.fillStyle = canvasColor;
      ctx.fillRect(0, 0, cssWidth, cssHeight);
      ctx.globalAlpha = 1;

      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        const x = i * cellWidth;

        if (col.head >= 0 && col.head < rows) {
          if (Math.random() < 0.08) col.trail[0] = pickRandomChar();
          ctx.globalAlpha = HEAD_ALPHA;
          ctx.fillStyle = lime;
          ctx.fillText(col.trail[0], x, col.head * CELL_HEIGHT);
        }

        ctx.fillStyle = softLime;
        for (let j = 1; j < TAIL_LENGTH; j++) {
          const row = col.head - j;
          if (row < 0 || row >= rows) continue;
          const fade = 1 - j / TAIL_LENGTH;
          ctx.globalAlpha = HEAD_ALPHA * fade * 0.85;
          ctx.fillText(col.trail[j], x, row * CELL_HEIGHT);
        }
        ctx.globalAlpha = 1;

        col.tick += col.speed;
        if (col.tick >= 1) {
          const advance = Math.floor(col.tick);
          col.head += advance;
          col.tick -= advance;
          for (let k = TAIL_LENGTH - 1; k > 0; k--) {
            col.trail[k] = col.trail[k - 1];
          }
          col.trail[0] = pickRandomChar();
        }

        if (col.head - TAIL_LENGTH > rows) {
          Object.assign(col, spawnColumn());
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [canvasRef]);
}
