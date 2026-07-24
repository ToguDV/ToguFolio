const STYLES = [
  'inline-flex items-center',
  'font-mono',
  'text-[length:var(--text-caption)]',
  'px-2 py-[2px]',
  'border border-[color:var(--color-hairline-soft)]',
  'rounded-[var(--radius-sm)]',
  'text-[color:var(--color-text-mute)]',
  'bg-[color:var(--color-surface-raised)]',
].join(' ');

export default function Tag({ children, className = '' }) {
  return (
    <span className={[STYLES, className].filter(Boolean).join(' ')}>{children}</span>
  );
}
