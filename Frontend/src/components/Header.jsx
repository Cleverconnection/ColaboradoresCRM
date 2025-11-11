import React from "react";
import { LogOut, User } from "lucide-react";
import { msalInstance } from "../services/auth";

export default function Header({ account }) {
  const handleLogout = () => {
    msalInstance.logoutPopup();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 px-6 py-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-blue-400 drop-shadow-md">
            Painel de Colaboradores
          </h1>

          <p className="text-sm text-gray-400 mt-0.5">Gerencie seus colaboradores</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-600/50">
            <div className="bg-blue-600/20 p-2 rounded-full">
              <User size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-200">{account?.name || 'Usuário'}</p>
              <p className="text-xs text-gray-400">{account?.username || ''}</p>
            </div>
          </div>
          
          <button
            className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 px-4 py-2 rounded-lg text-red-400 text-sm font-medium transition-all hover:scale-105 active:scale-95"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}