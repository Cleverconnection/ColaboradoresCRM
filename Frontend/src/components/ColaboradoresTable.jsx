import React, { useState } from "react";
import { ChevronDown, ChevronUp, UserCheck, UserX, ClipboardList } from "lucide-react";

export default function ColaboradoresTable({ colaboradores }) {
  const [mostrarTabela, setMostrarTabela] = useState(false);

  const normalize = (t) =>
    t?.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Ordenar pela data de pagamento (mais recente primeiro)
  const ordenarPorData = [...colaboradores].sort(
    (a, b) => new Date(b.dataPagamento) - new Date(a.dataPagamento)
  );

  // Funções utilitárias
  const formatarData = (data) =>
    data ? new Date(data).toLocaleDateString("pt-BR") : "-";

  const formatarMoeda = (valor) =>
    valor
      ? valor.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : "R$ 0,00";

  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-6 mt-8 shadow-lg transition-all duration-300">
      {/* Título */}
      <h2 className="text-gray-100 text-lg font-bold mb-3 border-b border-slate-700 pb-2 flex items-center gap-2">
        <ClipboardList className="text-blue-400" size={20} />
        Histórico de Colaboradores
      </h2>

      {/* Botão de expandir */}
      <button
        onClick={() => setMostrarTabela(!mostrarTabela)}
        className={`btn w-full justify-between ${
          mostrarTabela ? "btn-pdf" : "btn-excel"
        }`}
      >
        <div className="flex items-center gap-3">
          <ClipboardList size={18} />
          {mostrarTabela ? "Ocultar Lista de Colaboradores" : "Exibir Lista de Colaboradores"}
        </div>
        {mostrarTabela ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Tabela */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          mostrarTabela ? "max-h-[1000px] mt-5 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {mostrarTabela && (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-slate-700 text-gray-200 text-sm rounded-lg overflow-hidden">
              <thead className="bg-slate-700/50 text-gray-300 uppercase text-xs tracking-wider">
                <tr>
                  {[
                    "ID",
                    "Nome",
                    "Cargo",
                    "Data Admissão",
                    "Data Pagamento",
                    "Salário",
                    "Valor a Pagar",
                    "Modo",
                    "Situação",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left border-b border-slate-700"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ordenarPorData.map((c, i) => {
                  const situacao = normalize(c.situacao);
                  const iconeSituacao =
                    situacao === "ativo" ? (
                      <UserCheck className="w-5 h-5 text-green-400 inline-block" />
                    ) : (
                      <UserX className="w-5 h-5 text-red-400 inline-block" />
                    );

                  return (
                    <tr
                      key={i}
                      className={`transition-all duration-200 ${
                        i % 2 === 0
                          ? "bg-slate-800/40"
                          : "bg-slate-900/40"
                      } hover:bg-slate-700/40`}
                    >
                      <td className="px-4 py-2 border-b border-slate-700">{c.id}</td>
                      <td className="px-4 py-2 border-b border-slate-700">{c.nome}</td>
                      <td className="px-4 py-2 border-b border-slate-700">{c.cargo}</td>
                      <td className="px-4 py-2 border-b border-slate-700">
                        {formatarData(c.dataAdmissao)}
                      </td>
                      <td className="px-4 py-2 border-b border-slate-700">
                        {formatarData(c.dataPagamento)}
                      </td>
                      <td className="px-4 py-2 border-b border-slate-700">
                        {formatarMoeda(c.salario)}
                      </td>
                      <td className="px-4 py-2 border-b border-slate-700">
                        {formatarMoeda(c.valorPagar)}
                      </td>
                      <td className="px-4 py-2 border-b border-slate-700">{c.modo}</td>
                      <td className="px-4 py-2 border-b border-slate-700 text-center">
                        {iconeSituacao}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
