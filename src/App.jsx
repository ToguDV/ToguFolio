import Shell from './components/layout/Shell.jsx';
import Nav from './components/layout/Nav.jsx';
import Footer from './components/layout/Footer.jsx';
import Hero from './components/sections/Hero/Hero.jsx';
import Projects from './components/sections/Projects/Projects.jsx';
import About from './components/sections/About/About.jsx';
import Contact from './components/sections/Contact/Contact.jsx';
import './App.css';

function App() {
  return (
    <Shell>
      <Nav />
      <main>
        <Hero />
        <Projects />
        <About />
        <Contact />
      </main>
      <Footer />
    </Shell>
  );
}

export default App;
