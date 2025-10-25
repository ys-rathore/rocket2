import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { NewHero } from './components/NewHero';
import { AboutSection } from './components/AboutSection';
import { NewSkillsSection } from './components/NewSkillsSection';
import { ContactSection } from './components/ContactSection';
import { MeshBackground } from './components/MeshBackground';
import { ScrollAnimated3D } from './components/ScrollAnimated3D';
import { LenisScroll } from './components/LenisScroll';
import { StudyPage } from './components/StudyPage';
import { Sun } from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const [showStudy, setShowStudy] = useState(false);

  useEffect(() => {
    // Check URL path for study page
    if (window.location.pathname === '/study') {
      setShowStudy(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  if (showStudy) {
    return (
      <LenisScroll>
        <StudyPage isDark={isDark} onThemeToggle={toggleTheme} />
      </LenisScroll>
    );
  }

  return (
    <LenisScroll>
      <div 
        className={`min-h-screen ${
          isDark ? 'bg-black text-white' : 'bg-white text-black'
        } overflow-x-hidden transition-colors duration-300`} 
        style={{ position: 'relative', zIndex: 0 }}
      >
        {/* Mesh Background - covers entire page */}
        <MeshBackground />
        
        {/* 3D Scroll Animated Objects */}
        <ScrollAnimated3D />

        {/* Navigation */}
        <Navigation isDark={isDark} onThemeToggle={toggleTheme} />
        
        {/* Main content */}
        <main style={{ position: 'relative', zIndex: 2 }}>
          <NewHero isDark={isDark} />
          <AboutSection isDark={isDark} />
          <NewSkillsSection isDark={isDark} />
          <ContactSection isDark={isDark} />
        </main>

        {/* Footer */}
        <footer 
          className={`border-t ${
            isDark ? 'border-white/10' : 'border-black/10'
          } py-8 px-6`} 
          style={{ position: 'relative', zIndex: 2 }}
        >
          <div className="max-w-7xl mx-auto flex justify-center">
            <Sun className="w-6 h-6 text-yellow-400" />
          </div>
        </footer>
      </div>
    </LenisScroll>
  );
}