import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Server, Database } from 'lucide-react';

function CircularGauge({ value, max = 100, label, unit, colorClass, darkMode }) {
  const percent = Math.min(Math.max(value / max, 0), 1);
  return (
    <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-3 rounded-xl flex flex-col justify-between shadow-md relative overflow-hidden`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase tracking-wider`}>{label}</span>
        <span className={`w-1.5 h-1.5 rounded-full ${colorClass === 'text-emerald-400' ? 'bg-emerald-500' : 'bg-blue-500'} animate-pulse`} />
      </div>
      <div className="flex items-center justify-center my-1 relative">
        <svg className="w-16 h-16 transform -rotate-90">
          <circle cx="32" cy="32" r="25" stroke={darkMode ? '#1e293b' : '#e2e8f0'} strokeWidth="5" fill="transparent" />
          <circle 
            cx="32" cy="32" r="25" stroke="currentColor" strokeWidth="5" fill="transparent" 
            strokeDasharray="157" strokeDashoffset={157 - (157 * percent)} strokeLinecap="round"
            className={`${colorClass} transition-all duration-500`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{value}</span>
          <span className={`text-[8px] ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>{unit}</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardMatrix({ currentTelemetry, chartData, langText, darkMode }) {
  return (
    <div className="w-full space-y-4">
      {/* Baris Statistik Atas */}
      <div className="grid grid-cols-5 gap-3">
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-3 rounded-xl relative shadow-sm`}>
          <div className={`text-[9px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Total Devices</div>
          <div className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'} mt-0.5`}>25</div>
          <div className="absolute top-3 right-3 text-blue-500"><Server className="w-4 h-4" /></div>
        </div>
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-3 rounded-xl relative shadow-sm`}>
          <div className={`text-[9px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Online Nodes</div>
          <div className="text-xl font-black text-emerald-500 mt-0.5">25</div>
          <div className="absolute top-3 right-3 text-emerald-500"><Server className="w-4 h-4" /></div>
        </div>
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-3 rounded-xl relative shadow-sm`}>
          <div className={`text-[9px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Offline Nodes</div>
          <div className="text-xl font-black text-rose-500 mt-0.5">0</div>
          <div className="absolute top-3 right-3 text-rose-500"><Server className="w-4 h-4" /></div>
        </div>
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-3 rounded-xl relative shadow-sm`}>
          <div className={`text-[9px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Avg Latency</div>
          <div className="text-xl font-black text-blue-500 mt-0.5">{currentTelemetry?.latency_ms}ms</div>
          <div className="absolute top-3 right-3 text-blue-500"><Activity className="w-4 h-4" /></div>
        </div>
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-3 rounded-xl relative shadow-sm`}>
          <div className={`text-[9px] font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>Data Centers</div>
          <div className="text-xl font-black text-purple-500 mt-0.5">3</div>
          <div className="absolute top-3 right-3 text-purple-500"><Database className="w-4 h-4" /></div>
        </div>
      </div>

      {/* Baris Tengah: Server Info & Gauges */}
      <div className="grid grid-cols-3 gap-3 h-32">
        <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-3 rounded-xl flex flex-col justify-between shadow-sm`}>
          <div className="flex items-center space-x-1.5">
            <Server className="w-4 h-4 text-blue-500" />
            <h3 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'} uppercase tracking-wider`}>Core Gateway Info</h3>
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between border-b border-slate-800/40 pb-1"><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Target Host</span><span className="font-mono font-semibold text-[10px]">{currentTelemetry?.target}</span></div>
            <div className="flex justify-between border-b border-slate-800/40 pb-1"><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Protocol</span><span className="font-mono font-semibold">ICMP / Network Ping</span></div>
            <div className="flex justify-between"><span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>Status SLA</span><span className="font-mono text-emerald-500 font-semibold">99.98% (Optimal)</span></div>
          </div>
        </div>

        <CircularGauge value={currentTelemetry?.latency_ms} max={200} label={langText?.latency || "Latency"} unit="ms" colorClass="text-blue-500" darkMode={darkMode} />
        <CircularGauge value={currentTelemetry?.download_mbps} max={100} label={langText?.download || "Download"} unit="Mbps" colorClass="text-emerald-500" darkMode={darkMode} />
      </div>

      {/* Baris Bawah: Grafik Recharts Berjalan */}
      <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-4 rounded-xl shadow-sm`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-blue-500" />
            <h2 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'} uppercase tracking-wider`}>
              {langText?.liveTicker || "Live Telemetry Ticker"}
            </h2>
          </div>
          <span className={`text-[10px] ${darkMode ? 'text-slate-400 bg-slate-950' : 'text-slate-600 bg-slate-100'} px-2.5 py-1 rounded font-mono`}>
            Sync: {currentTelemetry?.timestamp || "--:--:--"}
          </span>
        </div>

        {/* Kotak dimensi tetap tinggi 240px agar ResponsiveContainer dipaksa merender layout grafik */}
        <div className="w-full h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" stroke={darkMode ? '#64748b' : '#94a3b8'} tick={{fontSize: 9}} />
              <YAxis stroke={darkMode ? '#64748b' : '#94a3b8'} tick={{fontSize: 9}} unit=" ms" domain={[0, 'auto']} />
              <Tooltip contentStyle={{ backgroundColor: darkMode ? '#020617' : '#ffffff', borderColor: darkMode ? '#334155' : '#cbd5e1', borderRadius: '8px', color: darkMode ? '#fff' : '#0f172a', fontSize: '11px' }} />
              <Area type="monotone" dataKey="latency_ms" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#latencyGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
