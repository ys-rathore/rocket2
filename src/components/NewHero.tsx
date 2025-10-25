import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { personalInfo } from '../config/personal-info';
import { AnimatedName } from './AnimatedName';

interface NewHeroProps {
  isDark: boolean;
}

export function NewHero({ isDark }: NewHeroProps) {
  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Spotlight effect */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className={`absolute inset-0 ${
          isDark 
            ? 'bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.15),transparent_50%)]'
            : 'bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.08),transparent_50%)]'
        }`}
      />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
            isDark 
              ? 'border-purple-500/30 bg-purple-500/5' 
              : 'border-purple-600/30 bg-purple-600/5'
          } backdrop-blur-sm mb-8`}
        >
          <Sparkles className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          <span className={`text-sm ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
            Available for Collaboration
          </span>
        </motion.div>

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="mb-6">
            <span className={`block mb-4 text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Hi, I'm
            </span>
            <AnimatedName name={personalInfo.name} isDark={isDark} />
          </div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-2xl md:text-3xl mb-4 mt-8 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}
          >
            {personalInfo.title}
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`text-lg max-w-2xl mx-auto mb-12 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
          >
            {personalInfo.tagline}
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToContact}
            className={`group inline-flex items-center gap-2 px-8 py-4 rounded-full transition-all duration-300 ${
              isDark 
                ? 'bg-white text-black hover:shadow-2xl hover:shadow-white/20' 
                : 'bg-black text-white hover:shadow-2xl hover:shadow-black/20'
            }`}
          >
            <span>Start the Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-600'}`}
          >
            Scroll to explore
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className={`absolute top-1/4 right-1/4 w-96 h-96 border rounded-full ${
          isDark ? 'border-purple-500/10' : 'border-purple-600/10'
        }`}
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className={`absolute bottom-1/4 left-1/4 w-64 h-64 border rounded-full ${
          isDark ? 'border-blue-500/10' : 'border-blue-600/10'
        }`}
      />
    </section>
  );
}