import axios from "axios";

// IDs fixos da sua planilha no SharePoint
const siteId = "d21efab6-83a1-47d8-86ec-68296b31442f";
const driveId = "b!tvoe0qGD2EeG7GgpazFEL5xBSoVgpDdMqENBL3FYLvPKjufZ6TUjRq1KvbMjsPUY";
const fileId = "01S4Q2WR6ZU56TRNSRLVG2OZW376RKKRSR";
const sheetName = "Colaboradores";

export async function getColaboradores(token) {
  try {
    // 1️⃣ Monta o cabeçalho com o token do Microsoft Login
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // 2️⃣ Chama a API do Microsoft Graph para ler a aba “Colaboradores”
    const url = `https://graph.microsoft.com/v1.0/sites/${siteId}/drives/${driveId}/items/${fileId}/workbook/worksheets('${sheetName}')/usedRange(valuesOnly=true)`;

    const response = await axios.get(url, { headers });

    // 3️⃣ Trata a resposta (transforma a tabela Excel em objetos JSON)
    const rows = response.data.values;
    if (!rows || rows.length < 2) {
      throw new Error("Planilha vazia ou sem cabeçalho.");
    }

    const headersRow = rows[0];
    const dataRows = rows.slice(1);

    const colaboradores = dataRows.map((row, index) => {
      const item = { rowIndex: index + 2 }; // +2 por causa do cabeçalho
      headersRow.forEach((header, i) => {
        item[header] = row[i] ?? "";
      });
      return item;
    });

    return colaboradores;
  } catch (error) {
    console.error("Erro ao buscar colaboradores:", error.response?.status, error.message);
    if (error.response?.data) console.error(JSON.stringify(error.response.data, null, 2));
    throw error;
  }
}
