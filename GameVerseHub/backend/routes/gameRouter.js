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

// Rutas de IGDB
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

router.get("/juegos/:id", async (req, res) => {
    const juegoId = req.params.id;
    try {
        const juego = await obtenerDetalleJuego(juegoId);
        if (juego) {
            res.json(juego);
        } else {
            res.status(404).json({ error: "Juego no encontrado" });
        }
    } catch (error) {
        console.error("Error en /api/juegos/:id:", error);
        res.status(500).json({ error: "Error al obtener el juego" });
    }
});

router.get("/juegos/recursos/generos", async (req, res) => {
    try {
        const generos = await obtenerGeneros();
        res.json(generos);
    } catch (error) {
        console.error("Error en /api/juegos/recursos/generos:", error);
        res.status(500).json({ error: "Error al obtener géneros" });
    }
});

router.get("/juegos/recursos/plataformas", async (req, res) => {
    try {
        const plataformas = await obtenerPlataformas();
        res.json(plataformas);
    } catch (error) {
        console.error("Error en /api/juegos/recursos/plataformas:", error);
        res.status(500).json({ error: "Error al obtener plataformas" });
    }
});

// Rutas de Trivia (Open Trivia API)
router.get("/trivia/preguntas", async (req, res) => {
    try {
        const cantidad = parseInt(req.query.cantidad) || 10;
        const categoria = req.query.categoria || null;
        const dificultad = req.query.dificultad || null;
        const tipo = req.query.tipo || "multiple";

        // Validar cantidad
        if (cantidad < 1 || cantidad > 50) {
            return res.status(400).json({ error: "La cantidad debe estar entre 1 y 50" });
        }

        const preguntas = await obtenerPreguntasTrivia({
            cantidad,
            categoria,
            dificultad,
            tipo
        });

        res.json(preguntas);
    } catch (error) {
        console.error("Error en /api/trivia/preguntas:", error.message || error);
        res.status(500).json({ error: error.message || "Error al obtener preguntas de trivia" });
    }
});

router.get("/trivia/categorias", async (req, res) => {
    try {
        const categorias = await obtenerCategoriasTrivia();
        res.json(categorias);
    } catch (error) {
        console.error("Error en /api/trivia/categorias:", error.message || error);
        res.status(500).json({ error: "Error al obtener categorías de trivia" });
    }
});

router.get("/trivia/token", async (req, res) => {
    try {
        const token = await obtenerTokenSesion();
        res.json({ token });
    } catch (error) {
        console.error("Error en /api/trivia/token:", error.message || error);
        res.status(500).json({ error: "Error al obtener token de sesión" });
    }
});

export default router;
