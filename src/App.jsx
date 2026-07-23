import Shell from './components/layout/Shell.jsx';
import Section from './components/layout/Section.jsx';
import Caret from './components/effects/Caret.jsx';
import Typewriter from './components/effects/Typewriter/Typewriter.jsx';
import './App.css';

function App() {
  return (
    <Shell>
      <Section id="hero" tone="dark">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[1.2px] text-[var(--color-ink-soft)]">
          $&gt; portfolio --init
        </p>

        <h1 className="text-[72px] font-bold leading-none tracking-[-2px] text-[var(--color-ink)]">
          <Typewriter text="Hello, world." speed={70} />
        </h1>

        <p className="mt-10 text-[18px] text-[var(--color-text-mute)]">
          <span className="text-[var(--color-ink-mute)]">&gt;&nbsp;</span>
          booting terminal
          <Caret />
        </p>
      </Section>

      <Section id="band" tone="surface">
        <p className="mb-3 text-[11px] font-bold uppercase tracking-[1.2px] text-[var(--color-ink-soft)]">
          $&gt; section --tone=surface
        </p>
        <p className="text-[15px] text-[var(--color-text-mute)]">
          A surface band sits one tier up from the canvas — used for content-heavy sections like Projects and Contact.
        </p>
      </Section>
    </Shell>
  );
}

export default App;
