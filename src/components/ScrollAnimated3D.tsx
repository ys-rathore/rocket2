import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export function ScrollAnimated3D() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Different objects with different scroll speeds and paths
  const butterfly1Y = useTransform(scrollYProgress, [0, 1], ['-20%', '120%']);
  const butterfly1X = useTransform(scrollYProgress, [0, 0.5, 1], ['10%', '30%', '15%']);
  const butterfly1Rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
  
  const butterfly2Y = useTransform(scrollYProgress, [0, 1], ['-30%', '130%']);
  const butterfly2X = useTransform(scrollYProgress, [0, 0.5, 1], ['80%', '60%', '85%']);
  
  const particle1Y = useTransform(scrollYProgress, [0, 1], ['-10%', '110%']);
  const particle1X = useTransform(scrollYProgress, [0, 0.5, 1], ['50%', '70%', '45%']);
  
  const orb1Y = useTransform(scrollYProgress, [0, 1], ['-15%', '115%']);
  const orb1X = useTransform(scrollYProgress, [0, 0.5, 1], ['20%', '40%', '25%']);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 3 }}>
      {/* Animated Butterfly/Wasp 1 */}
      <motion.div
        style={{ 
          y: butterfly1Y, 
          x: butterfly1X,
          rotateZ: butterfly1Rotate
        }}
        className="absolute left-0 top-0"
      >
        <motion.svg
          width="80"
          height="80"
          viewBox="0 0 80 80"
          animate={{ 
            rotateY: [0, 15, 0, -15, 0],
            scale: [1, 1.1, 1, 1.1, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Wasp/Butterfly Design */}
          <defs>
            <linearGradient id="waspGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Wings */}
          <motion.ellipse
            cx="25"
            cy="35"
            rx="18"
            ry="25"
            fill="url(#waspGradient)"
            opacity="0.6"
            filter="url(#glow)"
            animate={{ 
              scaleY: [1, 0.8, 1],
              opacity: [0.6, 0.8, 0.6]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          <motion.ellipse
            cx="55"
            cy="35"
            rx="18"
            ry="25"
            fill="url(#waspGradient)"
            opacity="0.6"
            filter="url(#glow)"
            animate={{ 
              scaleY: [1, 0.8, 1],
              opacity: [0.6, 0.8, 0.6]
            }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
          
          {/* Body */}
          <ellipse cx="40" cy="40" rx="8" ry="20" fill="#1a1a1a" />
          <ellipse cx="40" cy="30" rx="6" ry="8" fill="#fbbf24" />
          <ellipse cx="40" cy="42" rx="7" ry="8" fill="#fbbf24" />
          <ellipse cx="40" cy="52" rx="6" ry="6" fill="#1a1a1a" />
          
          {/* Antennae */}
          <line x1="38" y1="25" x2="35" y2="18" stroke="#1a1a1a" strokeWidth="1.5" />
          <line x1="42" y1="25" x2="45" y2="18" stroke="#1a1a1a" strokeWidth="1.5" />
          <circle cx="35" cy="18" r="2" fill="#fbbf24" />
          <circle cx="45" cy="18" r="2" fill="#fbbf24" />
        </motion.svg>
      </motion.div>

      {/* Animated Butterfly 2 - Different design */}
      <motion.div
        style={{ 
          y: butterfly2Y, 
          x: butterfly2X
        }}
        className="absolute left-0 top-0"
      >
        <motion.svg
          width="70"
          height="70"
          viewBox="0 0 70 70"
          animate={{ 
            rotateY: [0, -15, 0, 15, 0],
            rotateZ: [0, 5, 0, -5, 0]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <defs>
            <linearGradient id="butterflyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          {/* Butterfly Wings */}
          <motion.path
            d="M 20 35 Q 10 20, 15 10 Q 20 15, 25 20 Q 22 28, 20 35"
            fill="url(#butterflyGradient)"
            filter="url(#glow)"
            animate={{ 
              scaleX: [1, 0.85, 1],
              opacity: [0.7, 0.9, 0.7]
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <motion.path
            d="M 50 35 Q 60 20, 55 10 Q 50 15, 45 20 Q 48 28, 50 35"
            fill="url(#butterflyGradient)"
            filter="url(#glow)"
            animate={{ 
              scaleX: [1, 0.85, 1],
              opacity: [0.7, 0.9, 0.7]
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          
          {/* Lower Wings */}
          <motion.path
            d="M 22 38 Q 8 45, 12 55 Q 18 50, 24 45 Q 23 42, 22 38"
            fill="url(#butterflyGradient)"
            opacity="0.8"
            filter="url(#glow)"
            animate={{ 
              scaleX: [1, 0.9, 1]
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          <motion.path
            d="M 48 38 Q 62 45, 58 55 Q 52 50, 46 45 Q 47 42, 48 38"
            fill="url(#butterflyGradient)"
            opacity="0.8"
            filter="url(#glow)"
            animate={{ 
              scaleX: [1, 0.9, 1]
            }}
            transition={{ duration: 0.6, repeat: Infinity }}
          />
          
          {/* Body */}
          <ellipse cx="35" cy="38" rx="4" ry="18" fill="#1a1a1a" />
          
          {/* Decorative spots */}
          <circle cx="17" cy="18" r="3" fill="#fbbf24" opacity="0.6" />
          <circle cx="53" cy="18" r="3" fill="#fbbf24" opacity="0.6" />
        </motion.svg>
      </motion.div>

      {/* Floating Energy Orb */}
      <motion.div
        style={{ 
          y: orb1Y, 
          x: orb1X
        }}
        className="absolute left-0 top-0"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.6, 0.9, 0.6]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="relative w-16 h-16"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 opacity-70 blur-xl" />
          <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 opacity-80" />
          <div className="absolute inset-4 rounded-full bg-white opacity-50" />
        </motion.div>
      </motion.div>

      {/* Geometric Particle */}
      <motion.div
        style={{ 
          y: particle1Y, 
          x: particle1X
        }}
        className="absolute left-0 top-0"
      >
        <motion.div
          animate={{ 
            rotateX: [0, 360],
            rotateY: [0, 360],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <defs>
              <linearGradient id="geomGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <polygon 
              points="30,5 55,20 55,40 30,55 5,40 5,20" 
              fill="url(#geomGradient)" 
              stroke="#fff" 
              strokeWidth="1"
              opacity="0.7"
              filter="url(#glow)"
            />
            <polygon 
              points="30,15 45,23 45,37 30,45 15,37 15,23" 
              fill="none" 
              stroke="#fff" 
              strokeWidth="1"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
