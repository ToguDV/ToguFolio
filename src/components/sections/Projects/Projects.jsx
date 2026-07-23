import Section from '../../layout/Section.jsx';
import Eyebrow from '../../ui/Eyebrow.jsx';
import Heading from '../../ui/Heading.jsx';
import ProjectCard from './ProjectCard.jsx';
import { projects } from '../../../data/projects.js';
import styles from './Projects.module.css';

export default function Projects({ id = 'projects' }) {
  return (
    <Section id={id} tone="surface" className="max-w-5xl">
      <header className={styles.header}>
        <Eyebrow>ls --projects</Eyebrow>
        <Heading level={2} text="Projects" typewriter />
      </header>

      <div className={styles.grid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  );
}
