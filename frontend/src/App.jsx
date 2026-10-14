import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { Server, Globe, CheckCircle2, AlertTriangle, LayoutDashboard, Network, Terminal, User, Sun, Moon, Languages, Lock, Unlock } from 'lucide-react';

import DashboardMatrix from './components/DashboardMatrix';
import NetworkMonitor from './components/NetworkMonitor';
import AiDiagnostics from './components/AiDiagnostics';

const SOCKET_URL = 'http://127.0.0.1:5000';

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
    modalTitle: "Autentikasi Administrator",
    modalDesc: "Masukkan PIN Admin (Default: 2026)",
    cancel: "Batal",
    submit: "Masuk"
  },
  en: {
    system: "NOC SYSTEM",
    subtitle: "Enterprise Supervision",
    overview: "OVERVIEW",
    dashboardMatrix: "Dashboard Matrix",
    networkMonitor: "Network Monitor",
    aiDiagnostics: "AI Diagnostics",
    operations: "OPERATIONS",
    operator: "NOC Operator",
    mode: "Mode",
    logout: "Logout",
    login: "Login",
    activeModule: "ACTIVE MODULE",
    targetNode: "Target Node",
    healthy: "HEALTHY",
    warning: "WARNING",
    latency: "Latency (RTT)",
    download: "Download Throughput",
    liveTicker: "Live Latency Telemetry Stream",
    aiBtn: "Run AI Diagnostics",
    aiAnalyzing: "Analyzing...",
    rbacPanel: "NOC Control Panel",
    adminActive: "Admin Active",
    targetHost: "Target Host:",
    saveConfig: "Save",
    visitorMsg: "Visitor Mode (Locked)",
    pinBtn: "Admin PIN",
    modalTitle: "Administrator Authentication",
    modalDesc: "Enter Admin PIN (Default: 2026)",
    cancel: "Cancel",
    submit: "Enter"
  }
};

export default function App() {
  const [socket, setSocket] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [currentTelemetry, setCurrentTelemetry] = useState({
    timestamp: '--:--',
    target: '1.1.1.1 (Cloudflare Edge)',
    latency_ms: 0,
    download_mbps: 0,
    upload_mbps: 0,
    status: 'HEALTHY',
    message: 'Connected',
  });

  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [role, setRole] = useState('user'); 
  const [adminPin, setAdminPin] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('Menunggu analisis telemetri jaringan...');
  const [loadingAi, setLoadingAi] = useState(false);

  const [darkMode, setDarkMode] = useState(true);
  const [lang, setLang] = useState('id');
  const langText = t[lang];

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('telemetry_stream', (data) => {
      setCurrentTelemetry(data);
      setChartData((prev) => {
        const updated = [...prev, data];
        if (updated.length > 20) updated.shift();
        return updated;
      });
    });

    return () => newSocket.disconnect();
  }, []);

  const triggerAiDiagnose = async () => {
    setLoadingAi(true);
    try {
      const response = await fetch(`${SOCKET_URL}/api/ai-diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latency: currentTelemetry.latency_ms })
      });
      const result = await response.json();
      setAiAnalysis(result.analysis);
    } catch (e) {
      setAiAnalysis('Gagal menghubungi AI Server.');
    }
    setLoadingAi(false);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPin === '2026') {
      setRole('admin');
      setShowLoginModal(false);
      setAdminPin('');
      setLoginError('');
    } else {
      setLoginError('PIN Salah! (2026)');
    }
  };

  return (
    <div className={`h-screen w-screen ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} font-sans flex overflow-hidden transition-colors`}>
      
      {/* SIDEBAR NAVIGASI */}
      <aside className={`w-56 ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border-r flex flex-col justify-between shrink-0 select-none z-20`}>
        <div>
          <div className={`p-3.5 border-b ${darkMode ? 'border-slate-800' : 'border-slate-200'} flex items-center space-x-2.5`}>
            <div className="p-1.5 bg-blue-600/20 border border-blue-500/40 rounded-lg text-blue-500 shadow-inner">
              <Server className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h1 className="text-[11px] font-black tracking-wider">{langText.system}</h1>
              <p className={`text-[9px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{langText.subtitle}</p>
            </div>
          </div>

          <div className="p-3 space-y-1">
            <div className={`text-[9px] font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider px-2 mb-1`}>{langText.overview}</div>
            
            <button 
              onClick={() => setActiveMenu('dashboard')}
              className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-[11px] font-semibold transition ${activeMenu === 'dashboard' ? 'bg-blue-600 text-white shadow' : darkMode ? 'text-slate-400 hover:bg-slate-800/60' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{langText.dashboardMatrix}</span>
            </button>

            <button 
              onClick={() => setActiveMenu('netmon')}
              className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-[11px] font-semibold transition ${activeMenu === 'netmon' ? 'bg-blue-600 text-white shadow' : darkMode ? 'text-slate-400 hover:bg-slate-800/60' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>{langText.networkMonitor}</span>
            </button>

            <div className={`text-[9px] font-bold ${darkMode ? 'text-slate-500' : 'text-slate-400'} uppercase tracking-wider px-2 mt-4 mb-1`}>{langText.operations}</div>
            
            <button 
              onClick={() => setActiveMenu('diagnostics')}
              className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-lg text-[11px] font-semibold transition ${activeMenu === 'diagnostics' ? 'bg-blue-600 text-white shadow' : darkMode ? 'text-slate-400 hover:bg-slate-800/60' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>{langText.aiDiagnostics}</span>
            </button>
          </div>
        </div>

        {/* User Profile Footer */}
        <div className={`p-3 border-t ${darkMode ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-500 font-bold text-[10px]">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-[11px] font-bold">{langText.operator}</div>
                <div className={`text-[9px] ${darkMode ? 'text-slate-400' : 'text-slate-500'} uppercase`}>{langText.mode}: {role}</div>
              </div>
            </div>
            {role === 'admin' ? (
              <button onClick={() => setRole('user')} className="text-[9px] text-rose-500 hover:underline">{langText.logout}</button>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="text-[9px] text-blue-500 hover:underline">{langText.login}</button>
            )}
          </div>
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <header className={`${darkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white/80 border-slate-200'} backdrop-blur border-b px-4 py-2 flex items-center justify-between shrink-0`}>
          <div className="flex items-center space-x-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{langText.activeModule}:</span>
            <span className="text-[10px] font-extrabold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{activeMenu.toUpperCase()}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button onClick={() => setDarkMode(!darkMode)} className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 ${darkMode ? 'bg-slate-900 border-slate-800 text-amber-400' : 'bg-white border-slate-200 text-slate-700'}`}>
              {darkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
            </button>

            <button onClick={() => setLang(lang === 'id' ? 'en' : 'id')} className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 ${darkMode ? 'bg-slate-900 border-slate-800 text-blue-400' : 'bg-white border-slate-200 text-blue-600'}`}>
              <Languages className="w-3 h-3" />
              <span>{lang.toUpperCase()}</span>
            </button>

            <div className={`hidden lg:flex items-center space-x-1.5 text-[10px] ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} px-2.5 py-1 rounded-lg border`}>
              <Globe className="w-3 h-3 text-emerald-500 animate-spin" />
              <span className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{langText.targetNode}: <strong className={darkMode ? 'text-white' : 'text-slate-900'}>{currentTelemetry.target}</strong></span>
            </div>

            <span className={`px-2 py-0.5 text-[10px] rounded-lg font-bold flex items-center gap-1 ${currentTelemetry.status === 'HEALTHY' ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-500 border border-amber-500/30'}`}>
              {currentTelemetry.status === 'HEALTHY' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
              {currentTelemetry.status === 'HEALTHY' ? langText.healthy : langText.warning}
            </span>
          </div>
        </header>

        {/* RENDER MODUL DINAMIS BERDASARKAN SIDEBAR */}
        <main className="flex-1 p-3.5 flex flex-col overflow-hidden">
          {activeMenu === 'dashboard' && (
            <DashboardMatrix currentTelemetry={currentTelemetry} chartData={chartData} langText={langText} darkMode={darkMode} />
          )}
          {activeMenu === 'netmon' && (
            <NetworkMonitor darkMode={darkMode} />
          )}
          {activeMenu === 'diagnostics' && (
            <AiDiagnostics aiAnalysis={aiAnalysis} triggerAiDiagnose={triggerAiDiagnose} loadingAi={loadingAi} langText={langText} darkMode={darkMode} />
          )}
        </main>
      </div>

      {/* MODAL ADMIN LOGIN */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'} border p-5 rounded-xl max-w-xs w-full shadow-2xl space-y-3`}>
            <h3 className="text-xs font-bold flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-500" /> {langText.modalTitle}
            </h3>
            <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{langText.modalDesc}</p>

            <form onSubmit={handleAdminLogin} className="space-y-2">
              <input 
                type="password" placeholder="PIN: 2026" value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className={`w-full ${darkMode ? 'bg-slate-950 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'} border rounded-lg px-3 py-1.5 text-xs focus:outline-none`}
                autoFocus
              />
              {loginError && <p className="text-[10px] text-rose-500 font-semibold">{loginError}</p>}
              
              <div className="flex justify-end space-x-1.5 pt-1">
                <button type="button" onClick={() => setShowLoginModal(false)} className={`px-3 py-1 ${darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'} text-[10px] rounded-lg`}>{langText.cancel}</button>
                <button type="submit" className="px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-lg shadow">{langText.submit}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}