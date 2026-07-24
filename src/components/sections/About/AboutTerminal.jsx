import Caret from '../../effects/Caret.jsx';
import AsciiFrameAnimator from '../../effects/AsciiFrameAnimator/AsciiFrameAnimator.jsx';
import { ABOUT_OUTPUT } from '../../../data/ascii.js';
import { BEAR_SLEEPING_FRAMES } from '../../../data/animals.js';
import styles from './AboutTerminal.module.css';

export default function AboutTerminal() {
  return (
    <div className={styles.frame} aria-hidden="true">
      <div className={styles.bar}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.title}>~ / portfolio / about</span>
      </div>
      <pre className={styles.body}>
        {ABOUT_OUTPUT}
        {'\n'}
        <span className={styles.bear}>
          <AsciiFrameAnimator
            frames={BEAR_SLEEPING_FRAMES}
            fps={600}
            trigger="inView"
            tone="ink-soft"
          />
        </span>
        {'\n'}
        <Caret />
      </pre>
    </div>
  );
}
