import { useEffect } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

const DEFAULTS = {
  nodeCount: 38,
  hubCount: 6,
  linkDistance: 150,
  mouseRadius: 200,
  mouseAttract: 0.45,
  drift: 0.08,
  baseLinkAlpha: 0.18,
  hoverLinkAlpha: 0.95,
  anchorAlpha: 0.7,
  fps: 60,
};

const TIER_GLYPHS = [
  ['0', '1'],
  ['#', '$', '%', '&', '@', '◇', '0', '1'],
  [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '+', '-', '*', '/', '=', '?', '!', '|', '~', '^',
    'ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ', 'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ', 'ｻ', 'ｼ', 'ｽ', 'ｾ', 'ｿ',
    'ﾀ', 'ﾁ', 'ﾂ', 'ﾃ', 'ﾄ', 'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ', 'ﾊ', 'ﾋ', 'ﾌ', 'ﾍ', 'ﾎ',
    'ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ', 'ﾔ', 'ﾕ', 'ﾖ', 'ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ', 'ﾜ', 'ﾝ',
  ],
  ['·', '∘', '∶', '°', '⋅', '∴'],
];

const TIER_ALPHA = [0.85, 0.6, 0.45, 0.3];
const TIER_FONT = ['20px', '15px', '12px', '10px'];

function pickFrom(tier) {
  const arr = TIER_GLYPHS[tier];
  return arr[Math.floor(Math.random() * arr.length)];
}

function rand(min, max) {
  return min + Math.random() * (max - min);
}

function readVar(name, fallback) {
  if (typeof window === 'undefined') return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function makeNodes(count, hubCount, w, h) {
  const nodes = [];
  const cx = w / 2;
  const cy = h / 2;

  for (let i = 0; i < hubCount; i++) {
    const angle = (i / hubCount) * Math.PI * 2 + rand(0, 0.6);
    const r = Math.min(w, h) * rand(0.18, 0.32);
    nodes.push({
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05,
      tier: 0,
      phase: Math.random() * Math.PI * 2,
      glyph: pickFrom(0),
    });
  }

  for (let i = hubCount; i < count; i++) {
    const tr = Math.random();
    const tier = tr < 0.35 ? 1 : tr < 0.78 ? 2 : 3;
    nodes.push({
      x: rand(20, w - 20),
      y: rand(20, h - 20),
      vx: (Math.random() - 0.5) * 0.16,
      vy: (Math.random() - 0.5) * 0.16,
      tier,
      phase: Math.random() * Math.PI * 2,
      glyph: pickFrom(tier),
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
    nodeCount, hubCount, linkDistance, mouseRadius, mouseAttract,
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
    let lastFontTier = -1;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      if (nodes.length === 0) {
        nodes = makeNodes(nodeCount, hubCount, width, height);
      } else {
        for (const n of nodes) {
          n.x = Math.min(Math.max(n.x, 0), width);
          n.y = Math.min(Math.max(n.y, 0), height);
        }
      }

      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      lastFontTier = -1;
    }

    function setFont(tier) {
      if (tier === lastFontTier) return;
      ctx.font = `${TIER_FONT[tier]} "JetBrains Mono", ui-monospace, Menlo, monospace`;
      lastFontTier = tier;
    }

    function update(dt) {
      const target = mouse.active ? 1 : 0;
      mouse.intensity += (target - mouse.intensity) * 0.14;
      if (Math.abs(mouse.intensity - target) < 0.001) mouse.intensity = target;

      const i = mouse.intensity;
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0) { n.x = 0; n.vx = -n.vx; }
        if (n.x > width) { n.x = width; n.vx = -n.vx; }
        if (n.y < 0) { n.y = 0; n.vy = -n.vy; }
        if (n.y > height) { n.y = height; n.vy = -n.vy; }
        n.phase += dt * 0.0014;

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
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
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
      const baseAlpha = TIER_ALPHA[n.tier];
      let alpha = baseAlpha + 0.08 * Math.sin(n.phase);
      let sizeMult = 1;

      const i = mouse.intensity;
      if (i > 0.05) {
        const d = Math.hypot(mouse.x - n.x, mouse.y - n.y);
        if (d < mouseRadius) {
          const boost = 1 - d / mouseRadius;
          alpha = Math.min(1, alpha + boost * 0.5 * i);
          sizeMult = 1 + boost * 0.75 * i;
        }
      }

      setFont(n.tier);
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

    function drawCursor() {
      const i = mouse.intensity;
      if (i < 0.05) return;

      ctx.globalAlpha = 0.22 * i;
      ctx.strokeStyle = softInk;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, mouseRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = 0.7 * i;
      ctx.strokeStyle = softInk;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = 0.85 * i;
      ctx.strokeStyle = softInk;
      ctx.lineWidth = 1.4;
      const s = 12;
      ctx.beginPath();
      ctx.moveTo(mouse.x - s, mouse.y);
      ctx.lineTo(mouse.x + s, mouse.y);
      ctx.moveTo(mouse.x, mouse.y - s);
      ctx.lineTo(mouse.x, mouse.y + s);
      ctx.stroke();
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

      drawCursor();

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
    canvasRef, nodeCount, hubCount, linkDistance, mouseRadius, mouseAttract,
    drift, baseLinkAlpha, hoverLinkAlpha, anchorAlpha, fps,
  ]);
}
