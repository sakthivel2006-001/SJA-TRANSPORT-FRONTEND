import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AchievementCounterProps {
  end: number;
  label: string;
  suffix?: string;
}

const AchievementCounter: React.FC<AchievementCounterProps> = ({ end, label, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const duration = 2000; // 2 seconds

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // easeOutQuart
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOut * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end]);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="text-4xl md:text-5xl font-heading font-bold text-primary mb-2">
        {count}{suffix}
      </div>
      <div className="text-text/80 font-medium">{label}</div>
    </motion.div>
  );
};

export default AchievementCounter;
