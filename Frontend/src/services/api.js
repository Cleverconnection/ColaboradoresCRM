import axios from "axios";

const API_URL = "http://localhost:4000/api/colaboradores";

export const getColaboradores = async (token) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const colaboradores = res.data.map((c) => ({
    id: c.ID,
    nome: c.Nome,
    cargo: c.Cargo,
    dataAdmissao: convertExcelDate(c["Data Admissão"]),
    dataPagamento: convertExcelDate(c["Data Pagamento"]),
    salario: parseCurrency(c["Salário Combinado"]),
    valorPagar: parseCurrency(c["Valor a Pagar"]),
    modo: c.Modo || "",
    mesesNaEmpresa: Number(c["Meses na Empresa"] || 0),
    status: c.Status || "",
    situacao: c.Situação || "",
  }));

  return colaboradores;
};

// converte datas no formato Excel (ex: 45587 → "2024-10-22")
function convertExcelDate(excelSerial) {
  if (!excelSerial) return "";
  const date = new Date((excelSerial - 25569) * 86400 * 1000);
  return date.toISOString().split("T")[0];
}

// converte "R$ 4.000,00" → 4000
function parseCurrency(value) {
  if (!value) return 0;
  if (typeof value === "number") return value;
  return Number(
    value
      .toString()
      .replace(/[^\d,.-]/g, "") // remove R$ e espaços
      .replace(/\./g, "")       // remove pontos
      .replace(",", ".")        // vírgula decimal → ponto
  );
}


export const updateColaborador = async (rowIndex, data, token) => {
  await axios.put(`${API_URL}/${rowIndex}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
