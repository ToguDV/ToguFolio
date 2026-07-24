import { useState } from 'react';
import useFrameAnimator from './useFrameAnimator.js';
import useInView from '../../../hooks/useInView.js';
import styles from './AsciiFrameAnimator.module.css';

export default function AsciiFrameAnimator({
  frames,
  fps = 350,
  trigger = 'hover',
  tone = 'ink',
  className = '',
  ariaHidden = true,
}) {
  const [hovered, setHovered] = useState(false);
  const [inViewRef, isInView] = useInView({ rootMargin: '0px', threshold: 0.2 });

  let playing = false;
  if (trigger === 'hover') playing = hovered;
  else if (trigger === 'inView') playing = isInView;
  else if (trigger === 'always') playing = true;

  const current = useFrameAnimator({ frames, fps, playing });
  const toneClass = styles[`tone_${tone.replace('-', '')}`] ?? styles.tone_ink;

  const wrapperProps = {
    className: [styles.wrapper, className].filter(Boolean).join(' '),
  };
  if (trigger === 'hover') {
    wrapperProps.onMouseEnter = () => setHovered(true);
    wrapperProps.onMouseLeave = () => setHovered(false);
    wrapperProps.onFocus = () => setHovered(true);
    wrapperProps.onBlur = () => setHovered(false);
    wrapperProps.tabIndex = 0;
  } else if (trigger === 'inView') {
    wrapperProps.ref = inViewRef;
  }

  return (
    <div {...wrapperProps}>
      <pre
        key={current}
        aria-hidden={ariaHidden}
        className={[styles.frame, toneClass].join(' ')}
      >
        {current}
      </pre>
    </div>
  );
}
