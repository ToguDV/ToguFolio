import Section from '../../layout/Section.jsx';
import Typewriter from '../../effects/Typewriter/Typewriter.jsx';
import HeroAscii from './HeroAscii.jsx';
import styles from './Hero.module.css';

export default function Hero({ id = 'hero' }) {
  return (
    <Section id={id} tone="dark" className={styles.hero}>
      <p className={styles.eyebrow}>
        <span className={styles.prompt}>$&gt;</span> portfolio --init
      </p>

      <h1 className={styles.headline}>
        <Typewriter text="Hello, world." speed={70} />
      </h1>

      <p className={styles.lede}>
        <span className={styles.arrow}>&gt;&nbsp;</span>
        Software engineer building reliable web interfaces, one commit at a time.
      </p>

      <div className={styles.ascii}>
        <HeroAscii />
      </div>
    </Section>
  );
}
