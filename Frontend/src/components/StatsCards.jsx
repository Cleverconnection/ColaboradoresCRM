import React from "react";
import { Users, UserCheck, UserX, DollarSign, TrendingUp, Calendar } from "lucide-react";

export default function StatsCards({ colaboradores }) {

  // 🧹 Normaliza texto (remove acentos e força minúsculas)
  const normalize = (text) =>
    text?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // 🧩 Remover duplicados com base no ID
  const colaboradoresUnicos = Array.from(
    new Map(colaboradores.map(c => [c.id, c])).values()
  );

  // 👥 Total de colaboradores únicos (ativos + desligados)
  const total = colaboradoresUnicos.length;

  // 🟢 Ativos únicos
  const ativosUnicos = Array.from(
    new Map(
      colaboradoresUnicos
        .filter(c => normalize(c.situacao) === "ativo")
        .map(c => [c.id, c])
    ).values()
  );

  const ativos = ativosUnicos.length;

  // 🔴 Demitidos únicos
  const demitidosUnicos = Array.from(
    new Map(
      colaboradoresUnicos
        .filter(c => {
          const s = normalize(c.situacao);
          return s === "demitido" || s === "desligado";
        })
        .map(c => [c.id, c])
    ).values()
  );

  const demitidos = demitidosUnicos.length;

  // 💰 Média Salarial (somente ativos)
  const salariosValidos = ativosUnicos
    .map(c => parseFloat(String(c.salario).replace(/[^\d.-]/g, "")))
    .filter(v => !isNaN(v) && v > 0);

  const mediaSalarial = salariosValidos.length
    ? Math.round(salariosValidos.reduce((a, b) => a + b, 0) / salariosValidos.length)
    : 0;

  // ⏳ Tempo médio de casa (em meses)
  const mediaTempoCasa = Math.round(
    colaboradoresUnicos.reduce((s, c) => s + Number(c.mesesNaEmpresa || 0), 0) /
    (colaboradoresUnicos.length || 1)
  );

  // 📈 Taxa de Retenção (%)
  const taxaRetencao = total > 0 ? ((ativos / total) * 100).toFixed(1) : 0;

  // 📋 Nomes agrupados
  const nomesAtivos = ativosUnicos.map(c => c.nome).join(", ");
  const nomesDemitidos = demitidosUnicos.map(c => c.nome).join(", ");
  const nomesTotal = colaboradoresUnicos.map(c => c.nome).join(", ");

  // 📊 Cards
  const cards = [
    {
      label: "Total de Colaboradores",
      value: total,
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      tooltipTitle: "Todos os colaboradores",
      tooltipText: nomesTotal || "Nenhum colaborador encontrado",
    },
    {
      label: "Ativos",
      value: ativos,
      icon: <UserCheck className="w-6 h-6" />,
      color: "from-green-500 to-green-600",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-400",
      tooltipTitle: "Colaboradores Ativos",
      tooltipText: nomesAtivos || "Nenhum colaborador ativo",
    },
    {
      label: "Demitidos",
      value: demitidos,
      icon: <UserX className="w-6 h-6" />,
      color: "from-red-500 to-red-600",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      tooltipTitle: "Colaboradores Demitidos",
      tooltipText: nomesDemitidos || "Nenhum colaborador demitido",
    },
    {
      label: "Média Salarial (Ativos)",
      value: `R$ ${mediaSalarial.toLocaleString("pt-BR")}`,
      icon: <DollarSign className="w-6 h-6" />,
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
    },
    {
      label: "Taxa de Retenção",
      value: `${taxaRetencao}%`,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-cyan-500 to-cyan-600",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-400",
    },
    {
      label: "Tempo Médio (meses)",
      value: mediaTempoCasa,
      icon: <Calendar className="w-6 h-6" />,
      color: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
    },
  ];

  // 💅 Renderização
  return (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {cards.map((card, i) => (
      <div
        key={i}
        className="relative group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-5 rounded-xl hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
        onClick={(e) => {
          // 🎯 Suporte mobile: mostra tooltip temporariamente ao tocar
          const tooltip = e.currentTarget.querySelector(".tooltip");
          if (tooltip) {
            tooltip.classList.remove("hidden");
            tooltip.classList.add("opacity-100");
            setTimeout(() => {
              tooltip.classList.add("hidden");
              tooltip.classList.remove("opacity-100");
            }, 2000);
          }
        }}
      >
        {/* Efeito hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        ></div>

        {/* Conteúdo */}
        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <p className="text-gray-400 text-sm font-medium mb-2">{card.label}</p>
            <p className="text-3xl font-bold text-gray-100">{card.value}</p>
          </div>
          <div className={`${card.iconBg} ${card.iconColor} p-3 rounded-lg`}>
            {card.icon}
          </div>
        </div>

        {/* Tooltip */}
        {card.tooltipText && (
          <div className="tooltip absolute bottom-full left-0 mb-2 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900 text-gray-200 text-sm p-3 rounded-lg shadow-lg w-64 z-50 border border-slate-700">
            <strong>{card.tooltipTitle}</strong>
            <p className="text-gray-400 mt-1 leading-tight text-justify break-words">
              {card.tooltipText}
            </p>
          </div>
        )}
      </div>
    ))}
  </div>
);

}
