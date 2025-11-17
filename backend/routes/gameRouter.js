import express from "express";
import { 
    buscarJuegos, 
    obtenerDetalleJuego, 
    obtenerGeneros, 
    obtenerPlataformas 
} from "../services/igdbService.js";
import {
    obtenerPreguntasTrivia,
    obtenerCategoriasTrivia,
    obtenerTokenSesion
} from "../services/triviaService.js";

const router = express.Router();


// GET /api/juegos
router.get("/juegos", async (req, res) => {
    const nombre = req.query.nombre || "";
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;
    
    try {
        const juegos = await buscarJuegos(nombre, { limit, offset });
        res.json(juegos);
    } catch (error) {
        console.error("Error en /api/juegos:", error);
        res.status(500).json({ error: "Error al obtener los juegos" });
    }
});

// GET /api/juegos/:id
router.get("/juegos/:id", async (req, res) => {
    try {
        const juego = await obtenerDetalleJuego(req.params.id);
        if (!juego) return res.status(404).json({ error: "Juego no encontrado" });
        res.json(juego);
    } catch (error) {
        console.error("Error en /api/juegos/:id:", error);
        res.status(500).json({ error: "Error al obtener el juego" });
    }
});

// GET /api/juegos/recursos/generos
router.get("/juegos/recursos/generos", async (req, res) => {
    try {
        res.json(await obtenerGeneros());
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener géneros" });
    }
});

// GET /api/juegos/recursos/plataformas
router.get("/juegos/recursos/plataformas", async (req, res) => {
    try {
        res.json(await obtenerPlataformas());
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener plataformas" });
    }
});

/*
========================================
=          RUTAS EXTRA PARA FRONTEND   =
========================================
*/

// El frontend espera /api/games
router.get("/games", async (req, res) => {
    req.query.nombre = req.query.search || "";
    return router.handle(req, res, () => {}, "/juegos");
});

// El frontend espera /api/games/:id
router.get("/games/:id", async (req, res) => {
    req.params.id = req.params.id;
    return router.handle(req, res, () => {}, "/juegos/:id");
});

// El frontend espera /api/categories
router.get("/categories", async (req, res) => {
    try {
        res.json(await obtenerGeneros());
    } catch (error) {
        res.status(500).json({ error: "Error al obtener categorías" });
    }
});

// El frontend espera /api/platforms
router.get("/platforms", async (req, res) => {
    try {
        res.json(await obtenerPlataformas());
    } catch (error) {
        res.status(500).json({ error: "Error al obtener plataformas" });
    }
});

/*
========================================
=          TRIVIA (Open Trivia DB)     =
========================================
*/

router.get("/trivia/preguntas", async (req, res) => {
    try {
        const cantidad = parseInt(req.query.cantidad) || 10;
        if (cantidad < 1 || cantidad > 50) {
            return res.status(400).json({ error: "La cantidad debe estar entre 1 y 50" });
        }

        const preguntas = await obtenerPreguntasTrivia({
            cantidad,
            categoria: req.query.categoria || null,
            dificultad: req.query.dificultad || null,
            tipo: req.query.tipo || "multiple"
        });

        res.json(preguntas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener preguntas" });
    }
});

router.get("/trivia/categorias", async (req, res) => {
    try {
        res.json(await obtenerCategoriasTrivia());
    } catch (error) {
        res.status(500).json({ error: "Error al obtener categorías" });
    }
});

router.get("/trivia/token", async (req, res) => {
    try {
        res.json({ token: await obtenerTokenSesion() });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener token" });
    }
});

export default router;
