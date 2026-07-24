const STYLES = {
  base: 'inline-flex items-center gap-2 font-mono font-bold uppercase tracking-[1.2px] border-0 cursor-pointer no-underline',
  primary:
    'text-[length:var(--text-body-md)] px-5 py-3 bg-[color:var(--color-cta-bg)] text-[color:var(--color-cta-text)]',
  ghost:
    'text-[length:var(--text-body-md)] px-5 py-3 bg-transparent text-[color:var(--color-ink)] border border-[color:var(--color-hairline-soft)]',
  arrow: 'text-[color:var(--color-ink-mute)]',
};

export default function Button({
  href,
  variant = 'primary',
  children,
  className = '',
  ...rest
}) {
  const classes = [STYLES.base, STYLES[variant] ?? STYLES.primary, className]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <span className={STYLES.arrow} aria-hidden="true">
        &gt;&nbsp;
      </span>
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {inner}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {inner}
    </button>
  );
}
