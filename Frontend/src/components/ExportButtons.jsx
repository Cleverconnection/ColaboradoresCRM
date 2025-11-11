import React, { useState } from "react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FileSpreadsheet, FileText, Download } from "lucide-react";

export default function ExportButtons({ colaboradores }) {
  const [exporting, setExporting] = useState(null);

  const exportExcel = async () => {
    setExporting("excel");
    try {
      const dataToExport = colaboradores.map(({ rowIndex, ...rest }) => rest);
      const worksheet = XLSX.utils.json_to_sheet(dataToExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Colaboradores");
      XLSX.writeFile(
        workbook,
        `Colaboradores_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } catch (error) {
      console.error("Erro ao exportar Excel:", error);
    } finally {
      setExporting(null);
    }
  };

  const exportPDF = async () => {
    setExporting("pdf");
    try {
      const doc = new jsPDF("l", "mm", "a4");
      doc.setFontSize(18);
      doc.setTextColor(59, 130, 246);
      doc.text("Relatório de Colaboradores", 14, 15);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 14, 22);

      const dataToExport = colaboradores.map(({ rowIndex, ...rest }) => rest);
      const headers = [Object.keys(dataToExport[0] || {})];
      const data = dataToExport.map((obj) => Object.values(obj));

      doc.autoTable({
        startY: 28,
        head: headers,
        body: data,
        theme: "grid",
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: {
          fillColor: [37, 99, 235],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: { fillColor: [241, 245, 249] },
      });

      const totalPages = doc.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Página ${i} de ${totalPages}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      doc.save(`Colaboradores_${new Date().toISOString().split("T")[0]}.pdf`);
    } catch (error) {
      console.error("Erro ao exportar PDF:", error);
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mt-3">
      <button
        onClick={exportExcel}
        disabled={exporting !== null}
        className={`btn btn-excel ${exporting === "excel" ? "btn-loading" : ""}`}
      >
        {exporting === "excel" ? (
          <>
            <Download size={16} className="animate-spin" />
            Exportando...
          </>
        ) : (
          <>
            <FileSpreadsheet size={16} />
            Exportar Excel
          </>
        )}
      </button>

      <button
        onClick={exportPDF}
        disabled={exporting !== null}
        className={`btn btn-pdf ${exporting === "pdf" ? "btn-loading" : ""}`}
      >
        {exporting === "pdf" ? (
          <>
            <Download size={16} className="animate-spin" />
            Exportando...
          </>
        ) : (
          <>
            <FileText size={16} />
            Exportar PDF
          </>
        )}
      </button>
    </div>
  );
}
