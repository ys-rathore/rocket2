import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function AnimatedName({ name }: { name: string }) {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    // Random glitch effect
    const interval = setInterval(() => {
      setGlitchActive(true);
      setTimeout(() => setGlitchActive(false), 200);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nameParts = name.split(' ');

  return (
    <div className="relative inline-block">
      {/* Main text with gradient and glow */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative"
      >
        <h1 className="text-6xl md:text-8xl lg:text-9xl tracking-tight leading-none text-center">
          {nameParts.map((part, index) => (
            <motion.div
              key={index}
              className="relative inline-block"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
            >
              {/* Glow layers */}
              <span
                className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent blur-2xl opacity-50"
                aria-hidden="true"
              >
                {part}
              </span>
              
              {/* Main gradient text */}
              <span
                className="relative bg-gradient-to-r from-purple-400 via-blue-300 to-cyan-300 bg-clip-text text-transparent"
                style={{
                  WebkitTextStroke: '1px rgba(255,255,255,0.1)',
                  textShadow: '0 0 80px rgba(139, 92, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'
                }}
              >
                {part}
              </span>

              {/* Glitch effect overlay */}
              {glitchActive && (
                <>
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-400 bg-clip-text text-transparent opacity-70"
                    style={{
                      transform: 'translate(-2px, 2px)',
                      clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)'
                    }}
                    aria-hidden="true"
                  >
                    {part}
                  </span>
                  <span
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-400 bg-clip-text text-transparent opacity-70"
                    style={{
                      transform: 'translate(2px, -2px)',
                      clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)'
                    }}
                    aria-hidden="true"
                  >
                    {part}
                  </span>
                </>
              )}

              {/* Animated shine effect */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent bg-clip-text text-transparent opacity-0"
                animate={{
                  x: ['-200%', '200%'],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 3,
                  delay: index * 0.5 + 1,
                  repeat: Infinity,
                  repeatDelay: 5
                }}
                aria-hidden="true"
              >
                {part}
              </motion.span>
              
              {index < nameParts.length - 1 && <span className="inline-block w-4" />}
            </motion.div>
          ))}
        </h1>
      </motion.div>

      {/* Floating particles around name */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(139, 92, 246, 0.05) 50%)',
          backgroundSize: '100% 4px'
        }}
        animate={{
          y: ['0%', '100%']
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
    </div>
  );
}
