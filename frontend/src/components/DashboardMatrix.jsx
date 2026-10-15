import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Server, Database } from 'lucide-react';

function CircularGauge({ value, max = 100, label, unit, colorClass, darkMode }) {
  const percent = Math.min(Math.max(value / max, 0), 1);
  return (
    <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-2.5 rounded-xl flex flex-col justify-between shadow-md relative overflow-hidden`}>
      <div className="flex items-center justify-between">
        <span className={`text-[9px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider`}>{label}</span>
        <span className={`w-1.5 h-1.5 rounded-full ${colorClass === 'text-emerald-400' ? 'bg-emerald-500' : 'bg-blue-500'} animate-pulse`} />
      </div>
      <div className="flex items-center justify-center my-0.5 relative">
        <svg className="w-14 h-14 transform -rotate-90">
          <circle cx="28" cy="28" r="22" stroke={darkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="4" fill="transparent" />
          <circle 
            cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" fill="transparent" 
            strokeDasharray="138" strokeDashoffset={138 - (138 * percent)} strokeLinecap="round"
            className={`${colorClass} transition-all duration-500`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-xs font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{value}</span>
          <span className={`text-[7px] ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardMatrix({ currentTelemetry, chartData, langText, darkMode }) {
  return (
    <div className="flex-1 flex flex-col gap-3 h-full overflow-hidden min-h-0 w-full">
      {/* Baris Statistik Atas - Tinggi Tetap Teratur */}
      <div className="grid grid-cols-5 gap-3 shrink-0">
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-2.5 rounded-xl relative shadow-sm`}>
          <div className={`text-[9px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Total Devices</div>
          <div className={`text-lg font-black ${darkMode ? 'text-white' : 'text-slate-900'} mt-0.5`}>9</div>
          <div className="absolute top-2.5 right-2.5 text-blue-500"><Server className="w-3.5 h-3.5" /></div>
        </div>
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-2.5 rounded-xl relative shadow-sm`}>
          <div className={`text-[9px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Online Nodes</div>
          <div className="text-lg font-black text-emerald-500 mt-0.5">9</div>
          <div className="absolute top-2.5 right-2.5 text-emerald-500"><Server className="w-3.5 h-3.5" /></div>
        </div>
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-2.5 rounded-xl relative shadow-sm`}>
          <div className={`text-[9px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Offline Nodes</div>
          <div className="text-lg font-black text-rose-500 mt-0.5">0</div>
          <div className="absolute top-2.5 right-2.5 text-rose-500"><Server className="w-3.5 h-3.5" /></div>
        </div>
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-2.5 rounded-xl relative shadow-sm`}>
          <div className={`text-[9px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Avg Latency</div>
          <div className="text-lg font-black text-blue-500 mt-0.5">{currentTelemetry?.latency_ms}ms</div>
          <div className="absolute top-2.5 right-2.5 text-blue-500"><Activity className="w-3.5 h-3.5" /></div>
        </div>
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-2.5 rounded-xl relative shadow-sm`}>
          <div className={`text-[9px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Data Centers</div>
          <div className="text-lg font-black text-purple-500 mt-0.5">1</div>
          <div className="absolute top-2.5 right-2.5 text-purple-500"><Database className="w-3.5 h-3.5" /></div>
        </div>
      </div>

      {/* Baris Tengah: Server Info & Gauges - Tinggi Konsisten */}
      <div className="grid grid-cols-3 gap-3 shrink-0 h-28">
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-2.5 rounded-xl flex flex-col justify-between shadow-sm`}>
          <div className="flex items-center space-x-1.5">
            <Server className="w-3.5 h-3.5 text-blue-500" />
            <h3 className={`text-[10px] font-bold ${darkMode ? 'text-white' : 'text-slate-900'} uppercase tracking-wider`}>Core Gateway Info</h3>
          </div>
          <div className="space-y-0.5 text-[11px]">
            <div className="flex justify-between border-b border-slate-800/40 pb-0.5"><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Target Host</span><span className="font-mono font-semibold text-[9px]">{currentTelemetry?.target}</span></div>
            <div className="flex justify-between border-b border-slate-800/40 pb-0.5"><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Protocol</span><span className="font-mono font-semibold">ICMP / Network Ping</span></div>
            <div className="flex justify-between"><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Status SLA</span><span className="font-mono text-emerald-500 font-semibold">99.98%</span></div>
          </div>
        </div>

        <CircularGauge value={currentTelemetry?.latency_ms} max={200} label={langText?.latency || "Latency"} unit="ms" colorClass="text-blue-500" darkMode={darkMode} />
        <CircularGauge value={currentTelemetry?.download_mbps} max={100} label={langText?.download || "Download"} unit="Mbps" colorClass="text-emerald-500" darkMode={darkMode} />
      </div>

      {/* Baris Bawah: Grafik Recharts Berjalan - Auto-Flexible Mengikuti Sisa Layar */}
      <div className={`flex-1 min-h-0 ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-3 rounded-xl shadow-sm flex flex-col justify-between`}>
        <div className="flex items-center justify-between mb-1.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <h2 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'} uppercase tracking-wider`}>
              {langText?.liveTicker || "Live Telemetry Ticker"}
            </h2>
          </div>
          <span className={`text-[9px] ${darkMode ? 'text-slate-400 bg-slate-950' : 'text-slate-600 bg-slate-100'} px-2 py-0.5 rounded font-mono`}>
            Sync: {currentTelemetry?.timestamp || "--:--:--"}
          </span>
        </div>

        {/* Kotak grafik fleksibel penuh mengikut rasio sisa pixel layar asli */}
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" stroke={darkMode ? '#475569' : '#94a3b8'} tick={{fontSize: 8}} />
              <YAxis stroke={darkMode ? '#475569' : '#94a3b8'} tick={{fontSize: 8}} unit="ms" domain={[0, 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#020617' : '#ffffff', borderColor: darkMode ? '#334155' : '#cbd5e1', borderRadius: '6px', color: darkMode ? '#fff' : '#0f172a', fontSize: '10px' }} />
              <Area type="monotone" dataKey="latency_ms" stroke="#3b82f6" strokeWidth={1.5} fillOpacity={1} fill="url(#latencyGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
