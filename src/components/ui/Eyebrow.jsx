const STYLES = {
  base: [
    'm-0',
    'font-mono',
    'text-[length:var(--text-eyebrow)]',
    'font-bold',
    'uppercase',
    'tracking-[1.2px]',
    'text-[color:var(--color-ink-soft)]',
  ].join(' '),
  prompt: 'text-[color:var(--color-ink)] mr-1',
};

export default function Eyebrow({ prompt = '$>', children, className = '' }) {
  return (
    <p className={[STYLES.base, className].filter(Boolean).join(' ')}>
      <span className={STYLES.prompt} aria-hidden="true">
        {prompt}
      </span>
      <span>{children}</span>
    </p>
  );
}
