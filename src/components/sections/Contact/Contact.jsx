import Section from '../../layout/Section.jsx';
import Eyebrow from '../../ui/Eyebrow.jsx';
import Heading from '../../ui/Heading.jsx';
import CommandList from '../../ui/CommandList.jsx';
import Keycap from '../../ui/Keycap.jsx';
import AsciiFrameAnimator from '../../effects/AsciiFrameAnimator/AsciiFrameAnimator.jsx';
import { BUNNY_IDLE, BUNNY_ANGRY_FRAMES, BUNNY_SPEECH } from '../../../data/animals.js';

export default function Contact({ id = 'contact' }) {
  return (
    <Section id={id} tone="soft">
      <div className="relative">
        <header className="mb-8 flex flex-col gap-3 pr-16 sm:pr-40">
          <Eyebrow>mail --to me</Eyebrow>
          <Heading level={2} text="Get in touch" typewriter />
          <p className="m-0 text-[length:var(--text-body-lg)] leading-[1.5] text-[color:var(--color-text)]">
            The fastest way to reach me is email. I read everything within a
            day or two. If it&rsquo;s a contract, send the brief; if it&rsquo;s a
            question, send the question.
          </p>
        </header>

        <div className="flex flex-col gap-3">
          <CommandList prompt="$ mail ">
            <Keycap href="mailto:hello@example.com" variant="primary">
              hello@example.com
            </Keycap>
          </CommandList>
          <CommandList>
            <Keycap href="https://github.com/example" variant="primary" external>
              github.com/example
            </Keycap>
            <Keycap href="https://linkedin.com/in/example" variant="secondary" external>
              linkedin.com/in/example
            </Keycap>
          </CommandList>
        </div>

        <AsciiFrameAnimator
          idleFrame={BUNNY_IDLE}
          frames={BUNNY_ANGRY_FRAMES}
          fps={400}
          trigger="click"
          tone="ink-soft"
          ariaHidden={false}
          ariaLabel="Click to make the bunny angry"
          speechBubble={BUNNY_SPEECH}
          className="absolute top-0 right-0 z-10 hidden opacity-90 text-[12px] leading-[1.15] sm:block"
        />
      </div>
    </Section>
  );
}
