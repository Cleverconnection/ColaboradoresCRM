import React from "react";
import ColaboradoresTable from "../components/ColaboradoresTable";
import ScrollToTopButton from "../components/ScrollToTopButton";

export default function Colaboradores() {
  return (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-blue-400 mb-4">
          Gestão de Colaboradores
        </h1>
        <p className="text-gray-300 mb-6">
          Veja, edite e gerencie informações sobre todos os colaboradores.
        </p>
        <ColaboradoresTable />
      </div>
      
      <ScrollToTopButton />
    </>
  );
}