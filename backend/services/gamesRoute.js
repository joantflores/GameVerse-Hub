//Este archivo define una ruta sencilla para buscar videojuegos mediante el servicio de IGDB. 
//Recibe un nombre desde la consulta, valida que exista y luego utiliza la funcion buscarJuegos para obtener los resultados desde la API externa. 
// Al mantener la lógica de búsqueda separada en un servicio y manejar aqui solo el enrutamiento y las respuestas HTTP, el proyecto se vuelve mas modular, ordenado y facil de mantener.

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
