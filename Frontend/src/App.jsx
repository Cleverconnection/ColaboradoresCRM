import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Colaboradores from "./pages/Colaboradores";
import Relatorios from "./pages/Relatorios";
import ScrollToTopButton from "./components/ScrollToTopButton";

import { msalInstance, loginRequest } from "./services/auth";

export default function App() {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        await msalInstance.initialize();
        const acc = msalInstance.getAllAccounts();
        if (acc.length > 0) {
          setAccount(acc[0]);
        } else {
          const loginResp = await msalInstance.loginPopup(loginRequest);
          msalInstance.setActiveAccount(loginResp.account);
          setAccount(loginResp.account);
        }
      } catch (error) {
        console.error("Erro na autenticação:", error);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  if (loading || !account) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin animation-delay-150"></div>
        </div>
        <p className="mt-6 text-gray-300 text-lg font-medium animate-pulse">
          Entrando com Microsoft...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .animation-delay-150 {
            animation-delay: 150ms;
          }
        `}</style>

      </div>
    );
  }

  function App() {
    return (
      <div>
        <Header />
        <Sidebar />
        
        <main>
          {/* Suas rotas aqui */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/colaboradores" element={<Colaboradores />} />
            <Route path="/relatorios" element={<Relatorios />} />
          </Routes>
        </main>
        
        {/* Botão global - aparece em TODAS as páginas */}
        <ScrollToTopButton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-gray-200 flex">
      {/* Sidebar fixa à esquerda */}
      <Sidebar />

      {/* Conteúdo principal ocupa toda área restante */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <Header account={account} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto max-w-[1200px] mx-auto w-full">
          <Dashboard account={account} />
        </main>
      </div>
    </div>
  );

}