import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Truck } from 'lucide-react';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  const animationDuration = 2; // 2 seconds
  const initialDelay = 0.5; // wait 0.5s for text fade in before truck starts

  useEffect(() => {
    const totalTime = (initialDelay + animationDuration + 0.5) * 1000;
    const timer = setTimeout(() => {
      onComplete();
    }, totalTime);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] bg-[#0F172A] flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="w-full max-w-sm px-6 flex flex-col items-center">
        {/* Company Name */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-5xl font-bold mb-12 flex items-center gap-3 tracking-wide"
        >
          <span className="text-white">SJA</span>
          <span className="text-[#D4AF37]">TRANSPORT</span>
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-300 text-sm md:text-base font-medium mb-8"
        >
          Loading your journey...
        </motion.div>

        {/* Progress Bar Container */}
        <div className="w-full relative h-12 flex items-end pb-2">
          {/* Truck Icon */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { x: 0, opacity: 0 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { x: '100%', opacity: 1 }}
            transition={{
              x: { duration: animationDuration, ease: "easeInOut", delay: initialDelay },
              opacity: { duration: 0.3, delay: initialDelay }
            }}
            className="absolute bottom-3 left-0 z-10 text-white flex items-center justify-start"
            style={{ width: 'calc(100% - 24px)' }} // Container for the truck to traverse
          >
            <Truck size={24} className="text-white" />
          </motion.div>

          {/* Progress Bar Background */}
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden relative">
            {/* Progress Bar Fill */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { width: '0%', opacity: 1 }}
              animate={shouldReduceMotion ? { opacity: 1, width: '100%' } : { width: '100%' }}
              transition={{
                width: { duration: animationDuration, ease: "easeInOut", delay: initialDelay },
                opacity: { duration: 0.5 }
              }}
              className="h-full bg-[#D4AF37] rounded-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Preloader;
