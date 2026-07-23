import { useRef } from 'react';
import useMatrixRain from './useMatrixRain.js';
import styles from './MatrixRain.module.css';

export default function MatrixRain({ headAlpha, fadeAlpha, tailLength, frameIntervalMs, speed, density, className = '' }) {
  const canvasRef = useRef(null);
  useMatrixRain(canvasRef, { headAlpha, fadeAlpha, tailLength, frameIntervalMs, speed, density });

  return (
    <canvas
      ref={canvasRef}
      className={[styles.canvas, className].filter(Boolean).join(' ')}
      aria-hidden="true"
    />
  );
}
