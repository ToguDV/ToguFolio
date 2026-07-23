import styles from './AsciiBlock.module.css';

const TONES = {
  ink: styles.ink,
  'ink-soft': styles.inkSoft,
  'ink-mute': styles.inkMute,
};

export default function AsciiBlock({ children, tone = 'ink', className = '' }) {
  return (
    <pre
      aria-hidden="true"
      className={[styles.ascii, TONES[tone] ?? TONES.ink, className]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </pre>
  );
}
