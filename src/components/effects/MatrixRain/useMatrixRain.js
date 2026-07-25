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

const DEFAULTS = {
  headAlpha: 0.22,
  fadeAlpha: 0.05,
  tailLength: 16,
  frameIntervalMs: 1000 / 30,
  speed: 0.7,
  density: 1,
};

function readVar(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

const DEFAULT_CANVAS_RGB = [10, 10, 10];

function parseHexColor(value) {
  if (typeof value !== 'string') return DEFAULT_CANVAS_RGB;
  const m = value.match(/^#([0-9a-f]{6})$/i);
  if (!m) return DEFAULT_CANVAS_RGB;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function spawnColumn(tailLength, speedBase) {
  return {
    head: -Math.floor(Math.random() * 20),
    speed: speedBase * (0.5 + Math.random()),
    trail: Array.from({ length: tailLength }, () => pickRandomChar()),
    tick: 0,
    active: true,
  };
}

function spawnInactiveColumn() {
  return {
    head: -999,
    speed: 0,
    trail: [],
    tick: 0,
    active: false,
  };
}

export default function useMatrixRain(canvasRef, options = {}) {
  const { headAlpha, fadeAlpha, tailLength, frameIntervalMs, speed, density } = { ...DEFAULTS, ...options };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion()) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lime = readVar('--color-ink', '#d1ff19');
    const softLime = readVar('--color-ink-soft', '#a3e635');
    const canvasColor = readVar('--color-canvas', '#0a0a0a');
    const canvasRgb = parseHexColor(canvasColor);
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
      columns = Array.from({ length: cols }, () =>
        Math.random() < density ? spawnColumn(tailLength, speed) : spawnInactiveColumn()
      );
      ctx.globalAlpha = 1;
      ctx.fillStyle = canvasColor;
      ctx.fillRect(0, 0, cssWidth, cssHeight);
    }

  let rafId = 0;
  let lastTime = 0;

  function cellCountOf(str) {
    return Math.max(1, Math.ceil(ctx.measureText(str).width / cellWidth));
  }

  function frame(time) {
    if (time - lastTime < frameIntervalMs) {
      rafId = requestAnimationFrame(frame);
      return;
    }
    lastTime = time;

    const rows = Math.max(1, Math.floor(cssHeight / CELL_HEIGHT));
    const numCols = columns.length;

    ctx.fillStyle = `rgba(${canvasRgb[0]}, ${canvasRgb[1]}, ${canvasRgb[2]}, ${fadeAlpha})`;
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    const claimed = new Set();
    for (let i = 0; i < numCols; i++) {
      const col = columns[i];
      for (let j = 0; j < tailLength; j++) {
        const row = col.head - j;
        if (row < 0 || row >= rows) continue;
        const ch = col.trail[j];
        if (ch.length > 1) {
          const span = cellCountOf(ch);
          for (let k = 0; k < span; k++) {
            const c = i + k;
            if (c < numCols) claimed.add(row * numCols + c);
          }
        }
      }
    }

    for (let i = 0; i < numCols; i++) {
      const col = columns[i];
      if (!col.active) continue;
      const x = i * cellWidth;

      if (col.head >= 0 && col.head < rows) {
        const ch0 = col.trail[0];
        if (!(ch0.length === 1 && claimed.has(col.head * numCols + i))) {
          if (Math.random() < 0.08) col.trail[0] = pickRandomChar();
          ctx.globalAlpha = headAlpha;
          ctx.fillStyle = lime;
          ctx.fillText(col.trail[0], x, col.head * CELL_HEIGHT);
        }
      }

      ctx.fillStyle = softLime;
      for (let j = 1; j < tailLength; j++) {
        const row = col.head - j;
        if (row < 0 || row >= rows) continue;
        const ch = col.trail[j];
        if (ch.length === 1 && claimed.has(row * numCols + i)) continue;
        const fade = 1 - j / tailLength;
        ctx.globalAlpha = headAlpha * fade * 0.85;
        ctx.fillText(ch, x, row * CELL_HEIGHT);
      }
      ctx.globalAlpha = 1;

      col.tick += col.speed;
      if (col.tick >= 1) {
        const advance = Math.floor(col.tick);
        col.head += advance;
        col.tick -= advance;
        for (let k = tailLength - 1; k > 0; k--) {
          col.trail[k] = col.trail[k - 1];
        }
        col.trail[0] = pickRandomChar();
      }

      if (col.active && col.head - tailLength > rows) {
        Object.assign(col, spawnColumn(tailLength, speed));
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
  }, [canvasRef, headAlpha, fadeAlpha, tailLength, frameIntervalMs, speed, density]);
}
