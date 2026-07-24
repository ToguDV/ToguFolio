import styles from './Keycap.module.css';

const VARIANTS = {
  secondary: styles.secondary,
  primary: styles.primary,
};

export default function Keycap({
  href,
  variant = 'secondary',
  external = false,
  children,
  className = '',
  ...rest
}) {
  const classes = [styles.bracketed, VARIANTS[variant] ?? '', className]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <span aria-hidden="true">[</span>
      <span>{children}</span>
      <span aria-hidden="true">]</span>
    </>
  );

  if (href) {
    const rel = external ? 'noopener noreferrer' : undefined;
    const target = external ? '_blank' : undefined;
    return (
      <a href={href} className={classes} rel={rel} target={target} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
