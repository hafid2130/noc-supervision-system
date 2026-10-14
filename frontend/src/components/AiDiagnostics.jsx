import React from 'react';
import { Cpu, Terminal, ShieldAlert } from 'lucide-react';

export default function AiDiagnostics({ aiAnalysis, triggerAiDiagnose, loadingAi, langText, darkMode }) {
  return (
    <div className="flex-1 flex flex-col gap-3 overflow-hidden">
      <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-4 rounded-xl flex items-center justify-between shadow-sm shrink-0`}>
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-500" />
          <div>
            <h2 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'} uppercase tracking-wider`}>AI Autonomous Network Diagnostic Engine</h2>
            <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Intelligent automated anomaly detection and root-cause analysis.</p>
          </div>
        </div>
        <span className="text-[10px] bg-cyan-500/10 text-cyan-500 px-3 py-1 rounded-lg border border-cyan-500/30 font-mono font-bold">Model: Llama-3.2 Fine-Tuned</span>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-3 min-h-0">
        {/* Kotak Analisis Utama */}
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-4 rounded-xl flex flex-col justify-between shadow-sm min-h-0`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-4 h-4 text-cyan-500" />
              <h3 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Live Autonomous AI Log & Recommendation</h3>
            </div>
            <div className={`p-4 rounded-xl border ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-300 font-mono' : 'bg-slate-50 border-slate-200 text-slate-700'} text-xs leading-relaxed h-56 overflow-y-auto`}>
              {aiAnalysis}
            </div>
          </div>

          <button 
            onClick={triggerAiDiagnose} 
            disabled={loadingAi}
            className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 text-white font-bold rounded-xl text-xs transition shadow-lg"
          >
            {loadingAi ? langText.aiAnalyzing : langText.aiBtn}
          </button>
        </div>

        {/* Kotak Panduan Mitigation / SLA */}
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-4 rounded-xl flex flex-col justify-between shadow-sm min-h-0`}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <h3 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Automated Remediation Protocol</h3>
            </div>
            <ul className={`space-y-2 text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              <li className="flex items-start gap-2 bg-amber-500/10 p-2.5 rounded-lg border border-amber-500/20 text-amber-500">
                <span>⚡</span> <strong>Dynamic Route Failover:</strong> Automatically switches uplink traffic to secondary backup gateway when latency exceeds 120ms.
              </li>
              <li className="flex items-start gap-2 bg-blue-500/10 p-2.5 rounded-lg border border-blue-500/20 text-blue-500">
                <span>🛡️</span> <strong>DDoS Scrubbing Trigger:</strong> Activates rate-limiting filters if packet volume spikes anomalously.
              </li>
              <li className="flex items-start gap-2 bg-emerald-500/10 p-2.5 rounded-lg border border-emerald-500/20 text-emerald-500">
                <span>📊</span> <strong>SLA Reporting:</strong> Generates automated compliance logs for enterprise client audit.
              </li>
            </ul>
          </div>

          {/* Status Bar yang dapat diubah sesuai kebutuhan */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-[11px] text-slate-400 font-mono">
            System status: Ready and Live, Waiting for evaluation.
          </div>

          {/* 
            Gunakan blok di bawah ini jika sudah berada di jaringan client:
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-[11px] text-slate-400 font-mono">
              System status: Ready for tender deployment & live PoC evaluation.
            </div>
          */}
        </div>
      </div>
    </div>
  );
}
