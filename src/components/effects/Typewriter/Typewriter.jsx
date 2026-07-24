import { useEffect, useState } from 'react';
import Caret from '../Caret.jsx';
import useInView from '../../../hooks/useInView.js';
import useTypewriter from './useTypewriter.js';

export default function Typewriter({ text, speed, startDelay, rootMargin, threshold }) {
  const [ref, isInView] = useInView({ rootMargin, threshold });
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (isInView) setArmed(true);
  }, [isInView]);

  const { displayed, done } = useTypewriter(text, { speed, startDelay, start: armed });

  return (
    <span ref={ref}>
      {displayed}
      <Caret done={done} />
    </span>
  );
}
