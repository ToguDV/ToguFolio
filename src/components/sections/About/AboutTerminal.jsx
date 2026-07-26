import { useEffect, useRef, useState } from 'react';
import Caret from '../../effects/Caret.jsx';
import AsciiFrameAnimator from '../../effects/AsciiFrameAnimator/AsciiFrameAnimator.jsx';
import { ABOUT_OUTPUT_PREFIX, ABOUT_RESPONSES } from '../../../data/ascii.js';
import { BEAR_SLEEPING_FRAMES, BEAR_AWAKE_FRAMES } from '../../../data/animals.js';
import styles from './AboutTerminal.module.css';

const EXCHANGE_MS = 7000;

export default function AboutTerminal() {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const [response, setResponse] = useState(null);
  const inputRef = useRef(null);
  const exchangeTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (exchangeTimerRef.current) clearTimeout(exchangeTimerRef.current);
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = input.trim();
    if (!value) return;
    const next = ABOUT_RESPONSES[Math.floor(Math.random() * ABOUT_RESPONSES.length)];
    setSubmitted(value);
    setResponse(next);
    setInput('');
    if (exchangeTimerRef.current) clearTimeout(exchangeTimerRef.current);
    exchangeTimerRef.current = setTimeout(() => {
      setSubmitted(null);
      setResponse(null);
    }, EXCHANGE_MS);
    inputRef.current?.focus();
  };

  return (
    <div className={styles.frame}>
      <div className={styles.bar}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.title}>~ / portfolio / about</span>
      </div>
      <pre className={styles.body} onClick={() => inputRef.current?.focus()}>
        {ABOUT_OUTPUT_PREFIX}
        {'\n'}
        <span className={styles.bear}>
          <AsciiFrameAnimator
            frames={submitted ? BEAR_AWAKE_FRAMES : BEAR_SLEEPING_FRAMES}
            fps={submitted ? 800 : 600}
            trigger="inView"
            tone="ink-soft"
          />
        </span>
        {submitted && (
          <>
            {'\n'}
            <span className={styles.line}>$ {submitted}</span>
            {'\n'}
            <span className={styles.response} aria-live="polite">
              {response}
            </span>
          </>
        )}
        {'\n'}
        <form className={styles.form} onSubmit={handleSubmit}>
          <span className={styles.line}>$</span>
          <input
            ref={inputRef}
            type="text"
            className={styles.input}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            aria-label="Escribe un mensaje y pulsa Intro"
            spellCheck="false"
            autoComplete="off"
            autoCapitalize="off"
            size={Math.max(input.length, 1)}
          />
          <Caret />
        </form>
      </pre>
    </div>
  );
}
