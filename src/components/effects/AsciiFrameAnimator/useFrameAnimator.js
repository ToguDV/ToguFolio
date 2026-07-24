import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia(QUERY).matches;
}

export default function useFrameAnimator({ frames, fps = 350, playing }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!playing || frames.length <= 1) {
      setIndex(0);
      return undefined;
    }
    if (prefersReducedMotion()) {
      setIndex(0);
      return undefined;
    }

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % frames.length);
    }, fps);

    return () => clearInterval(id);
  }, [playing, frames.length, fps]);

  return frames[index] ?? '';
}
