import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { Rocket, Users, Lightbulb, Target } from 'lucide-react';
import { Card } from './ui/card';

const visionCards = [
  {
    icon: Rocket,
    title: 'Innovation First',
    description: 'Pushing boundaries and exploring cutting-edge technologies to create solutions that matter.',
    color: 'from-purple-500 to-blue-500'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Building a network of passionate individuals who believe in the power of collaboration.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Lightbulb,
    title: 'Creative Solutions',
    description: 'Thinking outside the box to solve real-world problems with elegant and efficient code.',
    color: 'from-cyan-500 to-purple-500'
  },
  {
    icon: Target,
    title: 'Impact Focused',
    description: 'Creating technology that makes a difference and improves lives across the globe.',
    color: 'from-purple-500 to-pink-500'
  }
];

export function VisionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section id="vision" className="py-24 px-6" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="mb-4 text-white">The Vision</h2>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Technology isn't just about code—it's about creating a better future. 
            Here's what drives me to push forward every single day.
          </p>
        </motion.div>

        {/* Vision cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {visionCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group h-full p-6 bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10">
                <div className="relative mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} p-0.5`}>
                    <div className="w-full h-full bg-slate-900 rounded-lg flex items-center justify-center">
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <motion.div
                    className={`absolute inset-0 rounded-lg bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
                  />
                </div>
                <h3 className="mb-2 text-white">{card.title}</h3>
                <p className="text-slate-400">{card.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
