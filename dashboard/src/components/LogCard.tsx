"use client";
import React, { useState, useEffect } from 'react';
import { ShieldAlert, Cpu, ExternalLink, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

interface LogCardProps {
  log: any;
  index: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

export const LogCard = ({ log, index, isExpanded, onToggle }: LogCardProps) => {
  const [headlineExpanded, setHeadlineExpanded] = useState(false);
  
  const commitId = log.commit_id || `log-${index}`;
 const narrative = log.architecture_story || "";
  
  // 1. Try new AI array
  let briefPoints = log.condensed_points || [];

  // 2. Fallback for old logs (NO TRIMMING)
  if (briefPoints.length === 0 && narrative) {
    // Split by period or semicolon
    let rawSentences = narrative.split(/(?:\.\s+(?=[A-Z]))|;/);
    
    briefPoints = rawSentences
      .map((s: string) => s.replace(/\.+$/, '').trim())
      .filter((s: string) => s.length > 10)
      .slice(0, 2); 
  }
  const isRisky = Number(log.risk_score) > 70;

  // Less sensitive auto-collapse for headline (60px threshold)
  useEffect(() => {
    if (!headlineExpanded) return;
    
    const scrollContainer = document.getElementById('main-scroll-area');
    if (!scrollContainer) return;

    const initialScrollY = scrollContainer.scrollTop;
    
    const handleScroll = () => {
      if (Math.abs(scrollContainer.scrollTop - initialScrollY) > 60) {
        setHeadlineExpanded(false);
      }
    };
    
    scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [headlineExpanded]);

  return (
    <motion.div
      // Smoother scroll entry: tighter scale and shorter travel distance (y: 40)
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      // Outer wrapper acts as the 1px track for the running border
      className="group relative rounded-3xl overflow-hidden p-[1px]"
    >
      {/* The Running Border Engine: 
        A spinning conic gradient. We use -inset-[100%] so the gradient is large 
        enough to cover the corners as it rotates around the rectangular card. 
      */}
      <div 
        className={`absolute -inset-[100%] animate-[spin_4s_linear_infinite] opacity-60 group-hover:opacity-100 transition-opacity duration-500 ${
          isRisky 
            ? 'bg-[conic-gradient(from_0deg,transparent_75%,rgba(239,68,68,1)_100%)]' 
            : 'bg-[conic-gradient(from_0deg,transparent_75%,rgba(212,175,55,1)_100%)]'
        }`} 
      />

      {/* Inner Card: 
        Solid enough to mask the center of the gradient, leaving only the 1px edge visible.
      */}
      <div className="relative z-10 bg-[#12161B] backdrop-blur-3xl p-8 md:p-10 rounded-[calc(1.5rem-1px)] h-full w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
          <div className="flex gap-5">
            {/* Fixed Icon Block */}
            <div className={`flex items-center justify-center w-14 h-14 rounded-2xl border shrink-0 shadow-lg ${isRisky ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-red-500/20' : 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37] shadow-[#D4AF37]/20'}`}>
              {isRisky ? <ShieldAlert className="animate-pulse" size={26} /> : <Cpu size={26} />}
            </div>
            
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D4AF37]/70 mb-2 flex items-center gap-2">
                REF: {commitId.substring(0, 8)} 
                <span className="opacity-30">|</span> 
                <span className="text-gray-400">{log.category || 'SYSTEM'}</span>
              </p>
              {/* Clickable Expandable Headline */}
              <h2 
                onClick={() => setHeadlineExpanded(!headlineExpanded)}
                className={`text-xl md:text-2xl font-black text-white uppercase group-hover:text-[#D4AF37] transition-all duration-300 leading-snug cursor-pointer ${headlineExpanded ? '' : 'line-clamp-3'}`}
              >
                {log.summary}
              </h2>
              {!headlineExpanded && log.summary?.length > 100 && (
                 <p className="text-[9px] text-[#D4AF37]/60 mt-2 uppercase tracking-widest font-bold">Tap headline to expand</p>
              )}
            </div>
          </div>
          
          <div className="bg-black/60 p-3 px-5 border border-white/10 rounded-xl shrink-0 text-center shadow-inner">
            <p className="text-[9px] text-gray-500 uppercase font-black mb-1 tracking-widest">Trust Index</p>
            <p className={`text-3xl tracking-tight font-black italic drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] ${Number(log.trust_score) > 95 ? 'text-[#D4AF37]' : 'text-white'}`}>
              {log.trust_score}%
            </p>
          </div>
        </div>

        {/* Analysis Section */}
        <div className={`p-6 mb-6 rounded-xl border-l-4 transition-colors duration-500 ${isExpanded ? 'border-[#D4AF37] bg-[#D4AF37]/5' : 'border-white/10 bg-white/[0.02]'}`}>
          <div className="flex justify-between items-center mb-5">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">
              {isExpanded ? "Full Narrative" : "Executive Summary"}
            </span>
            <button 
              onClick={() => onToggle(commitId)} 
              className="text-[9px] uppercase tracking-widest border border-[#D4AF37]/40 px-4 py-2 rounded-full hover:bg-[#D4AF37] hover:text-black transition-all font-bold"
            >
              {isExpanded ? "[-] Condense" : "[+] Expand Data"}
            </button>
          </div>
          
          <div className="overflow-hidden">
            {isExpanded ? (
              <motion.p 
                initial={{ opacity: 0, filter: "blur(5px)", x: -10 }} 
                animate={{ opacity: 1, filter: "blur(0px)", x: 0 }} 
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="text-[15px] text-gray-200 font-medium italic leading-relaxed"
              >
                "{narrative}"
              </motion.p>
            ) : (
              <ul className="space-y-3">
                {briefPoints.map((p: string, i: number) => (
                  <li key={i} className="flex gap-4 text-[13px] text-gray-400 font-medium leading-relaxed items-start">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60 shrink-0" />
                    <span>{p}</span> {/* Notice I removed the hardcoded '.' here since the AI usually adds it */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-5 border-t border-white/10 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400">
            <Lock size={12} className="text-[#D4AF37]" /> SECURED LOG // BEDROCK_v1
          </div>
          <a 
            href={`https://github.com/sohamrajput98/Trace-Ability/commit/${commitId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#D4AF37] hover:scale-110 transition-transform p-2 bg-[#D4AF37]/10 rounded-full border border-[#D4AF37]/20 z-20 relative"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};