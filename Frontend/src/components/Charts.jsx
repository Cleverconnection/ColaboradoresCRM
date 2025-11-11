import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Legend,
  CartesianGrid,
} from "recharts";

export default function Charts({ colaboradores }) {
  // 🧩 Normalizar texto e remover duplicados
  const normalize = (text) =>
    text?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const colaboradoresUnicos = Array.from(
    new Map(colaboradores.map((c) => [c.id, c])).values()
  );

  // 🟢 Filtrar apenas colaboradores ativos
  const ativos = colaboradoresUnicos.filter(
    (c) => normalize(c.situacao) === "ativo"
  );

  // 🕐 Função para formatar tempo de casa em anos e meses
  const formatarTempo = (meses) => {
    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;
    if (anos === 0) return `${mesesRestantes}m`;
    if (mesesRestantes === 0) return `${anos}a`;
    return `${anos}a ${mesesRestantes}m`;
  };

  // 📊 Gráfico de Barras - Top 10 ativos com mais tempo de casa
  const dataBar = ativos
    .map((c) => ({
      nome: c.nome?.split(" ")[0] || "N/A",
      meses: parseInt(c.mesesNaEmpresa || 0),
      tempoFormatado: formatarTempo(parseInt(c.mesesNaEmpresa || 0)),
    }))
    .sort((a, b) => b.meses - a.meses)
    .slice(0, 10);

  // 🥧 Gráfico de Pizza - Situação geral
  const ativosCount = colaboradoresUnicos.filter(
    (c) => normalize(c.situacao) === "ativo"
  ).length;
  const demitidosCount = colaboradoresUnicos.filter((c) => {
    const s = normalize(c.situacao);
    return s === "demitido" || s === "desligado";
  }).length;

  const dataPie = [
    { name: "Ativos", value: ativosCount },
    { name: "Demitidos", value: demitidosCount },
  ];

  const pieColors = ["#22c55e", "#ef4444", "#3b82f6", "#f59e0b"];

  // 📈 Evolução salarial individual (por colaborador ativo)
  const historicoSalarios = {};

  colaboradores
    .filter((c) => normalize(c.situacao) === "ativo" && c.dataPagamento)
    .forEach((c) => {
      if (!historicoSalarios[c.id]) historicoSalarios[c.id] = [];
      historicoSalarios[c.id].push({
        nome: c.nome,
        data: new Date(c.dataPagamento),
        salario: Number(c.salario || 0),
      });
    });

  // Ordenar por data e preparar datasets
  const datasets = Object.values(historicoSalarios)
    .map((historico) => {
      const ordenado = historico.sort((a, b) => a.data - b.data);
      return {
        nome: ordenado[0].nome.split(" ")[0],
        data: ordenado.map((h) => h.data.toISOString().split("T")[0]),
        salario: ordenado.map((h) => h.salario),
      };
    })
    .filter((ds) => ds.salario.length > 1); // mostra só quem teve evolução

  // Monta estrutura de linhas para o Recharts
  const todasDatas = [
    ...new Set(datasets.flatMap((d) => d.data)),
  ].sort((a, b) => new Date(a) - new Date(b));

  const dataLine = todasDatas.map((data) => {
    const linha = { data };
    datasets.forEach((d) => {
      const idx = d.data.indexOf(data);
      if (idx >= 0) linha[d.nome] = d.salario[idx];
    });
    return linha;
  });

  // 🎨 Tooltip customizado com conversão automática de meses → anos e meses
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-gray-300 font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => {
            let valorTexto;

            if (entry.name.includes("Salário")) {
              valorTexto = `Salário Médio: R$ ${entry.value.toLocaleString("pt-BR")}`;
            } else if (entry.name.includes("Tempo")) {
              const meses = entry.value;
              const anos = Math.floor(meses / 12);
              const restoMeses = meses % 12;

              let tempoFormatado = "";
              if (anos === 0) {
                tempoFormatado = `${meses} ${meses === 1 ? "mês" : "meses"}`;
              } else if (anos === 1 && restoMeses === 0) {
                tempoFormatado = "1 ano";
              } else if (anos === 1) {
                tempoFormatado = `1 ano e ${restoMeses} ${restoMeses === 1 ? "mês" : "meses"}`;
              } else if (anos > 1 && restoMeses === 0) {
                tempoFormatado = `${anos} anos`;
              } else {
                tempoFormatado = `${anos} anos e ${restoMeses} ${restoMeses === 1 ? "mês" : "meses"}`;
              }

              valorTexto = `Tempo de Casa: ${tempoFormatado}`;
            } else {
              valorTexto = `${entry.name}: ${entry.value}`;
            }

            return (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {valorTexto}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };


  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* 📊 Gráfico de Barras - Tempo de Casa */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl shadow-lg">
        <h2 className="text-gray-100 text-lg font-bold mb-2">
          Top 10 - Tempo de Casa (Ativos)
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Colaboradores ativos com mais tempo de empresa
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataBar}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="nome"
              stroke="#94A3B8"
              style={{ fontSize: "12px" }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis
              stroke="#94A3B8"
              style={{ fontSize: "12px" }}
              label={{
                value: "Meses na empresa",
                angle: -90,
                position: "insideLeft",
                fill: "#94A3B8",
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="meses"
              fill="#3B82F6"
              radius={[8, 8, 0, 0]}
              name="Tempo de Casa"
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 🥧 Gráfico de Pizza - Status */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl shadow-lg">
        <h2 className="text-gray-100 text-lg font-bold mb-2">
          Status dos Colaboradores
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Distribuição por situação
        </p>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dataPie}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              animationDuration={1000}
            >
              {dataPie.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value) => (
                <span className="text-gray-300">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 📈 Evolução Salarial Individual */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-xl shadow-lg xl:col-span-2">
        <h2 className="text-gray-100 text-lg font-bold mb-2">
          Evolução Salarial Individual (Ativos)
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Cada linha representa a evolução salarial de um colaborador ativo
        </p>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={dataLine}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="data"
              stroke="#94A3B8"
              style={{ fontSize: "12px" }}
              tickFormatter={(d) => new Date(d).toLocaleDateString("pt-BR")}
            />
            <YAxis
              stroke="#94A3B8"
              style={{ fontSize: "12px" }}
              tickFormatter={(v) => `R$ ${(v / 1000).toFixed(1)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="line"
              formatter={(value) => (
                <span className="text-gray-300">{value}</span>
              )}
            />
            {datasets.map((ds, i) => (
              <Line
                key={i}
                type="monotone"
                dataKey={ds.nome}
                stroke={`hsl(${(i * 47) % 360}, 70%, 60%)`}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
                animationDuration={800}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
