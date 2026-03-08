"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from 'lucide-react';

export const BootSequence = ({ children }: { children: React.ReactNode }) => {
  const [isBooted, setIsBooted] = useState(false);

  // Simulate the 2-second system boot
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooted(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0C10] text-gray-400 font-sans selection:bg-[#D4AF37]/30 overflow-hidden flex flex-col items-center">
      {/* Background Noise Texture */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat" />

      <AnimatePresence mode="wait">
        {!isBooted ? (
          /* ================================
             SPLASH SCREEN (INITIAL STATE)
             ================================ */
          <motion.div
            key="splash"
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="relative z-10 flex h-screen w-screen flex-col items-center justify-center"
          >
            <motion.div layoutId="brand-container" className="flex flex-col items-center gap-6">
              <motion.div 
                layoutId="brand-icon-wrapper"
                className="bg-[#D4AF37] p-5 rounded-2xl shadow-[0_0_80px_rgba(212,175,55,0.6)]"
              >
                <Box size={64} className="text-[#0A0C10]" strokeWidth={2} />
              </motion.div>
              
              <motion.div layoutId="brand-text-wrapper" className="text-center">
                <h1 className="text-5xl md:text-7xl font-black tracking-[0.25em] text-white uppercase leading-none mb-2 drop-shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                  TRACE-ABILITY
                </h1>
                <p className="text-sm md:text-base text-[#D4AF37] uppercase tracking-[0.5em] font-bold opacity-80 animate-pulse">
                  System Initialization...
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          /* ================================
             MAIN DASHBOARD SHELL
             ================================ */
          <motion.div 
            key="dashboard"
            className="relative z-10 flex flex-col h-screen w-full max-w-[1600px]"
          >
            {/* STICKY HEADER */}
            <header className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-[#0A0C10]/80 backdrop-blur-md shrink-0">
              <motion.div layoutId="brand-container" className="flex items-center gap-5">
                <motion.div 
                  layoutId="brand-icon-wrapper"
                  className="bg-[#D4AF37] p-2.5 rounded-sm shadow-[0_0_25px_rgba(212,175,55,0.4)]"
                >
                  <Box size={28} className="text-[#0A0C10]" strokeWidth={2.5} />
                </motion.div>
                
                <motion.div layoutId="brand-text-wrapper">
                  <h1 className="text-3xl font-black tracking-[0.25em] text-white uppercase leading-none mb-1">
                    TRACE-ABILITY <span className="text-[#D4AF37] font-extralight italic text-2xl">SYSTEMS</span>
                  </h1>
                  <p className="text-[11px] text-[#D4AF37] uppercase tracking-[0.5em] font-bold opacity-80 mt-1">
                    Cognitive Engineering Hub
                  </p>
                </motion.div>
              </motion.div>

             <div className="hidden md:flex flex-col items-end text-right">
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.6 }}
                >
                  <p className="text-[12px] text-gray-300 uppercase tracking-[0.3em] mb-1">System Health</p>
                  <div className="flex items-center gap-2 justify-end">
                    
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <p className="text-lg font-black text-white tracking-widest uppercase">Operational</p>
                  </div>
                </motion.div>
              </div>
            </header>

            {/* MAIN CONTENT REVEAL (YOUR PAGE.TSX CONTENT) */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-1 overflow-hidden"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};