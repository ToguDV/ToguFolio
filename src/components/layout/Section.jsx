const TONES = {
  dark: 'bg-[var(--color-canvas)]',
  surface: 'bg-[var(--color-surface)]',
};

export default function Section({ id, tone = 'dark', children, className = '' }) {
  return (
    <section
      id={id}
      className={[
        TONES[tone] ?? TONES.dark,
        'py-[var(--section-padding-y)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="mx-auto max-w-3xl px-[var(--section-padding-x)]">
        {children}
      </div>
    </section>
  );
}
