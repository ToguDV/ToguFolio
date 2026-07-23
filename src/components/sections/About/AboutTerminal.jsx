import Caret from '../../effects/Caret.jsx';
import { ABOUT_OUTPUT } from '../../../data/ascii.js';
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
        <Caret />
      </pre>
    </div>
  );
}
