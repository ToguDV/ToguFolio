import MatrixRain from '../effects/MatrixRain/MatrixRain.jsx';
import styles from './BandDivider.module.css';

const SUBTLE = {
  headAlpha: 0.5,
  tailLength: 14,
  frameIntervalMs: 55,
  speed: 0.3,
  density: 0.5,
};

const GRADIENTS = {
  light: 'linear-gradient(to bottom, var(--color-surface-soft) 0%, transparent 100%)',
  dark: 'linear-gradient(to top, var(--color-surface-soft) 0%, transparent 100%)',
};

export default function BandDivider({ label, intensity = 'subtle', tone = 'light' }) {
  const rainProps = intensity === 'subtle' ? SUBTLE : undefined;

  return (
    <div className={styles.band} aria-hidden="true">
      <MatrixRain {...rainProps} className={styles.maskedRain} />
      <div className={styles.gradient} style={{ background: GRADIENTS[tone] }} />
      {label ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
}
