import styles from './Footer.module.css';

const BUILD_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.row}>
          <span>
            <span className={styles.prompt}>$&gt;</span> built with react + vite
            <span className={styles.dim}> // no images, no analytics, no tracking</span>
          </span>
          <span className={styles.dim}>
            &copy; {BUILD_YEAR} // last deploy: {new Date().toISOString().slice(0, 10)}
          </span>
        </div>
        <div className={styles.row}>
          <a
            className={styles.link}
            href="https://github.com/example"
            rel="noopener noreferrer"
            target="_blank"
          >
            &gt; github
          </a>
          <a
            className={styles.link}
            href="https://linkedin.com/in/example"
            rel="noopener noreferrer"
            target="_blank"
          >
            &gt; linkedin
          </a>
        </div>
      </div>
    </footer>
  );
}
