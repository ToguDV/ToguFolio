import Section from '../../layout/Section.jsx';
import Eyebrow from '../../ui/Eyebrow.jsx';
import Heading from '../../ui/Heading.jsx';
import Button from '../../ui/Button.jsx';
import Link from '../../ui/Link.jsx';

export default function Contact({ id = 'contact' }) {
  return (
    <Section id={id} tone="surface">
      <header className="mb-8 flex flex-col gap-3">
        <Eyebrow>mail --to me</Eyebrow>
        <Heading level={2} text="Get in touch" typewriter />
        <p className="m-0 text-[length:var(--text-body-lg)] leading-[1.5] text-[color:var(--color-text)]">
          The fastest way to reach me is email. I read everything within a
          day or two. If it&rsquo;s a contract, send the brief; if it&rsquo;s a
          question, send the question.
        </p>
      </header>

      <div className="flex flex-col gap-3">
        <Button href="mailto:hello@example.com" variant="primary">
          hello@example.com
        </Button>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="https://github.com/example" external>
            github.com/example
          </Link>
          <Link href="https://linkedin.com/in/example" external>
            linkedin.com/in/example
          </Link>
        </div>
      </div>
    </Section>
  );
}
