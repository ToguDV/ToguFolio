export const projects = [
  {
    id: 'ghost-design-system',
    title: 'ghost-design-system',
    description:
      'A token-first dark theme for documentation sites. CSS custom properties only, no preprocessor. Ships with a matrix-rain hero and a typewriter reveal.',
    stack: ['css', 'design-tokens', 'a11y'],
    status: 'live',
    url: 'https://example.com/ghost',
    repo: 'https://github.com/example/ghost',
  },
  {
    id: 'terminal-portfolio',
    title: 'terminal-portfolio',
    description:
      'This site. A single page styled as a terminal session — ASCII art, monospaced typography, no raster images. Built with Vite, React 19, and Tailwind v4.',
    stack: ['react', 'vite', 'tailwind'],
    status: 'live',
    url: null,
    repo: 'https://github.com/example/terminal-portfolio',
  },
  {
    id: 'cli-task-runner',
    title: 'cli-task-runner',
    description:
      'A small task runner for repetitive dev chores. Reads a toml file, runs commands in parallel, streams output. Zero deps beyond the std lib.',
    stack: ['node', 'commander', 'esm'],
    status: 'wip',
    url: null,
    repo: 'https://github.com/example/cli-task-runner',
  },
  {
    id: 'ascii-renderer',
    title: 'ascii-renderer',
    description:
      'Renders SVG/PNG to ASCII art in the browser. WebGL shader under the hood, no servers, no upload. Still in private alpha.',
    stack: ['webgl', 'typescript', 'canvas'],
    status: 'archived',
    url: null,
    repo: 'https://github.com/example/ascii-renderer',
  },
];
