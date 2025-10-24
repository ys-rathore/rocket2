import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';
import { personalInfo } from '../config/personal-info';
import { Mail, Github, Linkedin, Twitter, Globe, ArrowUpRight } from 'lucide-react';

const socialIcons = {
  email: Mail,
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  portfolio: Globe
};

// Function to extract display name from URL
const getDisplayName = (key: string, value: string) => {
  if (key === 'email') return value;
  if (key === 'github' && value.includes('github.com/')) {
    return value.split('github.com/')[1];
  }
  if (key === 'linkedin' && value.includes('linkedin.com/in/')) {
    return value.split('linkedin.com/in/')[1];
  }
  if (key === 'twitter' && value.includes('twitter.com/')) {
    return value.split('twitter.com/')[1];
  }
  return value;
};

export function ContactSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const openLink = (url: string) => {
    if (url.includes('@')) {
      window.location.href = `mailto:${url}`;
    } else {
      window.open(url, '_blank');
    }
  };

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden" ref={ref}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-purple-950/30 to-transparent" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-7xl text-white mb-6 leading-tight">
            {personalInfo.cta.title}
          </h2>
          <p className="text-2xl text-slate-400 mb-12">
            {personalInfo.cta.subtitle}
          </p>
        </motion.div>

        {/* Contact cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {Object.entries(personalInfo.contact).map(([key, value], index) => {
            const Icon = socialIcons[key as keyof typeof socialIcons];
            const label = key.charAt(0).toUpperCase() + key.slice(1);
            const displayName = getDisplayName(key, value);
            
            return (
              <motion.button
                key={key}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={() => openLink(value)}
                className="group relative p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm hover:border-white/30 transition-all duration-300 text-left"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 rounded-2xl transition-all duration-300" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/5 group-hover:bg-white/10 flex items-center justify-center transition-colors">
                      {Icon && <Icon className="w-6 h-6 text-purple-400" />}
                    </div>
                    <div>
                      <div className="text-slate-400 text-sm mb-1">{label}</div>
                      <div className="text-white truncate">{displayName}</div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Final message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center"
        >
          <div className="inline-block p-8 rounded-3xl border border-white/10 bg-gradient-to-br from-purple-500/5 to-blue-500/5 backdrop-blur-sm">
            <p className="text-slate-300 text-lg mb-4">
              "The best way to predict the future is to create it."
            </p>
            <p className="text-slate-500">
              Let's build something extraordinary together 🚀
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative grid */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]" />
    </section>
  );
}