import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { personalInfo } from '../config/personal-info';

export function NewSkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section id="skills" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-block px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/5 mb-6">
            <span className="text-purple-400 text-sm">Expertise</span>
          </div>
          <h2 className="text-4xl md:text-6xl text-white mb-4">
            Skills & Technologies
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Constantly evolving and mastering the tools that shape the digital world
          </p>
        </motion.div>

        {/* Skills display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {personalInfo.skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg text-white">{skill.name}</h3>
                <span className="text-slate-400 tabular-nums">{skill.level}%</span>
              </div>
              
              {/* Progress bar */}
              <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={isInView ? { width: `${skill.level}%` } : {}}
                  transition={{ duration: 1.5, delay: 0.2 + index * 0.1, ease: "easeOut" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full"
                >
                  {/* Shine effect */}
                  <motion.div
                    animate={{
                      x: ['-100%', '200%']
                    }}
                    transition={{
                      duration: 2,
                      delay: 0.5 + index * 0.1,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-slate-300">Always learning, always growing</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
