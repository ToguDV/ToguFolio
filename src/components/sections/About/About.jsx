import Section from '../../layout/Section.jsx';
import Eyebrow from '../../ui/Eyebrow.jsx';
import Heading from '../../ui/Heading.jsx';
import AboutTerminal from './AboutTerminal.jsx';
import styles from './About.module.css';

export default function About({ id = 'about' }) {
  return (
    <Section id={id} tone="dark">
      <header className={styles.body}>
        <Eyebrow>cat about.txt</Eyebrow>
        <Heading level={2} text="About" typewriter />
        <p>
          I build web interfaces that feel calm, fast, and predictable. I care
          about typography, accessibility, and small file sizes. I prefer
          standards over frameworks when the framework gets in the way.
        </p>
        <p>
          Outside of code I read sci-fi, take long walks, and keep a wiki of
          things I want to learn next.
        </p>
      </header>

      <div className={styles.terminal}>
        <AboutTerminal />
      </div>
    </Section>
  );
}
