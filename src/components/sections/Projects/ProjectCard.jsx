import AsciiBlock from '../../effects/AsciiBlock.jsx';
import Keycap from '../../ui/Keycap.jsx';
import Tag from '../../ui/Tag.jsx';
import { PROJECT_ASCII } from '../../../data/ascii.js';
import styles from './ProjectCard.module.css';

const STATUS_TONE = {
  live: styles.statusLive,
  wip: styles.statusWip,
  archived: styles.statusArchived,
};

const STATUS_LABEL = {
  live: 'live',
  wip: 'wip',
  archived: 'archived',
};

export default function ProjectCard({ project }) {
  const { title, description, stack, status, url, repo } = project;
  const statusTone = STATUS_TONE[status] ?? STATUS_TONE.live;

  return (
    <article className={styles.card}>
      <div className={styles.preview}>
        <AsciiBlock tone="ink-soft">{PROJECT_ASCII}</AsciiBlock>
        <span className={[styles.status, statusTone].filter(Boolean).join(' ')}>
          {STATUS_LABEL[status] ?? status}
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>

        <ul className={styles.stack} aria-label="tech stack">
          {stack.map((tech) => (
            <li key={tech}>
              <Tag>{tech}</Tag>
            </li>
          ))}
        </ul>

        <div className={styles.links}>
          {url || repo ? (
            <span className={styles.linksArrow} aria-hidden="true">
              &gt;&nbsp;
            </span>
          ) : null}
          {url ? <Keycap href={url} variant="primary" external>tour</Keycap> : null}
          {repo ? <Keycap href={repo} variant="secondary" external>source</Keycap> : null}
        </div>
      </div>
    </article>
  );
}
