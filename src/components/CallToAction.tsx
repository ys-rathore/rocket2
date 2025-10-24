import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { GlowButton } from './GlowButton';
import { ArrowRight, Github, Linkedin, Mail, Twitter } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function CallToAction() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="contact" className="py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden border border-white/10 mb-16"
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1545886082-e66c6b9e011a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHlvdXRofGVufDF8fHx8MTc2MTMwODAwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Team collaboration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/95 via-blue-900/95 to-purple-900/95" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="mb-6 text-white">Ready to Change the World?</h2>
              <p className="text-slate-200 max-w-3xl mx-auto mb-8">
                The future of technology is being written right now. Don't just watch from the sidelines—
                be part of the revolution. Let's build something incredible together.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <GlowButton>
                  Join the Movement <ArrowRight className="inline-block ml-2 w-5 h-5" />
                </GlowButton>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto"
            >
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  100+
                </div>
                <div className="text-slate-300">Projects Envisioned</div>
              </div>
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  ∞
                </div>
                <div className="text-slate-300">Possibilities Ahead</div>
              </div>
              <div className="p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                <div className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  1
                </div>
                <div className="text-slate-300">Shared Vision</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Contact options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <h3 className="mb-6 text-white">Let's Connect</h3>
          <p className="text-slate-300 mb-8">
            Reach out on any platform. I'm always excited to connect with fellow innovators.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { icon: Mail, label: 'Email', color: 'hover:bg-purple-500/10 hover:border-purple-500/50' },
              { icon: Github, label: 'GitHub', color: 'hover:bg-blue-500/10 hover:border-blue-500/50' },
              { icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-cyan-500/10 hover:border-cyan-500/50' },
              { icon: Twitter, label: 'Twitter', color: 'hover:bg-purple-500/10 hover:border-purple-500/50' }
            ].map((social, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-300 ${social.color}`}
              >
                <social.icon className="w-5 h-5 text-white" />
                <span className="text-white">{social.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
