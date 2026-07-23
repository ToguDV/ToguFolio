import Caret from './components/effects/Caret.jsx';
import Typewriter from './components/effects/Typewriter/Typewriter.jsx';
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] p-12">
      <div className="mx-auto max-w-3xl">
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
      </div>
    </div>
  );
}

export default App;
