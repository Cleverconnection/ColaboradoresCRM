import { getColaboradores } from "../services/sharepointService.js";

export async function listarColaboradores(req, res) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ error: "Token não enviado" });
    }

    const data = await getColaboradores(token);
    res.json(data);
  } catch (error) {
    console.error("Erro ao buscar colaboradores:", error.message);
    res.status(500).json({ error: "Erro interno ao buscar dados" });
  }
}
