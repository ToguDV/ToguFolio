export default function Shell({ children, className = '' }) {
  return (
    <div
      className={[
        'flex min-h-screen flex-col bg-[var(--color-canvas)] text-[var(--color-text)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
