import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { personalInfo } from '../config/personal-info';
import { Target, Users, Lightbulb, TrendingUp } from 'lucide-react';

const iconMap = {
  Innovation: Lightbulb,
  Collaboration: Users,
  Impact: Target,
  Learning: TrendingUp
};

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="about" className="py-32 px-6 relative" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center"
        >
          <div className="inline-block px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 mb-6">
            <span className="text-purple-400 text-sm">My Mission</span>
          </div>
          <h2 className="text-4xl md:text-6xl text-white mb-8 max-w-4xl mx-auto leading-tight">
            {personalInfo.mission}
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            {personalInfo.bio}
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personalInfo.values.map((value, index) => {
            const Icon = iconMap[value.title as keyof typeof iconMap] || Target;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <div className="relative p-8 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-white/20 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl text-white mb-2">{value.title}</h3>
                  <p className="text-slate-400">{value.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] border border-white/5 rounded-full"
        />
      </div>
    </section>
  );
}
