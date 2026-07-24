import styles from './Nav.module.css';

const LINKS = [
  { href: '#projects', label: 'projects' },
  { href: '#about', label: 'about' },
  { href: '#contact', label: 'contact' },
];

export default function Nav() {
  return (
    <nav className={styles.nav} aria-label="Primary">
      <div className={styles.inner}>
        <a href="#hero" className={styles.brand}>
          ~/portfolio
        </a>
        <ul className={styles.links}>
          {LINKS.map((link) => (
            <li key={link.href}>
              <a className={styles.link} href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
