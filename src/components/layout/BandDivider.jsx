import MatrixRain from '../effects/MatrixRain/MatrixRain.jsx';
import styles from './BandDivider.module.css';

const SUBTLE = {
  headAlpha: 0.1,
  tailLength: 14,
  frameIntervalMs: 55,
  speed: 0.3,
  density: 0.5,
};

export default function BandDivider({ label, intensity = 'subtle' }) {
  const rainProps = intensity === 'subtle' ? SUBTLE : undefined;

  return (
    <div className={styles.band} aria-hidden="true">
      <MatrixRain {...rainProps} className={styles.maskedRain} />
      {label ? <span className={styles.label}>{label}</span> : null}
    </div>
  );
}
