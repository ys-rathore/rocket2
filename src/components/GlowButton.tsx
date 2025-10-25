import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ReactNode } from 'react';

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function GlowButton({ children, onClick, variant = 'primary', className = '' }: GlowButtonProps) {
  const isPrimary = variant === 'primary';
  
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group"
    >
      {/* Glow effect */}
      <div className={`absolute -inset-1 rounded-lg blur-lg opacity-75 group-hover:opacity-100 transition duration-500 ${
        isPrimary 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
          : 'bg-gradient-to-r from-cyan-600 to-purple-600'
      }`} />
      
      {/* Button */}
      <Button
        onClick={onClick}
        className={`relative px-8 py-6 ${
          isPrimary
            ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
            : 'bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-700 hover:to-purple-700'
        } border-0 text-white shadow-2xl transition-all duration-300 ${className}`}
      >
        <span className="relative z-10">{children}</span>
      </Button>
    </motion.div>
  );
}
