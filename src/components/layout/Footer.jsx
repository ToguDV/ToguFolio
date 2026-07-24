import AsciiFrameAnimator from '../effects/AsciiFrameAnimator/AsciiFrameAnimator.jsx';
import { CAT_COFFEE_FRAMES } from '../../data/animals.js';
import styles from './Footer.module.css';

const BUILD_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <span>
            <span className={styles.prompt}>$&gt;</span> built with react + vite
            <span className={styles.dim}> // no images, no analytics, no tracking</span>
          </span>
          <span className={styles.dim}>
            &copy; {BUILD_YEAR} // last deploy: {new Date().toISOString().slice(0, 10)}
          </span>
        </div>
        <div className={styles.row}>
          <a
            className={styles.link}
            href="https://github.com/example"
            rel="noopener noreferrer"
            target="_blank"
          >
            &gt; github
          </a>
          <a
            className={styles.link}
            href="https://linkedin.com/in/example"
            rel="noopener noreferrer"
            target="_blank"
          >
            &gt; linkedin
          </a>
        </div>
        <div className={styles.row}>
          <span>
            <span className={styles.prompt}>&gt;</span> ascii frames:{' '}
            <a
              className={styles.link}
              href="https://github.com/ts-animal/ts-animal"
              rel="noopener noreferrer"
              target="_blank"
            >
              ts-animal
            </a>{' '}
            <span className={styles.dim}>(mit)</span>
          </span>
        </div>
        <div className={[styles.row, styles.signoff].filter(Boolean).join(' ')}>
          <AsciiFrameAnimator
            frames={CAT_COFFEE_FRAMES}
            fps={500}
            trigger="always"
            tone="ink-soft"
            ariaHidden
          />
        </div>
      </div>
    </footer>
  );
}
