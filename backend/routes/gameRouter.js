import express from "express";
import {
    buscarJuegos,
    obtenerDetalleJuego,
    obtenerGeneros,
    obtenerPlataformas
} from "../services/igdbService.js";

const router = express.Router();

// Helper to safely parse ints
const toInt = v => parseInt(v) || 0;

// --- Juegos (IGDB) ---
router.get("/juegos", async (req, res) => {
    const nombre = req.query.nombre || "";
    const limit = toInt(req.query.limit) || 20;
    const offset = toInt(req.query.offset) || 0;
    try {
        const juegos = await buscarJuegos(nombre, { limit, offset });
        res.json(Array.isArray(juegos) ? juegos : []);
    } catch (err) {
        console.error("Error /api/juegos", err);
        res.status(500).json({ error: "Error al obtener juegos" });
    }
});

router.get("/juegos/:id", async (req, res) => {
    try {
        const juego = await obtenerDetalleJuego(req.params.id);
        if (!juego) return res.status(404).json({ error: "Juego no encontrado" });
        res.json(juego);
    } catch (err) {
        console.error("Error /api/juegos/:id", err);
        res.status(500).json({ error: "Error al obtener el juego" });
    }
});

router.get("/juegos/recursos/generos", async (req, res) => {
    try {
        const generos = await obtenerGeneros();
        res.json(Array.isArray(generos) ? generos : []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener géneros" });
    }
});

router.get("/juegos/recursos/plataformas", async (req, res) => {
    try {
        const plataformas = await obtenerPlataformas();
        res.json(Array.isArray(plataformas) ? plataformas : []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener plataformas" });
    }
});

// --- English aliases expected by frontend ---
router.get("/games", async (req, res) => {
    const search = req.query.search || req.query.nombre || "";
    const limit = toInt(req.query.limit) || 20;
    const offset = toInt(req.query.offset) || 0;
    try {
        const juegos = await buscarJuegos(search, { limit, offset });
        res.json(Array.isArray(juegos) ? juegos : []);
    } catch (err) {
        console.error("Error /api/games", err);
        res.status(500).json({ error: "Error al obtener juegos" });
    }
});

router.get("/games/:id", async (req, res) => {
    try {
        const juego = await obtenerDetalleJuego(req.params.id);
        if (!juego) return res.status(404).json({ error: "Juego no encontrado" });
        res.json(juego);
    } catch (err) {
        console.error("Error /api/games/:id", err);
        res.status(500).json({ error: "Error al obtener el juego" });
    }
});

router.get("/categories", async (req, res) => {
    try {
        const generos = await obtenerGeneros();
        res.json(Array.isArray(generos) ? generos : []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener categorías" });
    }
});

router.get("/platforms", async (req, res) => {
    try {
        const plataformas = await obtenerPlataformas();
        res.json(Array.isArray(plataformas) ? plataformas : []);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error al obtener plataformas" });
    }
});

router.post("/reviews", async (req, res) => {
  const { gameId, userId, review } = req.body;

  if (!gameId || !userId || !review) {
    return res.status(400).json({ success: false, error: "Datos incompletos" });
  }

  try 
  {
    console.log(`Reseña recibida: juego ${gameId}, usuario ${userId}, contenido: ${review}`);
    res.json({ success: true });
  } catch (err) {
    console.error("Error al guardar reseña:", err);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
});
export default router;
