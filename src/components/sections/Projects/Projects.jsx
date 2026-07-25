import Section from '../../layout/Section.jsx';
import Eyebrow from '../../ui/Eyebrow.jsx';
import Heading from '../../ui/Heading.jsx';
import ProjectCard from './ProjectCard.jsx';
import AsciiBlock from '../../effects/AsciiBlock.jsx';
import { projects } from '../../../data/projects.js';
import { STICKMAN_DASH } from '../../../data/stickmans.js';
import styles from './Projects.module.css';

export default function Projects({ id = 'projects' }) {
  return (
    <Section id={id} tone="soft" wide>
      <div className={styles.headerWrap}>
        <header className={styles.header}>
          <Eyebrow>ls --projects</Eyebrow>
          <Heading level={2} text="Projects" typewriter />
        </header>
        <AsciiBlock tone="ink-soft" className={styles.stickman}>
          {STICKMAN_DASH}
        </AsciiBlock>
      </div>

      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
}
