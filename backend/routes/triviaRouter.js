/*Este archivo define la ruta principal del sistema de trivia y la conecta con el controlador encargado de obtener las preguntas. 
Su funcion es proporcionar un endpoint limpio y organizado para que el frontend pueda solicitar preguntas de manera sencilla, 
manteniendo separada la logica del enrutamiento y la logica del procesamiento de datos, lo que mejora la estructura y mantenibilidad del proyecto.*/

import express from "express";
import { getTriviaQuestions } from "../controllers/triviaController.js";

const router = express.Router();

router.get("/questions", getTriviaQuestions);

export default router;
