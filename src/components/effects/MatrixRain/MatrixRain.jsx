import { useRef } from 'react';
import useMatrixRain from './useMatrixRain.js';
import styles from './MatrixRain.module.css';

export default function MatrixRain() {
  const canvasRef = useRef(null);
  useMatrixRain(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className={styles.canvas}
      aria-hidden="true"
    />
  );
}
