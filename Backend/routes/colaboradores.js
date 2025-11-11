import express from "express";
import { listarColaboradores } from "../controllers/colaboradoresController.js";

const router = express.Router();

// rota GET /api/colaboradores
router.get("/", listarColaboradores);

export default router;
