import styles from './Caret.module.css';

export default function Caret({ done = false }) {
  return (
    <span
      className={done ? `${styles.caret} ${styles.done}` : styles.caret}
      aria-hidden="true"
    />
  );
}
