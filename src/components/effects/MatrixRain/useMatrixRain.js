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

function spawnColumn(speedBase) {
  return {
    head: -Math.floor(Math.random() * 20),
    speed: speedBase * (0.5 + Math.random()),
    headChar: pickRandomChar(),
    tick: 0,
    active: true,
  };
}

function spawnInactiveColumn() {
  return {
    head: -999,
    speed: 0,
    headChar: '',
    tick: 0,
    active: false,
  };
}

export default function useMatrixRain(canvasRef, options = {}) {
  const { headAlpha, tailLength, frameIntervalMs, speed, density } = { ...DEFAULTS, ...options };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (prefersReducedMotion()) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lime = readVar('--color-ink', '#d1ff19');
    const canvasColor = readVar('--color-canvas', '#0a0a0a');

    const dpr = window.devicePixelRatio || 1;

    let columns = [];
    let grid = [];
    let cellWidth = 8;
    let cssWidth = 0;
    let cssHeight = 0;
    let rows = 0;
    let numCols = 0;

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
      numCols = Math.max(1, Math.floor(rect.width / cellWidth));
      rows = Math.max(1, Math.floor(rect.height / CELL_HEIGHT));
      columns = Array.from({ length: numCols }, () =>
        Math.random() < density ? spawnColumn(speed) : spawnInactiveColumn()
      );
      grid = Array.from({ length: rows }, () => new Array(numCols).fill(null));
      ctx.globalAlpha = 1;
      ctx.fillStyle = canvasColor;
      ctx.fillRect(0, 0, cssWidth, cssHeight);
    }

    let rafId = 0;
    let lastTime = 0;

    function frame(time) {
      if (time - lastTime < frameIntervalMs) {
        rafId = requestAnimationFrame(frame);
        return;
      }
      lastTime = time;

      for (let r = 0; r < rows; r++) {
        const row = grid[r];
        for (let c = 0; c < numCols; c++) {
          const cell = row[c];
          if (cell !== null) {
            cell.age++;
            if (cell.age >= tailLength) {
              row[c] = null;
            }
          }
        }
      }

      for (let i = 0; i < numCols; i++) {
        const col = columns[i];
        if (!col.active) continue;

        col.tick += col.speed;
        if (col.tick >= 1) {
          const advance = Math.floor(col.tick);
          col.head += advance;
          col.tick -= advance;
          col.headChar = pickRandomChar();
        } else if (Math.random() < 0.08) {
          col.headChar = pickRandomChar();
        }

        if (col.head >= 0 && col.head < rows) {
          grid[col.head][i] = { char: col.headChar, age: 0 };
        }

        if (col.head - tailLength > rows) {
          Object.assign(col, spawnColumn(speed));
        }
      }

      ctx.globalAlpha = 1;
      ctx.fillStyle = canvasColor;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      ctx.fillStyle = lime;
      for (let r = 0; r < rows; r++) {
        const row = grid[r];
        const y = r * CELL_HEIGHT;
        for (let c = 0; c < numCols; c++) {
          const cell = row[c];
          if (cell === null) continue;
          const fade = 1 - cell.age / tailLength;
          if (fade <= 0) continue;
          ctx.globalAlpha = headAlpha * fade;
          ctx.fillText(cell.char, c * cellWidth, y);
        }
      }
      ctx.globalAlpha = 1;

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
  }, [canvasRef, headAlpha, tailLength, frameIntervalMs, speed, density]);
}
