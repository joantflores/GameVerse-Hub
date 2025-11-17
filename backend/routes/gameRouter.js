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

router.get("/juegos", async (req, res) => {
    const nombre = req.query.nombre || "";
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const juegos = await buscarJuegos(nombre, { limit, offset });
        res.json(juegos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los juegos" });
    }
});

router.get("/juegos/:id", async (req, res) => {
    try {
        const juego = await obtenerDetalleJuego(req.params.id);
        if (!juego) return res.status(404).json({ error: "Juego no encontrado" });
        res.json(juego);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los detalles del juego" });
    }
});

// GET /api/games
router.get("/games", async (req, res) => {
    req.query.nombre = req.query.search || "";
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    try {
        const juegos = await buscarJuegos(req.query.nombre, { limit, offset });
        res.json(juegos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los juegos" });
    }
});

// GET /api/games/:id
router.get("/games/:id", async (req, res) => {
    try {
        const juego = await obtenerDetalleJuego(req.params.id);
        if (!juego) return res.status(404).json({ error: "Juego no encontrado" });
        res.json(juego);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el juego" });
    }
});

router.get("/categories", async (req, res) => {
    try {
        const generos = await obtenerGeneros();
        res.json(generos);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener categorías" });
    }
});

router.get("/platforms", async (req, res) => {
    try {
        const plataformas = await obtenerPlataformas();
        res.json(plataformas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener plataformas" });
    }
});

router.get("/trivia/preguntas", async (req, res) => {
    try {
        const preguntas = await obtenerPreguntasTrivia({
            cantidad: req.query.cantidad || 10,
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
        const categorias = await obtenerCategoriasTrivia();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener categorías" });
    }
});

router.get("/preguntas", async (req, res) => {
    try {
        const preguntas = await obtenerPreguntasTrivia({
            cantidad: req.query.cantidad || 10
        });

        res.json(preguntas);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener preguntas" });
    }
});

router.get("/categorias", async (req, res) => {
    try {
        const categorias = await obtenerCategoriasTrivia();
        res.json(categorias);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener categorías" });
    }
});

router.get("/token", async (req, res) => {
    try {
        const token = await obtenerTokenSesion();
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener token" });
    }
});

export default router;
