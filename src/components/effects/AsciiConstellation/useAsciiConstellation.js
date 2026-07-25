import { useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

const DEFAULTS = {
  nodeCount: 38,
  linkDistance: 150,
  mouseRadius: 200,
  mouseAttract: 0.45,
  drift: 0.08,
  baseLinkAlpha: 0.42,
  hoverLinkAlpha: 0.95,
  anchorAlpha: 0.7,
  fps: 60,
};

const GLYPHS = [
  '0', '1'
];

const NODE_ALPHA = 0.6;
const NODE_FONT = '14px "JetBrains Mono", ui-monospace, Menlo, monospace';
const TWINKLE_INTERVAL_MIN = 220;
const TWINKLE_INTERVAL_MAX = 900;
const TWINKLE_DURATION_MIN = 180;
const TWINKLE_DURATION_MAX = 700;
const TWINKLE_BURST_MIN = 1;
const TWINKLE_BURST_MAX = 3;

function pickGlyph() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function readVar(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function makeNodes(count, w, h) {
  const nodes = [];
  for (let i = 0; i < count; i++) {
    nodes.push({
      x: rand(20, w - 20),
      y: rand(20, h - 20),
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      phase: Math.random() * Math.PI * 2,
      glyph: pickGlyph(),
      twinkle: 0,
      twinkleDur: 1,
    });
  }
  return nodes;
}

function findSection(start) {
  let el = start;
  while (el) {
    if (el.tagName === 'SECTION') return el;
    el = el.parentElement;
  }
  return null;
}

export default function useAsciiConstellation(canvasRef, options = {}) {
  const {
    nodeCount, linkDistance, mouseRadius, mouseAttract,
    drift, baseLinkAlpha, hoverLinkAlpha, anchorAlpha, fps,
  } = { ...DEFAULTS, ...options };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ink = readVar('--color-ink', '#d1ff19');
    const softInk = readVar('--color-ink-soft', '#a3e635');
    const dpr = window.devicePixelRatio || 1;

    const reduced = prefersReducedMotion();
    const frameInterval = 1000 / fps;

    let width = 0;
    let height = 0;
    let nodes = [];
    const mouse = { x: -9999, y: -9999, active: false, intensity: 0 };
    let raf = 0;
    let lastTime = 0;
    let twinkleTimer = rand(TWINKLE_INTERVAL_MIN, TWINKLE_INTERVAL_MAX);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const newWidth = rect.width;
      const newHeight = rect.height;
      const widthChanged = newWidth !== width;

      width = newWidth;
      height = newHeight;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      ctx.font = NODE_FONT;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';

      if (nodes.length === 0 || widthChanged) {
        nodes = makeNodes(nodeCount, width, height);
      } else {
        for (const n of nodes) {
          n.x = Math.min(Math.max(n.x, 0), width);
          n.y = Math.min(Math.max(n.y, 0), height);
        }
      }
    }

    function update(dt) {
      const target = mouse.active ? 1 : 0;
      mouse.intensity += (target - mouse.intensity) * 0.14;
      if (Math.abs(mouse.intensity - target) < 0.001) mouse.intensity = target;

      twinkleTimer -= dt;
      if (twinkleTimer <= 0) {
        const burst = Math.floor(rand(TWINKLE_BURST_MIN, TWINKLE_BURST_MAX + 0.999));
        for (let b = 0; b < burst; b++) {
          const n = nodes[Math.floor(Math.random() * nodes.length)];
          n.twinkle = 1;
          n.twinkleDur = rand(TWINKLE_DURATION_MIN, TWINKLE_DURATION_MAX);
        }
        twinkleTimer = rand(TWINKLE_INTERVAL_MIN, TWINKLE_INTERVAL_MAX);
      }

      const i = mouse.intensity;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) { n.x = 0; n.vx = -n.vx; }
        if (n.x > width) { n.x = width; n.vx = -n.vx; }
        if (n.y < 0) { n.y = 0; n.vy = -n.vy; }
        if (n.y > height) { n.y = height; n.vy = -n.vy; }
        n.phase += dt * 0.0014;

        if (n.twinkle > 0) {
          n.twinkle = Math.max(0, n.twinkle - dt / n.twinkleDur);
        }

        if (i > 0.05) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < mouseRadius && d > 0.0001) {
            const f = (1 - d / mouseRadius) * mouseAttract * i;
            n.x += (dx / d) * f;
            n.y += (dy / d) * f;
          }
        }
      }
    }

    function drawLink(a, b) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.hypot(dx, dy);
      if (d > linkDistance) return;
      const proximity = 1 - d / linkDistance;
      let alpha = baseLinkAlpha * proximity;
      const i = mouse.intensity;
      if (i > 0.05) {
        const da = Math.hypot(mouse.x - a.x, mouse.y - a.y);
        const db = Math.hypot(mouse.x - b.x, mouse.y - b.y);
        const minMouse = Math.min(da, db);
        if (minMouse < mouseRadius) {
          const boost = 1 - minMouse / mouseRadius;
          alpha = Math.max(alpha, hoverLinkAlpha * boost * proximity * i);
        }
      }
      if (alpha < 0.01) return;

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = softInk;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    }

    function drawAnchor(n) {
      const i = mouse.intensity;
      if (i < 0.05) return;
      const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
      if (d > mouseRadius) return;
      const proximity = 1 - d / mouseRadius;
      const alpha = anchorAlpha * proximity * i;
      if (alpha < 0.01) return;

      ctx.globalAlpha = alpha;
      ctx.strokeStyle = softInk;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(n.x, n.y);
      ctx.stroke();
    }

    function drawNode(n) {
      let alpha = NODE_ALPHA + 0.08 * Math.sin(n.phase);
      let sizeMult = 1;

      if (n.twinkle > 0) {
        alpha = Math.min(1, alpha + n.twinkle * 0.5);
        sizeMult = 1 + n.twinkle * 0.5;
      }

      const i = mouse.intensity;
      if (i > 0.05) {
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        if (d < mouseRadius) {
          const boost = 1 - d / mouseRadius;
          alpha = Math.min(1, alpha + boost * 0.5 * i);
          sizeMult = 1 + boost * 0.75 * i;
        }
      }

      ctx.globalAlpha = alpha;
      ctx.fillStyle = ink;

      if (sizeMult > 1.001) {
        ctx.save();
        ctx.translate(n.x, n.y);
        ctx.scale(sizeMult, sizeMult);
        ctx.fillText(n.glyph, 0, 0);
        ctx.restore();
      } else {
        ctx.fillText(n.glyph, n.x, n.y);
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          drawLink(nodes[i], nodes[j]);
        }
      }

      for (const n of nodes) {
        drawAnchor(n);
      }

      for (const n of nodes) {
        drawNode(n);
      }

      ctx.globalAlpha = 1;
    }

    function frame(time) {
      if (time - lastTime < frameInterval) {
        raf = requestAnimationFrame(frame);
        return;
      }
      const dt = time - lastTime;
      lastTime = time;
      if (!reduced) update(dt);
      draw();
      raf = requestAnimationFrame(frame);
    }

    function pointFromEvent(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = clientX - rect.left;
      mouse.y = clientY - rect.top;
      mouse.active = true;
    }

    function onMouseMove(e) { pointFromEvent(e.clientX, e.clientY); }
    function onMouseLeave() { mouse.active = false; }
    function onTouchMove(e) {
      if (e.touches.length === 0) return;
      pointFromEvent(e.touches[0].clientX, e.touches[0].clientY);
    }
    function onTouchEnd() { mouse.active = false; }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const target = findSection(canvas) || canvas.parentElement || canvas;
    target.addEventListener('mousemove', onMouseMove);
    target.addEventListener('mouseleave', onMouseLeave);
    target.addEventListener('touchmove', onTouchMove, { passive: true });
    target.addEventListener('touchend', onTouchEnd);
    target.addEventListener('touchcancel', onTouchEnd);

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      target.removeEventListener('mousemove', onMouseMove);
      target.removeEventListener('mouseleave', onMouseLeave);
      target.removeEventListener('touchmove', onTouchMove);
      target.removeEventListener('touchend', onTouchEnd);
      target.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [
    canvasRef, nodeCount, linkDistance, mouseRadius, mouseAttract,
    drift, baseLinkAlpha, hoverLinkAlpha, anchorAlpha, fps,
  ]);
}
