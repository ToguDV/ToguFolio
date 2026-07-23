import AsciiBlock from '../../effects/AsciiBlock.jsx';
import { HERO_ASCII } from '../../../data/ascii.js';

export default function HeroAscii() {
  return <AsciiBlock tone="ink">{HERO_ASCII}</AsciiBlock>;
}
