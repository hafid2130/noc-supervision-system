import React from 'react';
import { Network, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function NetworkMonitor({ currentTelemetry, darkMode }) {
  // Leverage the incoming active node counts or fall back to standard asset metrics
  const activeNodesCount = currentTelemetry?.active_nodes ?? 5;

  const clientNodes = [
    { id: "NODE-01", name: "Core-Router-MikroTik", ip: "192.168.10.1", latency: currentTelemetry?.latency_ms ? `${currentTelemetry.latency_ms} ms` : "12 ms", status: "ONLINE", uptime: "99.99%" },
    { id: "NODE-02", name: "Distribution-Switch-01", ip: "192.168.10.2", latency: "18 ms", status: "ONLINE", uptime: "99.95%" },
    { id: "NODE-03", name: "Access-Point-Floor-1", ip: "192.168.20.10", latency: "24 ms", status: "ONLINE", uptime: "99.80%" },
    { id: "NODE-04", name: "Database-Server-Cluster", ip: "192.168.50.5", latency: "8 ms", status: "ONLINE", uptime: "100.0%" },
    { id: "NODE-05", name: "Backup-Gateway-Cisco", ip: "192.168.10.254", latency: "35 ms", status: "ONLINE", uptime: "99.90%" }
  ];

  return (
    <div className="flex-1 flex flex-col gap-3 overflow-hidden">
      <div className={`${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border p-4 rounded-xl flex items-center justify-between shadow-sm shrink-0`}>
        <div className="flex items-center space-x-2">
          <Network className="w-5 h-5 text-blue-500" />
          <div>
            <h2 className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-slate-900'} uppercase tracking-wider`}>Client Network Infrastructure Topology ({activeNodesCount} Nodes Detected)</h2>
            <p className={`text-[11px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Live status monitoring of customer active assets & gateways.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-lg border border-emerald-500/30 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> SLA Compliant
          </span>
        </div>
      </div>

      <div className={`flex-1 ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200'} border rounded-xl overflow-hidden shadow-sm flex flex-col`}>
        <div className="overflow-y-auto flex-1 p-2">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className={`border-b ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'} uppercase text-[10px]`}>
                <th className="p-3">Node ID & Name</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Latency (RTT)</th>
                <th className="p-3">Uptime SLA</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-800/60 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
              {clientNodes.map((node, index) => (
                <tr key={index} className={`hover:${darkMode ? 'bg-slate-800/40' : 'bg-slate-50'} transition-colors`}>
                  <td className="p-3 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <div>
                      <div className={darkMode ? 'text-white' : 'text-slate-900'}>{node.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{node.id}</div>
                    </div>
                  </td>
                  <td className="p-3 font-mono">{node.ip}</td>
                  <td className="p-3 font-mono text-blue-500 font-bold">{node.latency}</td>
                  <td className="p-3 font-mono text-emerald-500">{node.uptime}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-bold border border-emerald-500/20 inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {node.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
