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
  const modeRef = useRef('default');

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

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

    const setModeIfChanged = (next) => {
      if (modeRef.current !== next) {
        modeRef.current = next;
        setMode(next);
      }
    };

    const onMove = (event) => {
      const x = event.clientX;
      const y = event.clientY;
      if (ref.current) {
        ref.current.style.transform =
          'translate3d(' +
          x +
          'px,' +
          y +
          'px,0) translate(-50%,-50%)';
      }
      const stack =
        typeof document.elementsFromPoint === 'function'
          ? document.elementsFromPoint(x, y)
          : [];
      const ignored = stack.some(
        (node) => node && node.closest && node.closest(IGNORE_SELECTOR)
      );
      if (ignored) {
        setVisible(false);
        return;
      }
      const el = stack[0] || null;
      const target = el && el.closest ? el.closest(INTERACTIVE_SELECTOR) : null;
      let next = 'default';
      if (target) {
        if (target.matches(TEXT_INPUT_SELECTOR)) next = 'text';
        else next = 'interactive';
      }
      setModeIfChanged(next);
      setVisible(true);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    const onLeaveDoc = (event) => {
      if (event.relatedTarget == null) setVisible(false);
    };
    const onEnterDoc = () => setVisible(true);

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    window.addEventListener('pointerup', onUp, { passive: true });
    document.addEventListener('mouseleave', onLeaveDoc);
    document.addEventListener('mouseenter', onEnterDoc);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeaveDoc);
      document.removeEventListener('mouseenter', onEnterDoc);
    };
  }, [active]);

  return { ref, active, mode, pressed, visible };
}
