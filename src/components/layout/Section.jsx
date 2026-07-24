const TONES = {
  dark: 'bg-[var(--color-canvas)]',
  soft: 'bg-[var(--color-surface-soft)]',
  surface: 'bg-[var(--color-surface)]',
};

export default function Section({ id, tone = 'dark', children, className = '', wide = false }) {
  return (
    <section
      id={id}
      className={[
        TONES[tone] ?? TONES.dark,
        'py-[var(--section-padding-y)]',
        'scroll-mt-[var(--nav-height)]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={[
          'mx-auto px-[var(--section-padding-x)]',
          wide ? null : 'max-w-3xl',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {children}
      </div>
    </section>
  );
}
