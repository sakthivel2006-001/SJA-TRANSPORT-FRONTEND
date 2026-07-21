import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';

import bgImg from '../assets/ChatGPT Image Jul 20, 2026, 11_16_41 PM.webp';

const Hero: React.FC = () => {
  // Scroll Parallax
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 1000], [0, 250]);
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="relative min-h-[75vh] md:min-h-[100vh] flex flex-col justify-center overflow-hidden bg-[#0F172A]">
      {/* Desktop Background with scroll parallax */}
      <motion.div
        className="absolute inset-0 z-0 origin-center hidden md:block"
        style={{ y: yBg }}
      >
        <img
          src={bgImg}
          alt="Transport background"
          className="w-full h-[120%] object-cover object-center"
          style={{ filter: 'brightness(1.18) contrast(1.05) saturate(1.05)' }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(8,15,30,0.70) 0%, rgba(8,15,30,0.45) 45%, rgba(8,15,30,0.15) 100%)' }}></div>
      </motion.div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 md:px-8 relative z-20 flex-1 flex flex-col justify-center pt-24 pb-8 md:py-20">
        
        {/* Text Content */}
        <div className="w-full max-w-4xl flex flex-col items-center md:items-start text-center md:text-left mt-0 md:mt-16">
          <motion.div
            initial={{ opacity: 0, y: isMobile ? 10 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0.6 : 1.2, ease: "easeOut" }}
            className="w-full"
          >
            <h1 className="text-[42px] sm:text-[50px] md:text-[88px] lg:text-[110px] font-heading font-black leading-[1.05] tracking-[0.03em] whitespace-pre-line drop-shadow-[0_4px_10px_rgba(0,0,0,0.6)]">
              <span className="flex flex-col items-center md:items-start">
                <span className="text-white">SJA</span>
                <span className="text-[#D4AF37]">TRANSPORT</span>
              </span>
            </h1>

            <motion.h2 
              initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.6 : 1, delay: isMobile ? 0.2 : 0.5, ease: "easeOut" }}
              className="text-[12px] sm:text-sm md:text-2xl lg:text-3xl font-medium text-white tracking-[0.2em] md:tracking-[0.3em] mt-6 md:mt-10 flex items-center justify-center md:justify-start gap-2 md:gap-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap"
            >
              SAFE <span className="text-[#D4AF37] text-lg md:text-3xl leading-none">•</span> FAST <span className="text-[#D4AF37] text-lg md:text-3xl leading-none">•</span> RELIABLE
            </motion.h2>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: isMobile ? 10 : 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0.6 : 0.8, delay: isMobile ? 0.4 : 0.8, ease: "easeOut" }}
            className="flex flex-col md:flex-row gap-4 md:gap-6 mt-10 md:mt-16 w-[90%] sm:w-auto"
          >
            <Link 
              to="/book"
              className="group flex items-center justify-center gap-3 w-full md:w-auto px-10 py-4 md:py-5 bg-[#D4AF37] text-[#0F172A] text-base md:text-lg font-bold rounded-sm shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] hover:bg-white transition-all duration-500 transform hover:-translate-y-1 overflow-hidden relative min-h-[48px]"
            >
              <div className="absolute inset-0 w-0 bg-white transition-all duration-[250ms] ease-out group-hover:w-full -z-10"></div>
              <span>Book Shipment</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            <Link 
              to="/contact"
              className="group flex items-center justify-center gap-3 w-full md:w-auto px-10 py-4 md:py-5 bg-transparent backdrop-blur-sm text-white text-base md:text-lg font-bold rounded-sm border-2 border-white/50 hover:border-white transition-all duration-500 transform hover:-translate-y-1 relative overflow-hidden min-h-[48px]"
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-500"></div>
              <Phone className="w-5 h-5 md:w-6 md:h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>Contact Us</span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Truck Image */}
        {isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="w-full flex justify-center mt-10 md:hidden flex-1 items-end"
          >
            <img
              src={bgImg}
              alt="SJA Transport Truck"
              className="w-full max-w-[90%] h-auto object-contain drop-shadow-2xl rounded-lg max-h-[30vh]"
              style={{ filter: 'brightness(1.1) contrast(1.05)' }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Hero;
