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
  idleFrame = '',
  ariaLabel = 'Toggle animation',
  speechBubble = '',
  speechBubbleWhen = 'idle',
  onClick,
}) {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [inViewRef, isInView] = useInView({ rootMargin: '0px', threshold: 0.2 });

  let playing = false;
  if (trigger === 'hover') playing = hovered;
  else if (trigger === 'inView') playing = isInView;
  else if (trigger === 'always') playing = true;
  else if (trigger === 'click') playing = clicked;

  const current = useFrameAnimator({ frames, fps, playing });
  const toneClass = styles[`tone_${tone.replace('-', '')}`] ?? styles.tone_ink;

  const renderFrame = !playing && idleFrame ? idleFrame : current;

  const showBubble = !!speechBubble && (
    speechBubbleWhen === 'always'
      ? true
      : speechBubbleWhen === 'never'
        ? false
        : speechBubbleWhen === 'playing'
          ? playing
          : !playing
  );

  const bubbleText =
    typeof speechBubble === 'object' && speechBubble !== null
      ? (playing ? speechBubble.playing : speechBubble.idle)
      : speechBubble;

  const wrapperProps = {
    className: [
      styles.wrapper,
      styles[`trigger_${trigger}`],
      showBubble ? styles.hasBubble : null,
      className,
    ]
      .filter(Boolean)
      .join(' '),
  };

  if (trigger === 'hover') {
    wrapperProps.onMouseEnter = () => setHovered(true);
    wrapperProps.onMouseLeave = () => setHovered(false);
    wrapperProps.onFocus = () => setHovered(true);
    wrapperProps.onBlur = () => setHovered(false);
    wrapperProps.tabIndex = 0;
  } else if (trigger === 'inView') {
    wrapperProps.ref = inViewRef;
  } else if (trigger === 'click') {
    wrapperProps.role = 'button';
    wrapperProps.tabIndex = 0;
    wrapperProps['aria-label'] = ariaLabel;
    wrapperProps['aria-pressed'] = clicked;
    wrapperProps.onClick = (e) => {
      setClicked(true);
      onClick?.(e);
    };
    wrapperProps.onKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setClicked(true);
        onClick?.(e);
      }
    };
  }

  return (
    <div {...wrapperProps}>
      {showBubble && (
        <pre
          aria-hidden="true"
          className={[styles.bubble, toneClass].join(' ')}
        >
          {bubbleText}
        </pre>
      )}
      <pre
        key={renderFrame}
        aria-hidden={ariaHidden}
        className={[styles.frame, toneClass].join(' ')}
      >
        {renderFrame}
      </pre>
    </div>
  );
}
