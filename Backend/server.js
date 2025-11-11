import express from "express";
import cors from "cors";
import colaboradoresRoutes from "./routes/colaboradores.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/colaboradores", colaboradoresRoutes);

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Backend rodando na porta ${PORT}`));
