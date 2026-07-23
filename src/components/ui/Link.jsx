const STYLES = {
  base: 'inline-flex items-center gap-1 font-mono underline-offset-4 hover:underline',
  ink: 'text-[color:var(--color-ink)]',
  text: 'text-[color:var(--color-text)]',
  arrow: 'text-[color:var(--color-ink-mute)]',
};

export default function Link({ href, tone = 'ink', external = false, children, className = '', ...rest }) {
  const classes = [STYLES.base, STYLES[tone] ?? STYLES.ink, className]
    .filter(Boolean)
    .join(' ');

  const rel = external ? 'noopener noreferrer' : undefined;
  const target = external ? '_blank' : undefined;

  return (
    <a href={href} className={classes} rel={rel} target={target} {...rest}>
      <span className={STYLES.arrow} aria-hidden="true">
        &gt;&nbsp;
      </span>
      <span>{children}</span>
    </a>
  );
}
