import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Server, Globe, CheckCircle2, AlertTriangle, LayoutDashboard, Network, Terminal, User, Sun, Moon, Languages, Lock, Unlock } from 'lucide-react';

import DashboardMatrix from './components/DashboardMatrix';
import NetworkMonitor from './components/NetworkMonitor';
import Aidiagnostics from './components/Aidiagnostics';

const SOCKET_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:5000';

const t = {
  id: {
    system: "SISTEM NOC",
    subtitle: "Enterprise Supervision",
    overview: "RINGKASAN",
    dashboardMatrix: "Matriks Dashboard",
    networkMonitor: "Monitor Jaringan",
    aiDiagnostics: "Diagnostik AI",
    operations: "OPERASIONAL",
    operator: "Operator NOC",
    mode: "Mode",
    logout: "Keluar",
    login: "Masuk",
    activeModule: "MODUL AKTIF",
    targetNode: "Target Node",
    healthy: "SEHAT",
    warning: "PERINGATAN",
    latency: "Latensi (RTT)",
    download: "Throughput Download",
    liveTicker: "Stream Telemetri Latensi Langsung",
    aiBtn: "Jalankan Diagnostik AI",
    aiAnalyzing: "Menganalisis...",
    rbacPanel: "Panel Kontrol NOC",
    adminActive: "Admin Aktif",
    targetHost: "Target Host:",
    saveConfig: "Simpan",
    visitorMsg: "Mode Visitor (Terkunci)",
    pinBtn: "PIN Admin",
    modaltitle: "Autentikasi Administrator",
    modaldesc: "Masukkan PIN Admin (Default: 2026)",
    cancel: "Batal",
  }
};

export default function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [telemetryData, setTelemetryData] = useState({
    latency_ms: 0,
    download_mbps: 0,
    upload_mbps: 0,
    status: 'HEALTHY',
    message: 'Menghubungkan ke server telemetri...',
    timestamp: '--:--',
    target: '1.1.1.1 (Cloudflare Edge)'
  });

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Terhubung ke backend WebSocket Render');
    });

    socket.on('telemetry_stream', (data) => {
      setTelemetryData(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      {/* Sidebar Sederhana */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <h1 className="text-xl font-bold tracking-wider text-blue-400">{t.id.system}</h1>
            <p className="text-xs text-slate-400">{t.id.subtitle}</p>
          </div>
          <nav className="space-y-2">
            <button 
              onClick={() => setActiveModule('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeModule === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <LayoutDashboard size={18} />
              <span>{t.id.dashboardMatrix}</span>
            </button>
            <button 
              onClick={() => setActiveModule('network')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeModule === 'network' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Network size={18} />
              <span>{t.id.networkMonitor}</span>
            </button>
            <button 
              onClick={() => setActiveModule('ai')}
              className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${activeModule === 'ai' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Terminal size={18} />
              <span>{t.id.aiDiagnostics}</span>
            </button>
          </nav>
        </div>
        <div className="text-xs text-slate-500 border-t border-slate-800 pt-4">
          Target: {telemetryData.target}
        </div>
      </aside>

      {/* Konten Utama */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
          <div>
            <span className="text-xs text-slate-400 uppercase tracking-wider">{t.id.activeModule}</span>
            <h2 className="text-lg font-bold text-blue-400 uppercase">{activeModule}</h2>
          </div>
          <div className="flex items-center space-x-3 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
            <span className="text-sm font-medium">Status:</span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${telemetryData.status === 'HEALTHY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              {telemetryData.status}
            </span>
          </div>
        </header>

        {activeModule === 'dashboard' && <DashboardMatrix data={telemetryData} />}
        {activeModule === 'network' && <NetworkMonitor data={telemetryData} />}
        {activeModule === 'ai' && <Aidiagnostics data={telemetryData} />}
      </main>
    </div>
  );
}
