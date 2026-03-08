"use client";
import React, { useEffect, useState } from 'react';
import { Activity, Cpu, Database, Radar } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { LogCard } from '@/components/LogCard';
import { BootSequence } from '@/components/BootSequence';

export default function TraceAbilityDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  const toggleLog = (id: string) => {
    setExpandedLogs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const LAMBDA_URL = "https://wqn6vtpx2yrpfqb3qligyyt4ru0vjicb.lambda-url.ap-south-1.on.aws/";

  const fetchLogs = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const response = await fetch(`${LAMBDA_URL}?t=${Date.now()}`, { 
        cache: 'no-store'
      }); 
      
      if (!response.ok) throw new Error('Lambda failing');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const sorted = data.sort((a, b) => {
          const timeA = new Date(a.logged_at || 0).getTime();
          const timeB = new Date(b.logged_at || 0).getTime();

          if (timeB !== timeA) {
            return timeB - timeA; 
          }
          return 0; 
        });
        setLogs(sorted);
      } else {
        setLogs([data]);
      }
    } catch (e) {
      console.error("Fetch error:", e);
      setLogs([{
        commit_id: "demo-h8a2b9c",
        category: "ARCHITECTURE",
        summary: "REFACTOR: CORE COGNITIVE ENGINE. SYSTEMIC UPGRADE TO INTENT-PARSING LOGIC INCORPORATING NEW MACHINE LEARNING PROTOCOLS FOR HIGH-CONCURRENCY.",
        trust_score: "99.4",
        architecture_story: "Systemic upgrade to intent-parsing logic. Optimized trace-ability paths for high-concurrency event streams.",
        risk_score: 10
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 60000); 
    return () => clearInterval(interval);
  }, []);

  const avgTrust = logs.length > 0 
    ? (logs.reduce((acc, log) => acc + Number(log.trust_score || 0), 0) / logs.length).toFixed(1)
    : "94.8";

  return (
    <BootSequence>
      {/* SIDEBAR */}
      <aside className="hidden lg:flex w-80 border-r border-white/5 p-8 flex-col gap-8 bg-[#0D1117] overflow-y-auto shrink-0 relative shadow-2xl">
        <section className="space-y-6 z-10">
          
          {/* PRIMARY MODEL CARD */}
          <div>
            <h3 className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              
              {/* FIXED EKG: Thicker, Brighter, No scaling issues */}
              <svg width="28" height="20" viewBox="0 0 64 48" className="ekg-svg overflow-visible">
                <polyline stroke="rgba(212, 175, 55, 0.2)" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" points="0 24, 14 24, 22 48, 43 0, 50 24, 64 24" />
                <polyline className="ekg-front" stroke="#D4AF37" strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" points="0 24, 14 24, 22 48, 43 0, 50 24, 64 24" style={{ filter: 'drop-shadow(0 0 6px #D4AF37)' }} />
              </svg>
              System Status
              
            </h3>
            {/* FIXED BOX CONTRAST: Solid dark background with gold border */}
            <div className="bg-[#161B22] p-5 rounded-md border border-[#D4AF37]/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-2">Primary Model</p>
                <div className="flex items-center gap-2">
                  <Cpu size={14} className="text-[#D4AF37]" />
                  <p className="text-sm font-mono font-bold text-white uppercase tracking-tighter">Amazon Nova Lite</p>
                </div>
              </div>
            </div>
          </div>

          {/* CORE METRICS CARD */}
          <div>
            <h3 className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Database size={14} /> Core Metrics
            </h3>
            {/* FIXED BOX CONTRAST */}
            <div className="bg-[#161B22] p-6 rounded-md border border-[#D4AF37]/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:border-[#D4AF37]/50 transition-all">
              <p className="text-[11px] text-[#D4AF37] uppercase font-black tracking-widest mb-1">Avg Confidence</p>
              <p className="text-4xl font-black text-white drop-shadow-[0_0_10px_rgba(212,175,55,0.3)]">{avgTrust}<span className="text-[#D4AF37] text-xl ml-1">%</span></p>
            </div>
            
            {/* LIVE STREAM TICKER */}
            {/* FIXED BOX CONTRAST */}
            <div className="mt-4 bg-[#161B22] p-4 border border-[#D4AF37]/20 rounded-md relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
              
              <p className="text-[9px] text-[#D4AF37] uppercase tracking-widest font-black mb-3 flex items-center gap-2 opacity-80">
                <Activity size={10} className="text-[#D4AF37] animate-pulse" /> Live Stream
              </p>
              
              <div className="h-20 overflow-hidden text-[9px] font-mono tracking-wider leading-relaxed relative">
                {/* Fade overlays matched to the NEW card background color */}
                <div className="absolute top-0 w-full h-4 bg-gradient-to-b from-[#161B22] to-transparent z-10" />
                <div className="absolute bottom-0 w-full h-4 bg-gradient-to-t from-[#161B22] to-transparent z-10" />
                
                <div className="animate-[scrollY_15s_linear_infinite] flex flex-col gap-1.5 text-gray-400">
                  <p><span className="text-[#D4AF37]/50">{'>'}</span> BEDROCK_AUTH_V1: GRANTED</p>
                  <p><span className="text-[#D4AF37]/50">{'>'}</span> AES_256_GCM::ENCRYPTING</p>
                  <p className="text-[#D4AF37] drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]"><span className="text-[#D4AF37]/50">{'>'}</span> SIGNATURE::APPENDING... OK</p>
                  <p><span className="text-[#D4AF37]/50">{'>'}</span> VALIDATING_NONCE::77197</p>
                  <p><span className="text-[#D4AF37]/50">{'>'}</span> SECURED_LOG_PUSHED // 200</p>
                  <p><span className="text-[#D4AF37]/50">{'>'}</span> TELEMETRY_SYNC // ACTIVE</p>
                  
                  {/* Duplicate for seamless loop */}
                  <p aria-hidden="true" className="mt-2"><span className="text-[#D4AF37]/50">{'>'}</span> BEDROCK_AUTH_V1: GRANTED</p>
                  <p aria-hidden="true"><span className="text-[#D4AF37]/50">{'>'}</span> AES_256_GCM::ENCRYPTING</p>
                  <p aria-hidden="true" className="text-[#D4AF37] drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]"><span className="text-[#D4AF37]/50">{'>'}</span> SIGNATURE::APPENDING... OK</p>
                  <p aria-hidden="true"><span className="text-[#D4AF37]/50">{'>'}</span> VALIDATING_NONCE::77197</p>
                </div>
              </div>
            </div>
          </div>

          {/* HIGH-TECH RADAR OVERHAUL */}
          <div className="mt-8 flex flex-col items-center justify-center opacity-90 relative">
            <div className="absolute w-40 h-40 bg-[#D4AF37]/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative flex items-center justify-center w-36 h-36">
              <div className="absolute inset-0 rounded-full border border-[#D4AF37]/10 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(212,175,55,0.05)_100%)]" />
              <div className="absolute w-full h-[1px] bg-[#D4AF37]/20" />
              <div className="absolute h-full w-[1px] bg-[#D4AF37]/20" />
              <div className="absolute w-32 h-32 border border-[#D4AF37]/20 rounded-full" />
              <div className="absolute w-24 h-24 border border-dashed border-[#D4AF37]/40 rounded-full animate-[spin_20s_linear_infinite]" />
              <div className="absolute w-16 h-16 border border-[#D4AF37]/30 rounded-full" />
              <div className="absolute w-full h-full rounded-full animate-[spin_2s_linear_infinite] mix-blend-screen"
                   style={{ background: 'conic-gradient(from 0deg at 50% 50%, rgba(212,175,55,0.6) 0%, rgba(212,175,55,0.05) 15%, transparent 50%)' }}
              />
              <div className="absolute bg-[#0A0C10] p-2.5 rounded-full border border-[#D4AF37]/50 shadow-[0_0_15px_rgba(212,175,55,0.8)] z-10 flex items-center justify-center">
                <div className="w-4 h-4 bg-[#D4AF37] rounded-full animate-ping absolute opacity-40" />
                <Radar size={16} className="text-[#D4AF37] relative z-10" strokeWidth={3} />
              </div>
            </div>
            
            {/* FIXED MISSING ANIMATION: Gold dots are now permanently placed here! */}
            <div className="mt-8 flex flex-col items-center gap-3 z-10">
              <div className="loader-dots scale-[0.35]">
                <div className="circle-dot"><div className="dot"></div><div className="outline"></div></div>
                <div className="circle-dot"><div className="dot"></div><div className="outline"></div></div>
                <div className="circle-dot"><div className="dot"></div><div className="outline"></div></div>
                <div className="circle-dot"><div className="dot"></div><div className="outline"></div></div>
              </div>
              <p className="text-[9px] text-[#D4AF37]/80 uppercase font-black tracking-[0.3em]">
                Scanning Telemetry
              </p>
            </div>

          </div>
        </section>
        
        <section className="mt-auto z-10 bg-[#161B22] p-4 border border-[#D4AF37]/20 rounded-md shadow-lg">
          <p className="text-[9px] text-gray-400 leading-relaxed uppercase tracking-widest font-medium">
            Cryptographically logged via Bedrock. Authorized access only.
          </p>
        </section>
      </aside>

      {/* MAIN LOGS AREA */}
      <main id="main-scroll-area" className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-12 pb-20 pt-10"> 
          {loading ? (

            /* 👇 NEW ANIMATION ADDED HERE: GOLD DOTS LOADER */
            <div className="h-40 flex flex-col items-center justify-center gap-6">
              <div className="loader-dots scale-[0.6]">
                <div className="circle-dot"><div className="dot"></div><div className="outline"></div></div>
                <div className="circle-dot"><div className="dot"></div><div className="outline"></div></div>
                <div className="circle-dot"><div className="dot"></div><div className="outline"></div></div>
                <div className="circle-dot"><div className="dot"></div><div className="outline"></div></div>
              </div>
              <div className="text-[#D4AF37] font-mono text-[10px] animate-pulse uppercase tracking-[0.5em]">
                Decrypting Telemetry...
              </div>
            </div>

          ) : (
            <AnimatePresence>
              {logs.map((log: any, index: number) => {
                const commitId = log.commit_id || `log-${index}`;
                return (
                  <LogCard 
                    key={commitId} 
                    log={log} 
                    index={index} 
                    isExpanded={!!expandedLogs[commitId]} 
                    onToggle={toggleLog} 
                  />
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </main>
    </BootSequence>
  );
}