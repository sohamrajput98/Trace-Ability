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
  
  let briefPoints = log.condensed_points || [];

  if (briefPoints.length === 0 && narrative) {
    let rawSentences = narrative.split(/(?:\.\s+(?=[A-Z]))|;/);
    
    briefPoints = rawSentences
      .map((s: string) => s.replace(/\.+$/, '').trim())
      .filter((s: string) => s.length > 10)
      .slice(0, 2); 
  }
  const isRisky = Number(log.risk_score) > 70;

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
      
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative rounded-xl overflow-hidden p-[1px]"
    >
      
     <div 
  className={`absolute -inset-[100%] animate-[spin_4s_linear_infinite] opacity-60 group-hover:opacity-100 transition-opacity duration-500 ${
    isRisky 
      ? 'bg-[conic-gradient(from_0deg,transparent_0%,transparent_25%,rgba(239,68,68,1)_50%,transparent_50%,transparent_75%,rgba(239,68,68,1)_100%)]' 
      : 'bg-[conic-gradient(from_0deg,transparent_0%,transparent_25%,rgba(255,215,0,1)_50%,transparent_50%,transparent_75%,rgba(255,215,0,1)_100%)]'
  }`} 
/>
      {/* Inner Card: */}
      <div className="relative z-10 bg-[BLACK] backdrop-blur-3xl p-8 md:p-10 rounded-[calc(0.75rem-1px)] h-full w-full">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-6">
          <div className="flex gap-5">
            {/* Fixed Icon Block */}
            <div className={`flex items-center justify-center w-14 h-14 rounded-2xl border shrink-0 shadow-lg ${isRisky ? 'bg-black-500/20 border-black-500/30 text-red-500 shadow-red-500/20' : 'bg-[#FFD700]/10 border-[#FFD700]/90 text-[#FFD700] shadow-[#FFD700]/10'}`}>
              {isRisky ? <ShieldAlert className="animate-pulse" size={26} /> : <Cpu size={26} />}
            </div>
            
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#FFD700]/90 mb-2 flex items-center gap-2">
                REF: {commitId.substring(0, 8)} 
                <span className="opacity-30">|</span> 
                <span className="text-gray-300">{log.category || 'SYSTEM'}</span>
              </p>
              {/* Clickable Expandable Headline */}
              <h2 
                onClick={() => setHeadlineExpanded(!headlineExpanded)}
                className={`text-xl md:text-2xl font-black text-white uppercase group-hover:text-[#FFD700] transition-all duration-300 leading-snug cursor-pointer ${headlineExpanded ? '' : 'line-clamp-3'}`}
              >
                {log.summary}
              </h2>
              {!headlineExpanded && log.summary?.length > 100 && (
                 <p className="text-[9px] text-[#FFD700]/60 mt-2 uppercase tracking-widest font-bold">Tap headline to expand</p>
              )}
            </div>
          </div>
          
          <div className="bg-black/60 p-3 px-5 border border-[#FFD700]/30 rounded-xl shrink-0 text-center shadow-[0_0_10px_rgba(255,215,0,0.6)]">
            <p className="text-[11px] text-gray-300 uppercase font-black mb-1 tracking-widest">Trust Index</p>
            <p className={`text-3xl tracking-tight font-black italic drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] ${Number(log.trust_score) > 95 ? 'text-[#FFD700]' : 'text-white'}`}>
              {log.trust_score}%
            </p>
          </div>
        </div>

      {/* Analysis Section */}
<div className={`p-6 mb-6 rounded-xl border-l-4 transition-colors duration-500 ${isExpanded ? 'border-[#FFD700] bg-[#FFD700]/[0.05]' : 'border-white/18 bg-white/[0.025]'}`}>
  <div className="flex justify-between items-center mb-5">
    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FFD700]">
      {isExpanded ? "Full Narrative" : "Executive Summary"}
    </span>
    
    <button 
      onClick={() => onToggle(commitId)} 
      className={`text-[9px] uppercase tracking-widest px-4 py-2 rounded-full transition-all font-bold border ${
        isExpanded 
          ? 'bg-[#FFD700] text-black border-[#FFD700]' // Active/Clicked State
          : 'border-[#FFD700]/40 text-[#FFD700] hover:bg-[#FFD700] hover:text-black' // Default State
      }`}
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
          <li key={i} className="flex gap-4 text-[13px] text-gray-200 font-medium leading-relaxed items-start">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#FFD700]/60 shrink-0" />
            <span>{p}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
</div>

        {/* Footer Section */}
        <div className="flex items-center justify-between pt-5 border-t border-white/10 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-gray-400">
            <Lock size={12} className="text-[#FFD700]" /> CORE_VAULT // BEDROCK_ENFORCED
          </div>
          <a 
            href={`https://github.com/sohamrajput98/Trace-Ability/commit/${commitId}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[#FFD700] hover:scale-110 transition-transform p-2 bg-[#FFD700]/10 rounded-full border border-[#FFD700]/20 z-20 relative"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </motion.div>
  );
};