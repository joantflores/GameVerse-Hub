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
        
        // Si es error de credenciales, devolver 503 (Service Unavailable)
        if (error.code === "NO_CREDENTIALS") {
            return res.status(503).json({ 
                error: "Servicio no disponible: Credenciales de Twitch no configuradas",
                message: error.message
            });
        }
        
        // Otros errores
        res.status(500).json({ 
            error: "Error al obtener los juegos de IGDB",
            message: error.message
        });
    }
});

export default router; // 👈 IMPORTANTE
