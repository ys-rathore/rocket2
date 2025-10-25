import { motion } from 'motion/react';
import { GlowButton } from './GlowButton';
import { Sparkles, Code2, Zap } from 'lucide-react';

export function HeroSection() {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 backdrop-blur-sm mb-8"
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-purple-300">Future Tech Revolution</span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 text-white"
        >
          <span className="block mb-2">Hi, I'm an</span>
          <span className="block bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            IT Student & Innovator
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8 text-slate-300 max-w-3xl mx-auto"
        >
          Join me on a journey to revolutionize the tech industry. Together, we'll build innovative solutions, 
          break boundaries, and create the future we dream of. The revolution starts with us.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mb-12"
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <Code2 className="w-6 h-6 text-blue-400" />
            <div className="text-left">
              <div className="text-white">Passion</div>
              <div className="text-slate-400">for Innovation</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <Zap className="w-6 h-6 text-purple-400" />
            <div className="text-left">
              <div className="text-white">Driven</div>
              <div className="text-slate-400">to Excel</div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
            <Sparkles className="w-6 h-6 text-cyan-400" />
            <div className="text-left">
              <div className="text-white">Ready</div>
              <div className="text-slate-400">to Transform</div>
            </div>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6"
        >
          <GlowButton onClick={() => scrollToSection('vision')}>
            Join the Revolution
          </GlowButton>
          <GlowButton variant="secondary" onClick={() => scrollToSection('contact')}>
            Connect With Me
          </GlowButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            <div className="w-6 h-10 border-2 border-purple-400/50 rounded-full flex justify-center">
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
