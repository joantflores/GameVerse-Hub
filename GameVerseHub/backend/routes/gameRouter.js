import express from "express";
import { buscarJuegos } from "../services/igdbService.js";

const router = express.Router();

router.get("/juegos", async (req, res) => {
    const nombre = req.query.nombre || "";
    try {
        const juegos = await buscarJuegos(nombre);
        res.json(juegos);
    } catch (error) {
        console.error("Error en /api/juegos:", error);
        res.status(500).json({ error: "Error al obtener los juegos" });
    }
});

export default router; // 👈 IMPORTANTE
