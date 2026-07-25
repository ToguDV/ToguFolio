import useAsciiCursor from './useAsciiCursor';
import styles from './AsciiCursor.module.css';

const GLYPHS = {
  default: '@',
  interactive: '◆',
  text: '┃',
};

export default function AsciiCursor() {
  const { ref, active, mode, pressed, visible } = useAsciiCursor();
  if (!active) return null;
  const glyph = GLYPHS[mode] || GLYPHS.default;
  const glyphClass = [
    styles.glyph,
    styles[mode],
    pressed ? styles.pressed : '',
    visible ? '' : styles.hidden,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <span ref={ref} className={styles.positioner} aria-hidden="true">
      <span className={glyphClass}>{glyph}</span>
    </span>
  );
}
