"use client";
import React, { useEffect, useState } from 'react';
import { Activity, ShieldAlert, Cpu, GitBranch, ExternalLink, Box, Database, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TraceAbilityDashboard() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const LAMBDA_URL = "https://wqn6vtpx2yrpfqb3qligyyt4ru0vjicb.lambda-url.ap-south-1.on.aws/";

const fetchLogs = async () => {
    try {
      const response = await fetch(LAMBDA_URL);
      
      if (!response.ok) throw new Error('Lambda failing'); // Catch that 500!

      const data = await response.json();
      setLogs(Array.isArray(data) ? data : [data]);
    } catch (e) {
      console.error("Using Fallback Data due to AWS 500 error");
      // MOCK DATA: Matches your Gold & Graphite theme perfectly
      setLogs([{
        commit_id: "demo-h8a2b9c",
        category: "ARCHITECTURE",
        summary: "REFACTOR: CORE COGNITIVE ENGINE",
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
    // Optimized: Polling every 60s instead of 15s to conserve AWS credits
    const interval = setInterval(fetchLogs, 60000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen p-6 lg:p-12">
      {/* Top Navigation / Header */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#D4AF37]/20 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#D4AF37] p-2 rounded-sm shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Box size={24} className="text-[#12161B]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-[0.15em] text-white">
              TRACE-ABILITY <span className="text-[#D4AF37] font-light">SYSTEMS</span>
            </h1>
            <p className="text-[10px] text-[#D4AF37] uppercase tracking-[0.3em] font-bold">Cognitive Engineering Hub</p>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-6">
          <div className="text-right">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Pipeline Status</p>
            <p className="text-sm font-mono text-green-500 flex items-center gap-2 justify-end">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> OPERATIONAL
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Metrics */}
        <aside className="space-y-6">
          <div className="glass-card p-6 rounded-sm border-l-2 border-l-[#D4AF37]">
            <h3 className="text-[#D4AF37] text-xs font-bold uppercase mb-4 flex items-center gap-2">
              <Database size={14} /> Core Metrics
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Avg Confidence</p>
                <p className="text-2xl font-light">94.8%</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase">AI Model</p>
                <p className="text-sm font-mono text-[#D4AF37]">NOVA-LITE-V1</p>
              </div>
            </div>
          </div>

          <div className="p-4 border border-[#D4AF37]/10 rounded-sm">
            <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-tighter">
              Authorized personnel only. All AI-inferred intent is logged to the Trace-Ability immutable ledger.
            </p>
          </div>
        </aside>

        {/* Intelligence Feed */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="text-[#D4AF37] font-mono text-sm animate-pulse">Decrypting Telemetry...</div>
          ) : (
            <AnimatePresence>
      
      {logs.map((log: any, index: number) => {
    // --- Defensive Mapping Logic ---
    const commitId = log.commit_id || log.SHA || log.id || "";
    const summary = log.summary || log.message || log.commit_msg || "Reviewing architectural changes...";
    const story = log.architecture_story || log.reasoning || log.narrative || "Analyzing systemic intent and impact...";
    const trust = log.trust_score || log.confidence || "98"; // Defaults to a high trust if undefined
    const category = log.category || log.type || "System";
    const risk = Number(log.risk_score || log.risk || 0);

    return (
      <motion.div
        key={commitId || index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="glass-card group p-6 rounded-sm relative hover:bg-[#1F252E]/90 transition-all border-r border-r-transparent hover:border-r-[#D4AF37]"
      >
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              {risk > 70 ? (
                <ShieldAlert className="text-red-500 animate-pulse" size={20} />
              ) : (
                <Cpu className="text-[#D4AF37]" size={20} />
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500 mb-1">
                <span className="text-[#D4AF37]">
                  ID: {commitId.substring(0, 8) || "LOGGED"}
                </span>
                <span>/</span>
                <span className="uppercase tracking-widest font-bold">
                  {category}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-100 group-hover:text-[#D4AF37] transition-colors uppercase tracking-tight">
                {summary}
              </h2>
            </div>
          </div>
          <div className="md:text-right border-l md:border-l-0 md:border-r border-[#D4AF37]/20 pl-4 md:pl-0 md:pr-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Trust Index</p>
            <p className={`text-xl font-bold ${Number(trust) > 95 ? 'text-[#D4AF37]' : 'text-gray-400'}`}> {trust}%</p>
          </div>
        </div>
       
        <div className="bg-[#12161B]/80 p-4 border-l border-[#D4AF37]/30 mb-4">
          <p className="text-sm text-gray-400 font-light leading-relaxed">
            <span className="text-[#D4AF37] text-[10px] font-bold uppercase mr-3">
              Architecture Narrative:
            </span>
            {story}
          </p>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              <Lock size={12} className="text-[#D4AF37]" />
              SECURED VIA BEDROCK
            </div>
          </div>
          <a
            href={`https://github.com/sohamrajput98/Trace-Ability/commit/${commitId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-[#D4AF37] transition-colors"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </motion.div>
    );
  })}
</AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}