import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { personalInfo } from '../config/personal-info';

interface NavigationProps {
  isDark?: boolean;
  onThemeToggle?: () => void;
}

export function Navigation({ isDark = true, onThemeToggle }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (id === 'study') {
      window.location.href = '/study';
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'study', label: 'Study' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? `${isDark ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-lg border-b ${isDark ? 'border-white/10' : 'border-black/10'}` 
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              onClick={() => scrollToSection('home')}
              className={`text-2xl ${isDark ? 'text-white hover:text-purple-400' : 'text-black hover:text-purple-600'} transition-colors relative`}
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative inline-block">
                YUVRAJ SINGH
                <motion.span
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                />
              </span>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative group px-4 py-2 rounded-lg transition-all duration-300 ${
                    isDark 
                      ? 'text-slate-300 hover:text-white hover:bg-white/5' 
                      : 'text-slate-700 hover:text-black hover:bg-black/5'
                  }`}
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className={`absolute inset-0 rounded-lg border ${
                    isDark ? 'border-purple-500/0' : 'border-purple-600/0'
                  } group-hover:border-purple-500/50 transition-all duration-300`} />
                  <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 ${
                    isDark ? 'bg-purple-500' : 'bg-purple-600'
                  } group-hover:w-3/4 transition-all duration-300`} />
                </button>
              ))}
              
              {/* Theme Toggle */}
              <button
                onClick={onThemeToggle}
                className={`p-2 rounded-lg border ${
                  isDark 
                    ? 'border-white/10 hover:border-purple-500/50 text-white' 
                    : 'border-black/10 hover:border-purple-600/50 text-black'
                } transition-all`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden ${isDark ? 'text-white' : 'text-black'}`}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`fixed top-[73px] left-0 right-0 ${
            isDark ? 'bg-black/95' : 'bg-white/95'
          } backdrop-blur-lg border-b ${
            isDark ? 'border-white/10' : 'border-black/10'
          } z-40 md:hidden`}
        >
          <div className="px-6 py-4 space-y-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`block w-full text-left ${
                  isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-black'
                } transition-colors py-2`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={onThemeToggle}
              className={`flex items-center gap-2 w-full text-left ${
                isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-black'
              } transition-colors py-2`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}