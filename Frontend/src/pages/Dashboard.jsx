import React, { useEffect, useState } from "react";
import StatsCards from "../components/StatsCards";
import Charts from "../components/Charts";
import ColaboradoresTable from "../components/ColaboradoresTable";
import ExportButtons from "../components/ExportButtons";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { getColaboradores } from "../services/api";
import { msalInstance, loginRequest } from "../services/auth";

export default function Dashboard({ account }) {
  const [colaboradores, setColaboradores] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const result = await msalInstance.acquireTokenSilent({
          ...loginRequest,
          account,
          forceRefresh: true,
        });
        setToken(result.accessToken);
        const data = await getColaboradores(result.accessToken);
        setColaboradores(data);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [account]);

  return (
    <>
      <div className="space-y-12 scroll-smooth relative">
        {/* Seção principal do Dashboard */}
        <section id="dashboard">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-100">Dashboard</h2>
              <p className="text-sm text-gray-400 mt-1">
                Visão geral dos colaboradores
              </p>
            </div>
          </div>

          <StatsCards colaboradores={colaboradores} />
        </section>

        {/* Seção de Evolução Salarial */}
        <section id="evolucao-salarial">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">
            Evolução Salarial
          </h2>
          <Charts colaboradores={colaboradores} />
        </section>

        {/* Seção da Tabela de Colaboradores */}
        <section id="colaboradores">
          <ColaboradoresTable
            colaboradores={colaboradores}
            setColaboradores={setColaboradores}
            token={token}
          />
        </section>

        {/* Botões de Exportação e Relatórios */}
        <section id="relatorios">
          <div className="pt-6 border-t border-slate-700 mt-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-2">
              Relatórios
            </h2>
            <p className="text-gray-400 mb-4 text-sm">
              Gere relatórios completos de colaboradores em PDF ou Excel.
            </p>
            <ExportButtons colaboradores={colaboradores} />
          </div>
        </section>
      </div>

      {/* Botão flutuante */}
      <ScrollToTopButton />
    </>
  );
}