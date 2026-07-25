import Shell from './components/layout/Shell.jsx';
import Nav from './components/layout/Nav.jsx';
import Footer from './components/layout/Footer.jsx';
import BandDivider from './components/layout/BandDivider.jsx';
import Hero from './components/sections/Hero/Hero.jsx';
import Projects from './components/sections/Projects/Projects.jsx';
import About from './components/sections/About/About.jsx';
import Contact from './components/sections/Contact/Contact.jsx';
import AsciiCursor from './components/effects/AsciiCursor/AsciiCursor.jsx';
import './App.css';

function App() {
  return (
    <Shell>
      <AsciiCursor />
      <Nav />
      <main>
        <Hero />
        <Projects />
        <BandDivider label="-- section --break" />
        <About />
        <BandDivider label="-- section --break" />
        <Contact />
      </main>
      <Footer />
    </Shell>
  );
}

export default App;
