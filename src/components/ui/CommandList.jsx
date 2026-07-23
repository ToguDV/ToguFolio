import styles from './CommandList.module.css';

const DEFAULT_PROMPT = '> ';

export default function CommandList({
  prompt = DEFAULT_PROMPT,
  children,
  className = '',
  ...rest
}) {
  const hasContent = Array.isArray(children)
    ? children.some(Boolean)
    : Boolean(children);

  const showPrompt = Boolean(prompt) && hasContent;
  const promptText = typeof prompt === 'string' ? prompt : DEFAULT_PROMPT;

  const classes = [styles.list, className].filter(Boolean).join(' ');

  return (
    <div className={classes} {...rest}>
      {showPrompt ? (
        <span className={styles.prompt} aria-hidden="true">
          {promptText}
        </span>
      ) : null}
      {children}
    </div>
  );
}
