import { useEffect, useRef, useState } from 'react';

const POINTER_QUERY = '(pointer: fine)';
const REDUCE_QUERY = '(prefers-reduced-motion: reduce)';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], summary, label, [tabindex]:not([tabindex="-1"])';

const IGNORE_SELECTOR = '[data-ascii-cursor-ignore]';

const TEXT_INPUT_SELECTOR =
  'input[type="text"], input[type="email"], input[type="search"], input[type="url"], input[type="tel"], input[type="password"], input[type="number"], input:not([type]), textarea, [contenteditable=""], [contenteditable="true"]';

function mql(query) {
  if (typeof window === 'undefined' || !window.matchMedia) return null;
  return window.matchMedia(query);
}

export default function useAsciiCursor() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const [mode, setMode] = useState('default');
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const pointerMql = mql(POINTER_QUERY);
    const reduceMql = mql(REDUCE_QUERY);
    const evaluate = () => {
      const fine = pointerMql ? pointerMql.matches : true;
      const reduced = reduceMql ? reduceMql.matches : false;
      setActive(fine && !reduced);
    };
    evaluate();
    pointerMql?.addEventListener('change', evaluate);
    reduceMql?.addEventListener('change', evaluate);
    return () => {
      pointerMql?.removeEventListener('change', evaluate);
      reduceMql?.removeEventListener('change', evaluate);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (active) root.dataset.asciiCursor = '';
    else delete root.dataset.asciiCursor;
    return () => {
      delete root.dataset.asciiCursor;
    };
  }, [active]);

  useEffect(() => {
    if (!active) return undefined;

    let rafId = 0;
    let pending = false;
    let lastX = -100;
    let lastY = -100;
    let lastMode = 'default';
    let lastVisible = false;
    let inDocument = true;

    const flush = () => {
      pending = false;
      const node = ref.current;
      if (node) {
        node.style.transform = `translate3d(${lastX}px, ${lastY}px, 0)`;
      }
      const stack =
        typeof document.elementsFromPoint === 'function'
          ? document.elementsFromPoint(lastX, lastY)
          : [];
      const ignored = stack.some(
        (n) => n && n.closest && n.closest(IGNORE_SELECTOR)
      );
      const nextVisible = inDocument && !ignored;
      const el = stack[0] || null;
      const target =
        el && el.closest ? el.closest(INTERACTIVE_SELECTOR) : null;
      let nextMode = 'default';
      if (target && !ignored) {
        if (target.matches(TEXT_INPUT_SELECTOR)) nextMode = 'text';
        else nextMode = 'interactive';
      }
      if (nextMode !== lastMode) {
        lastMode = nextMode;
        setMode(nextMode);
      }
      if (nextVisible !== lastVisible) {
        lastVisible = nextVisible;
        setVisible(nextVisible);
      }
    };

    const schedule = () => {
      if (pending) return;
      pending = true;
      rafId = requestAnimationFrame(flush);
    };

    const onMove = (event) => {
      lastX = event.clientX;
      lastY = event.clientY;
      const node = ref.current;
      if (node) {
        node.style.transform = `translate3d(${lastX}px, ${lastY}px, 0)`;
      }
      schedule();
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const onLeaveDoc = (event) => {
      if (event.relatedTarget == null) {
        inDocument = false;
        if (lastVisible) {
          lastVisible = false;
          setVisible(false);
        }
      }
    };
    const onEnterDoc = () => {
      inDocument = true;
      schedule();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeaveDoc);
    document.addEventListener('mouseenter', onEnterDoc);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeaveDoc);
      document.removeEventListener('mouseenter', onEnterDoc);
    };
  }, [active]);

  return { ref, active, mode, pressed, visible };
}
