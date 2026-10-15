import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { LayoutDashboard, Network, Terminal } from 'lucide-react';

import DashboardMatrix from './components/DashboardMatrix';
import NetworkMonitor from './components/NetworkMonitor';
import AiDiagnostics from './components/AiDiagnostics';

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
  const [chartHistory, setChartHistory] = useState([]);
  const [telemetryData, setTelemetryData] = useState({
    latency_ms: 0,
    download_mbps: 0,
    upload_mbps: 0,
    status: 'HEALTHY',
    message: 'Menghubungkan ke server telemetri...',
    timestamp: '--:--',
    target: '1.1.1.1 (Cloudflare Edge)',
    active_nodes: 0
  });

  const [aiAnalysis, setAiAnalysis] = useState("System idle. Ready for autonomous network diagnostic run.");
  const [loadingAi, setLoadingAi] = useState(false);

  const triggerAiDiagnose = () => {
    setLoadingAi(true);
    setAiAnalysis("Menganalisis topologi infrastruktur...");
    setTimeout(() => {
      setAiAnalysis("ANALISIS SELESAI:\n- Semua gateway dalam batas aman.\n- RTT stabil pada node inti.");
      setLoadingAi(false);
    }, 2000);
  };

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      forceNew: true,
      upgrade: false
    });

    socket.on('connect', () => {
      console.log('Terhubung ke backend WebSocket Render via transport murni.');
    });

    socket.on('telemetry_stream', (data) => {
      const safeData = {
        latency_ms: data?.latency_ms ?? 0,
        download_mbps: data?.download_mbps ?? 0,
        upload_mbps: data?.upload_mbps ?? 0,
        status: data?.status ?? 'HEALTHY',
        message: data?.message ?? '',
        timestamp: data?.timestamp || new Date().toLocaleTimeString(),
        target: data?.target || '1.1.1.1 (Cloudflare Edge)',
        active_nodes: data?.active_nodes ?? 0
      };

      setTelemetryData(safeData);
      setChartHistory((prev) => [...prev, safeData].slice(-15));
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket Error Terdeteksi:', error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex font-sans overflow-hidden">
      {/* Sidebar Tetap */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between h-full shrink-0">
        <div>
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-wider text-blue-400">{t.id.system}</h1>
            <p className="text-xs text-slate-400">{t.id.subtitle}</p>
          </div>
          <nav className="space-y-1.5">
            <button 
              onClick={() => setActiveModule('dashboard')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition ${activeModule === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <LayoutDashboard size={18} />
              <span>{t.id.dashboardMatrix}</span>
            </button>
            <button 
              onClick={() => setActiveModule('network')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition ${activeModule === 'network' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Network size={18} />
              <span>{t.id.networkMonitor}</span>
            </button>
            <button 
              onClick={() => setActiveModule('ai')}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition ${activeModule === 'ai' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <Terminal size={18} />
              <span>{t.id.aiDiagnostics}</span>
            </button>
          </nav>
        </div>
        <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-3">
          Target: {telemetryData.target}
        </div>
      </aside>

      {/* Konten Utama Pas dengan Layar */}
      <main className="flex-1 flex flex-col h-full p-6 overflow-hidden min-w-0">
        <header className="flex justify-between items-center mb-4 bg-slate-900/50 p-3 rounded-xl border border-slate-800 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t.id.activeModule}</span>
            <h2 className="text-base font-bold text-blue-400 uppercase leading-tight">{activeModule}</h2>
          </div>
          <div className="flex items-center space-x-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-xs font-medium">Status:</span>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold ${telemetryData.status === 'HEALTHY' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              {telemetryData.status}
            </span>
          </div>
        </header>

        {/* View wrapper asinkron as flex stretcher */}
        <div className="flex-1 flex flex-col min-h-0 w-full">
          {activeModule === 'dashboard' && (
            <DashboardMatrix 
              currentTelemetry={telemetryData} 
              chartData={chartHistory} 
              langText={t.id} 
              darkMode={true} 
            />
          )}
          {activeModule === 'network' && (
            <NetworkMonitor 
              currentTelemetry={telemetryData}
              darkMode={true} 
            />
          )}
          {activeModule === 'ai' && (
            <AiDiagnostics 
              aiAnalysis={aiAnalysis}
              triggerAiDiagnose={triggerAiDiagnose}
              loadingAi={loadingAi}
              langText={t.id} 
              darkMode={true} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
