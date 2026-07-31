import { useRef } from 'react';
import useAsciiConstellation from './useAsciiConstellation.js';
import styles from './AsciiConstellation.module.css';

export default function AsciiConstellation({ className = '', onShootingStar }) {
  const canvasRef = useRef(null);
  useAsciiConstellation(canvasRef, { onShootingStar });

  return (
    <div
      className={[styles.layer, className].filter(Boolean).join(' ')}
    >
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        aria-hidden="true"
      />
    </div>
  );
}
