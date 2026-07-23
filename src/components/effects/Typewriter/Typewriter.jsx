import Caret from '../Caret.jsx';
import useTypewriter from './useTypewriter.js';

export default function Typewriter({ text, speed, startDelay }) {
  const { displayed, done } = useTypewriter(text, { speed, startDelay });

  return (
    <span>
      {displayed}
      {!done && <Caret />}
    </span>
  );
}
