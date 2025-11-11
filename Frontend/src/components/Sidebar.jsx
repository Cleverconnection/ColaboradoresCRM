import React, { useState } from "react";
import logo from "../assets/logo.png";
import { BarChart3, Users, FileText, Menu, X } from "lucide-react";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  const [activeItem, setActiveItem] = React.useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: BarChart3, target: "dashboard" },
    { name: "Evolução Salarial", icon: Users, target: "evolucao-salarial" },
    { name: "Relatórios", icon: FileText, target: "relatorios" },
  ];

  const scrollToSection = (target) => {
    const section = document.getElementById(target);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActiveItem(target.charAt(0).toUpperCase() + target.slice(1));
      if (window.innerWidth < 1024) setIsOpen(false);
    }
  };

  return (
    <>
      {/* Botão de menu (mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-[1001] p-2 bg-slate-800 rounded-lg border border-slate-700 text-gray-300 hover:bg-slate-700 transition-colors"
      >
        {isOpen ? <X size={22} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-[1002] 
        w-72 flex flex-col border-r border-slate-700/50 
        bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#334155]
        shadow-xl transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700/50 mt-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <img
                src={logo}
                alt="Logo"
                className="max-w-[70px] h-auto rounded-xl shadow-lg object-contain mx-auto"
              />
              <div className="absolute inset-0 bg-blue-500/20 rounded-xl animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Clever Connection
              </h2>
              <p className="text-xs text-gray-400">CRM System</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;

            return (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.target)}
                className={`sidebar-btn ${isActive ? "active" : ""}`}
              >
                <Icon size={20} />
                <span>{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Status */}
        <div className="p-4 border-t border-slate-700/50">
          <div className="bg-gradient-to-br from-blue-600/10 to-cyan-600/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2">Status do Sistema</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-400">Operacional</span>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-slate-700/50">
          <p className="text-xs text-center text-gray-500">© 2025 Clever Connection</p>
          <p className="text-xs text-center text-gray-600 mt-1">Versão 1.0.0</p>
        </div>
      </aside>
    </>
  );
}
