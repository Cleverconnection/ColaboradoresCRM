import React from "react";
import Charts from "../components/Charts";
import ScrollToTopButton from "../components/ScrollToTopButton";

export default function Relatorios() {
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-400 mb-4">
          Relatórios e Indicadores
        </h1>
        <p className="text-gray-300 mb-6">
          Visualize métricas detalhadas de desempenho e evolução dos colaboradores.
        </p>
        <Charts />
      </div>
      
      <ScrollToTopButton />
    </>
  );
}