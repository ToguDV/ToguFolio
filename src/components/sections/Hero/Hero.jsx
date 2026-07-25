import Section from '../../layout/Section.jsx';
import Typewriter from '../../effects/Typewriter/Typewriter.jsx';
import AsciiConstellation from '../../effects/AsciiConstellation/AsciiConstellation.jsx';
import AsciiBlock from '../../effects/AsciiBlock.jsx';
import AsciiFrameAnimator from '../../effects/AsciiFrameAnimator/AsciiFrameAnimator.jsx';
import CommandList from '../../ui/CommandList.jsx';
import Keycap from '../../ui/Keycap.jsx';
import { STICKMAN_TPOSE } from '../../../data/stickmans.js';
import { CAT_HERO_FRAMES } from '../../../data/animals.js';
import styles from './Hero.module.css';

export default function Hero({ id = 'hero' }) {
  return (
    <Section id={id} tone="dark" className={styles.hero}>
      <AsciiConstellation className={styles.constellation} />
      <div className={styles.content}>
        <p className={styles.eyebrow}>
          <span className={styles.prompt}>&gt;</span> portfolio --init
        </p>

        <h1 className={styles.headline}>
          <Typewriter text="Hello, world." speed={70} />
        </h1>

        <p className={styles.lede}>
          <span className={styles.arrow}>&gt;&nbsp;</span>
          Software engineer building reliable web interfaces, one commit at a time.
        </p>

        <div className={styles.bottom}>
          <CommandList prompt="$> ">
            <Keycap href="#projects" variant="primary" className={styles.cta}>
              view-projects
            </Keycap>
          </CommandList>
          <AsciiFrameAnimator
            frames={CAT_HERO_FRAMES}
            trigger="inView"
            tone="ink-soft"
            fps={400}
            className={styles.heroCat}
          />
        </div>

        <AsciiBlock tone="ink-soft" className={styles.stickman}>
          {STICKMAN_TPOSE}
        </AsciiBlock>
      </div>
    </Section>
  );
}
