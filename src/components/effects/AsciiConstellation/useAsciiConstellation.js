import { useEffect, useRef } from 'react';

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
const STAR_DELAY_FIRST_MIN = 2600;
const STAR_DELAY_FIRST_MAX = 4800;
const STAR_INTERVAL_MIN = 7000;
const STAR_INTERVAL_MAX = 14000;
const STAR_SPEED_MIN = 560;
const STAR_SPEED_MAX = 820;
const STAR_ANGLE_MIN = 0.3;
const STAR_ANGLE_MAX = 0.55;
const STAR_EDGE_PAD = 48;
const STAR_GLOW_RADIUS = 130;
const STAR_WAKE = 2.4;
const STAR_TWINKLE_MS = 520;
const STAR_TRAIL_MS = 260;
const STAR_TRAIL_GLYPHS = ['=', '-', '-', '.', '.', ',', "'", ' '];

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
    onShootingStar,
  } = { ...DEFAULTS, ...options };

  const onShootingStarRef = useRef(onShootingStar);
  useEffect(() => {
    onShootingStarRef.current = onShootingStar;
  }, [onShootingStar]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ink = readVar('--color-ink', '#f5c2e7');
    const softInk = readVar('--color-ink-soft', '#f2cdcd');
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
    let star = null;
    let starTimer = rand(STAR_DELAY_FIRST_MIN, STAR_DELAY_FIRST_MAX);

    function spawnStar() {
      const fromLeft = Math.random() < 0.5;
      const angle = rand(STAR_ANGLE_MIN, STAR_ANGLE_MAX);
      const speed = rand(STAR_SPEED_MIN, STAR_SPEED_MAX);
      const dir = fromLeft ? 1 : -1;
      const vx = Math.cos(angle) * speed * dir;
      const vy = Math.sin(angle) * speed;
      const y = rand(height * 0.06, height * 0.42);
      star = { x: fromLeft ? -STAR_EDGE_PAD : width + STAR_EDGE_PAD, y, vx, vy };

      const crossX = (width + STAR_EDGE_PAD * 2) / Math.abs(vx);
      const crossY = (height + STAR_EDGE_PAD - y) / vy;
      onShootingStarRef.current?.(Math.min(crossX, crossY) * 1000);
    }

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

      starTimer -= dt;
      if (!star && starTimer <= 0) spawnStar();

      if (star) {
        star.x += star.vx * (dt / 1000);
        star.y += star.vy * (dt / 1000);
        if (
          star.x < -STAR_EDGE_PAD || star.x > width + STAR_EDGE_PAD ||
          star.y > height + STAR_EDGE_PAD
        ) {
          star = null;
          starTimer = rand(STAR_INTERVAL_MIN, STAR_INTERVAL_MAX);
        } else {
          for (const n of nodes) {
            const dx = n.x - star.x;
            const dy = n.y - star.y;
            const d = Math.hypot(dx, dy);
            if (d < STAR_GLOW_RADIUS && d > 0.0001) {
              const boost = 1 - d / STAR_GLOW_RADIUS;
              if (boost * 1.15 > n.twinkle) {
                n.twinkle = Math.min(1, boost * 1.15);
                n.twinkleDur = Math.max(n.twinkleDur, STAR_TWINKLE_MS);
              }
              const f = boost * STAR_WAKE;
              n.x += (dx / d) * f;
              n.y += (dy / d) * f;
            }
          }
        }
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
      if (star) {
        const ds = Math.hypot(star.x - (a.x + b.x) * 0.5, star.y - (a.y + b.y) * 0.5);
        if (ds < STAR_GLOW_RADIUS) {
          const boost = 1 - ds / STAR_GLOW_RADIUS;
          alpha = Math.max(alpha, hoverLinkAlpha * boost * proximity);
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

    function drawStar() {
      if (!star) return;
      const speed = Math.hypot(star.vx, star.vy);
      if (speed < 0.0001) return;
      const ux = star.vx / speed;
      const uy = star.vy / speed;
      const trailLen = (speed * STAR_TRAIL_MS) / 1000;
      const steps = Math.max(4, Math.floor(trailLen / 9));

      for (let s = steps; s >= 1; s--) {
        const t = s / steps;
        const alpha = Math.pow(1 - t, 1.3) * 0.9;
        if (alpha < 0.02) continue;
        const glyph = STAR_TRAIL_GLYPHS[
          Math.min(STAR_TRAIL_GLYPHS.length - 1, Math.floor(t * STAR_TRAIL_GLYPHS.length))
        ];
        if (glyph === ' ') continue;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = s % 2 === 0 ? ink : softInk;
        ctx.fillText(glyph, star.x - ux * trailLen * t, star.y - uy * trailLen * t);
      }

      ctx.globalAlpha = 1;
      ctx.fillStyle = ink;
      ctx.save();
      ctx.translate(star.x, star.y);
      ctx.scale(1.4, 1.4);
      ctx.fillText('*', 0, 0);
      ctx.restore();
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

      drawStar();

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
