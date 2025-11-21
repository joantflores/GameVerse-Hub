/*Este archivo actua como controlador del backend para obtener preguntas de trivia. Llama al servicio triviaService.obtenerPreguntasTrivia(), 
maneja errores y responde al frontend con la lista de preguntas ya procesadas, 
permitiendo que la seccion de trivia funcione correctamente y obtenga los datos necesarios desde la API sin exponer la logica interna.*/

import * as triviaService from "../services/triviaService.js";

export async function getTriviaQuestions(req, res) {
    try {
        const questions = await triviaService.obtenerPreguntasTrivia();
        res.json(questions);
    } catch (error) {
        console.error("Error getting trivia questions:", error);
        res.status(500).json({ error: "Failed to fetch trivia questions" });
    }
}
