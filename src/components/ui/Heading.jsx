import Typewriter from '../effects/Typewriter/Typewriter.jsx';

const STYLES = {
  1: [
    'm-0',
    'text-[color:var(--color-ink)]',
    'text-[length:var(--text-display-xl)]',
    'font-bold',
    'leading-[1]',
    'tracking-[-2px]',
  ].join(' '),
  2: [
    'm-0',
    'text-[color:var(--color-ink)]',
    'text-[length:var(--text-display-lg)]',
    'font-bold',
    'leading-[1.1]',
    'tracking-[-1px]',
  ].join(' '),
  3: [
    'm-0',
    'text-[color:var(--color-ink)]',
    'text-[length:var(--text-display-md)]',
    'font-bold',
    'leading-[1.2]',
    'tracking-[-0.5px]',
  ].join(' '),
};

export default function Heading({ level = 2, text, typewriter = false, children, className = '' }) {
  const Tag = level === 1 ? 'h1' : level === 3 ? 'h3' : 'h2';
  const content = typewriter && typeof text === 'string' ? <Typewriter text={text} /> : (text ?? children);

  return (
    <Tag className={[STYLES[level] ?? STYLES[2], className].filter(Boolean).join(' ')}>
      {content}
    </Tag>
  );
}
