import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function getPrefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

export default function useTypewriter(text, { speed = 35, startDelay = 200, start = true } = {}) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!start) {
      setDisplayed('');
      setDone(false);
      return;
    }

    if (getPrefersReducedMotion()) {
      setDisplayed(text);
      setDone(true);
      return;
    }

    setDisplayed('');
    setDone(false);

    let index = 0;
    let intervalId;

    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        index += 1;
        setDisplayed(text.slice(0, index));
        if (index >= text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay, start]);

  return { displayed, done };
}
