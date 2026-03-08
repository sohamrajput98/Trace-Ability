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
  // Adding no-store ensures you see today's commits immediately
  const response = await fetch(LAMBDA_URL, { cache: 'no-store' }); 
  
  if (!response.ok) throw new Error('Lambda failing');
  const data = await response.json();
  setLogs(Array.isArray(data) ? data : [data]);
}catch (e) {
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
      <aside className="hidden lg:flex w-80 border-r border-white/5 p-8 flex-col gap-8 bg-[#0D1117]/50 overflow-y-auto shrink-0 relative">
        <section className="space-y-6 z-10">
          <div>
            <h3 className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Activity size={14} /> System Status
            </h3>
            <div className="bg-white/[0.03] p-5 rounded-sm border border-white/5 relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">Primary Model</p>
                <div className="flex items-center gap-2">
                  <Cpu size={14} className="text-[#D4AF37]" />
                  <p className="text-sm font-mono font-bold text-white uppercase tracking-tighter">Amazon Nova Lite</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-[#D4AF37] text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
              <Database size={14} /> Core Metrics
            </h3>
            <div className="bg-white/[0.03] p-6 rounded-sm border border-white/5 hover:border-[#D4AF37]/30 transition-all">
              <p className="text-[11px] text-[#D4AF37] uppercase font-black tracking-widest mb-1">Avg Confidence</p>
              <p className="text-4xl font-black text-white">{avgTrust}<span className="text-[#D4AF37] text-xl ml-1">%</span></p>
            </div>
          </div>

          {/* System Activity Radar */}
          <div className="mt-8 flex flex-col items-center justify-center opacity-90">
            <div className="relative flex items-center justify-center w-32 h-32">
              <div className="absolute w-full h-full border-2 border-dashed border-[#D4AF37]/70 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)] animate-[spin_15s_linear_infinite]" />
              <div className="absolute w-20 h-20 border-2 border-dotted border-[#D4AF37]/90 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)] animate-[spin_10s_linear_infinite_reverse]" />
              <div className="absolute bg-[#D4AF37]/30 p-3 rounded-full border border-[#D4AF37]/80 shadow-[0_0_25px_rgba(212,175,55,0.6)] animate-pulse">
                <Radar size={22} className="text-[#D4AF37] drop-shadow-[0_0_5px_rgba(212,175,55,1)]" strokeWidth={2.5} />
              </div>
            </div>
            <p className="text-[9px] text-[#D4AF37]/80 uppercase font-black tracking-[0.3em] mt-6 animate-pulse">Scanning Telemetry...</p>
          </div>
        </section>
        
        <section className="mt-auto z-10 bg-[#D4AF37]/5 p-4 border border-[#D4AF37]/10 rounded-sm">
          <p className="text-[9px] text-gray-500 leading-relaxed uppercase tracking-widest font-medium">
            Cryptographically logged via Bedrock. Authorized access only.
          </p>
        </section>
      </aside>

      {/* MAIN LOGS AREA */}
      <main id="main-scroll-area" className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-10 custom-scrollbar scroll-smooth">
        <div className="max-w-4xl mx-auto space-y-12 pb-20 pt-10"> 
          {loading ? (
            <div className="h-40 flex items-center justify-center text-[#D4AF37] font-mono text-sm animate-pulse uppercase tracking-[0.5em]">
              Decrypting Telemetry...
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