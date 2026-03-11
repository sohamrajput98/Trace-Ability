"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const BootSequence = ({ children }: { children: React.ReactNode }) => {
  const [isBooted, setIsBooted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsBooted(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[black] text-gray-400 font-sans selection:bg-[black]/100 overflow-hidden flex flex-col items-center">
     

      <AnimatePresence mode="wait">
        {!isBooted ? (
          <motion.div
            key="splash"
            exit={{ opacity: 0, transition: { duration: 0.65 } }}
            className="relative z-10 flex h-screen w-screen flex-col items-center justify-center"
          >
            
            <motion.div layoutId="brand-container" className="flex flex-col items-center gap-12">
              
              <motion.div 
                layoutId="brand-icon-wrapper"
                className="relative flex items-center justify-center mb-8"
              >
                <AnimatedCube size={64} />
              </motion.div>
              
              <motion.div layoutId="brand-text-wrapper" className="text-center">
                <h1 className="text-5xl md:text-7xl font-black tracking-[0.25em] text-white uppercase leading-none mb-2 ">
                  TRACE-ABILITY
                </h1>
                <p className="text-sm md:text-base text-[#FFD700] uppercase tracking-[0.5em] font-bold opacity-100 animate-pulse">
                  System Initialization...
                </p>
              </motion.div>
              
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            key="dashboard"
            className="relative z-10 flex flex-col h-screen w-full max-w-[1600px]"
          >
            <header className="px-8 py-6 flex justify-between items-center border-b border-white/5 bg-[black]/100 backdrop-blur-md shrink-0">
              <motion.div layoutId="brand-container" className="flex items-center gap-5">
                <motion.div 
                  layoutId="brand-icon-wrapper"
                  className="relative flex items-center justify-center"
                >
                  <AnimatedCube size={28} />
                </motion.div>
                
                <motion.div layoutId="brand-text-wrapper">
                  <h1 className="text-3xl font-black tracking-[0.25em] text-white uppercase leading-none mb-1">
                    TRACE-ABILITY <span className="text-[#FFD700] font-thin text-2.1xl tracking-[0.1em]">SYSTEMS</span>
                  </h1>
                  <p className="text-[12px] text-[#FFD700] uppercase tracking-[0.5em] font-bold opacity-100 mt-3">
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
                  <p className="text-[12px] text-gray-200 uppercase tracking-[0.3em] mb-1">System Health</p>
                  <div className="flex items-center gap-2 justify-end">
                    
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-105"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400"></span>
                    </span>
                    <p className="text-lg font-black text-white tracking-widest uppercase">Operational</p>
                  </div>
                </motion.div>
              </div>
            </header>

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

/* FIX: Using scale() math to bypass the CSS bugs in the original Cube HTML */
const AnimatedCube = ({ size }: { size: number }) => {
  const scale = size / 100;
  const [isShattered, setIsShattered] = useState(false);
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    const SHAPES = [
      'polygon(0 0, 100% 0, 100% 100%, 0% 100%)', 
      'polygon(50% 0%, 0% 100%, 100% 100%)',      
      'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)', 
      'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' 
    ];

    const arr = [];
    for (let i = 0; i < 24; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 500,
        y: (Math.random() - 0.5) * 500,
        z: (Math.random() - 0.5) * 500,
        rx: Math.random() * 720,
        ry: Math.random() * 720,
        rz: Math.random() * 720,
        s: Math.random() * 15 + 5, 
        cp: SHAPES[Math.floor(Math.random() * SHAPES.length)] 
      });
    }
    setParticles(arr);
  }, []);

  const handleExplode = () => {
    if (isShattered) return;
    setIsShattered(true);
    setTimeout(() => {
      setIsShattered(false);
    }, 1500);
  };

  return (
    <div 
      className="shrink-0 flex items-center justify-center overflow-visible mx-6 cursor-pointer" 
      style={{ width: size * 1.5, height: size }}
      onClick={handleExplode}
      title="Click to shatter telemetry core"
    >
      <style>{`
        /* 1. ANTI-GRAVITY HOVER */
        .trace-cube-wrapper { animation: float-bob 4s ease-in-out infinite; }
        @keyframes float-bob {
          0%, 100% { transform: translateY(-25px); }
          50% { transform: translateY(25px); }
        }

        /* 2. THE CUBE */
        .trace-cube {
          width: 100px; height: 100px;
          position: relative;
          transform-style: preserve-3d;
          animation: trace-spin 6s infinite cubic-bezier(0.5, 0, 0.5, 1);
        }
        .trace-cube.shattered { animation-play-state: paused; }

        /* 3. BASE FACE STYLING */
        .trace-face {
          position: absolute;
          width: 100%; height: 100%;
          border-radius: 4px;
          backdrop-filter: blur(4px);
          background: rgba(15, 15, 20, 0.95);
          /* UPDATED TO TRUE GOLD */
          border: 3px solid rgba(255, 215, 0, 0.7);
        }

        /* 4. NORMAL ROTATION & GLOW ANIMATIONS */
        .trace-top { transform: rotateX(90deg) translateZ(50px); animation: trace-shift-top 6s infinite ease-in-out, face-glow 6s infinite ease-in-out; }
        .trace-bottom { transform: rotateX(-90deg) translateZ(50px); animation: trace-shift-bottom 6s infinite ease-in-out, face-glow 6s infinite ease-in-out; }
        .trace-right { transform: rotateY(90deg) translateZ(50px); animation: trace-shift-right 6s infinite ease-in-out, face-glow 6s infinite ease-in-out; }
        .trace-left { transform: rotateY(-90deg) translateZ(50px); animation: trace-shift-left 6s infinite ease-in-out, face-glow 6s infinite ease-in-out; }
        .trace-front { transform: translateZ(50px); animation: trace-shift-front 6s infinite ease-in-out, face-glow 6s infinite ease-in-out; }
        .trace-back { transform: rotateY(-180deg) translateZ(50px); animation: trace-shift-back 6s infinite ease-in-out, face-glow 6s infinite ease-in-out; }

        /* 5. CLICK-TO-SHATTER ANIMATIONS FOR THE MAIN FACES */
        .shattered .trace-top { animation: shatter-top 1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards !important; }
        .shattered .trace-bottom { animation: shatter-bottom 1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards !important; }
        .shattered .trace-right { animation: shatter-right 1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards !important; }
        .shattered .trace-left { animation: shatter-left 1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards !important; }
        .shattered .trace-front { animation: shatter-front 1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards !important; }
        .shattered .trace-back { animation: shatter-back 1s cubic-bezier(0.1, 0.8, 0.2, 1) forwards !important; }

        @keyframes shatter-top { 0% { transform: rotateX(90deg) translateZ(80px); opacity: 1; border-color: #FFD700; box-shadow: 0 0 40px #FFD700; } 100% { transform: rotateX(90deg) translateZ(250px) rotateZ(180deg); opacity: 0; } }
        @keyframes shatter-bottom { 0% { transform: rotateX(-90deg) translateZ(80px); opacity: 1; border-color: #FFD700; box-shadow: 0 0 40px #FFD700; } 100% { transform: rotateX(-90deg) translateZ(250px) rotateZ(180deg); opacity: 0; } }
        @keyframes shatter-right { 0% { transform: rotateY(90deg) translateZ(80px); opacity: 1; border-color: #FFD700; box-shadow: 0 0 40px #FFD700; } 100% { transform: rotateY(90deg) translateZ(250px) rotateZ(180deg); opacity: 0; } }
        @keyframes shatter-left { 0% { transform: rotateY(-90deg) translateZ(80px); opacity: 1; border-color: #FFD700; box-shadow: 0 0 40px #FFD700; } 100% { transform: rotateY(-90deg) translateZ(250px) rotateZ(180deg); opacity: 0; } }
        @keyframes shatter-front { 0% { transform: translateZ(80px); opacity: 1; border-color: #FFD700; box-shadow: 0 0 40px #FFD700; } 100% { transform: translateZ(250px) rotateZ(180deg); opacity: 0; } }
        @keyframes shatter-back { 0% { transform: rotateY(-180deg) translateZ(80px); opacity: 1; border-color: #FFD700; box-shadow: 0 0 40px #FFD700; } 100% { transform: rotateY(-180deg) translateZ(250px) rotateZ(180deg); opacity: 0; } }

        /* 6. PARTICLE STYLING */
        .trace-particle {
          position: absolute;
          top: 50%; left: 50%;
          /* UPDATED TO TRUE GOLD */
          background: rgba(255, 215, 0, 0.8);
          border: 28px solid #FFD700;
          box-shadow: 0 0 15px #FFD700;
          pointer-events: none;
        }

        /* --- THE MAGIC GLOW TIMELINE (FIXED LOOPING) --- */
        /* ALL RGBA VALUES UPDATED TO 255, 215, 0 (TRUE GOLD) */
        @keyframes face-glow {
          0%   { border-color: rgba(255,215,0,0.7); border-width: 3px; box-shadow: 0 0 15px rgba(255,215,0,0.3); background-color: rgba(15,15,20,0.9); }
          16%  { border-color: rgba(255,215,0,1);   border-width: 3px; box-shadow: 0 0 25px rgba(255,215,0,0.8); background-color: rgba(40,35,0,0.9); }
          33%  { border-color: rgba(255,215,0,0.7); border-width: 3px; box-shadow: 0 0 15px rgba(255,215,0,0.3); background-color: rgba(15,15,20,0.9); }
          
          50%, 60% { 
            border-color: #FFF8D6; 
            border-width: 4px;
            box-shadow: 0 0 50px #FFD700, inset 0 0 60px rgba(255,215,0,0.9); 
            background-color: rgba(255,215,0,0.7); 
          }
          
          75% { 
            border-color: rgba(255,215,0,0.7); 
            border-width: 3px; 
            box-shadow: 0 0 15px rgba(255,215,0,0.3); 
            background-color: rgba(15,15,20,0.9); 
          }
          100% { 
            border-color: rgba(255,215,0,0.7); 
            border-width: 3px; 
            box-shadow: 0 0 15px rgba(255,215,0,0.3); 
            background-color: rgba(15,15,20,0.9); 
          }
        }

        /* --- THE MOVEMENT TIMING --- */
        @keyframes trace-spin {
          0% { transform: rotateX(0) rotateY(0); }
          33%, 100% { transform: rotateX(-36deg) rotateY(-405deg); }
        }
        @keyframes trace-shift-top { 33%, 75% { transform: rotateX(90deg) translateZ(50px); } 50%, 60% { transform: rotateX(90deg) translateZ(80px); } }
        @keyframes trace-shift-bottom { 33%, 75% { transform: rotateX(-90deg) translateZ(50px); } 50%, 60% { transform: rotateX(-90deg) translateZ(80px); } }
        @keyframes trace-shift-right { 33%, 75% { transform: rotateY(90deg) translateZ(50px); } 50%, 60% { transform: rotateY(90deg) translateZ(80px); } }
        @keyframes trace-shift-left { 33%, 75% { transform: rotateY(-90deg) translateZ(50px); } 50%, 60% { transform: rotateY(-90deg) translateZ(80px); } }
        @keyframes trace-shift-front { 33%, 75% { transform: translateZ(50px); } 50%, 60% { transform: translateZ(80px); } }
        @keyframes trace-shift-back { 33%, 75% { transform: rotateY(-180deg) translateZ(50px); } 50%, 60% { transform: rotateY(-180deg) translateZ(80px); } }
      `}</style>

      <div style={{ transform: `scale(${scale})`, transformOrigin: 'center' }} className="overflow-visible">
        <div className="trace-cube-wrapper">
          <div className={`trace-cube ${isShattered ? 'shattered' : ''}`}>
            
            <div className="trace-face trace-front"></div>
            <div className="trace-face trace-back"></div>
            <div className="trace-face trace-right"></div>
            <div className="trace-face trace-left"></div>
            <div className="trace-face trace-top"></div>
            <div className="trace-face trace-bottom"></div>

            {isShattered && particles.map((p, i) => (
              <motion.div
                key={i}
                className="trace-particle"
                style={{ 
                  width: p.s, 
                  height: p.s, 
                  clipPath: p.cp,
                  marginTop: p.s / -2,
                  marginLeft: p.s / -2
                }}
                initial={{ transform: `translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`, opacity: 1 }}
                animate={{ transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px) rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg)`, opacity: 0 }}
                transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }}
              />
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};