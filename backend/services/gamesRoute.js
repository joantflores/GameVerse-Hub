import express from "express";
import { buscarJuegos } from "./igdbService.js";

const router = express.Router();

router.get("/juegos", async (req, res) => {
    const nombre = req.query.nombre || "";
    if (!nombre) return res.json([]);

    try {
        const juegos = await buscarJuegos(nombre);
        res.json(juegos);
    } catch (error) {
        console.error("Error en /juegos:", error);
        res.status(500).json([]);
    }
});

export default router;
