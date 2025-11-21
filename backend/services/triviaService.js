//Este modulo gestiona toda la comunicacion con la API publica de Open Trivia Database, permitiendo obtener preguntas, categorias 
// y tokens de sesion para evitar repeticiones. Incluye funciones internas para decodificar texto HTML y mezclar aleatoriamente respuestas, 
// asegurando que las preguntas lleguen limpias y listas para usar en el frontend. 
// Gracias a este archivo, el proyecto puede ofrecer un sistema de trivia dinamico, consistente y basado en datos reales, 
// sin necesidad de almacenar preguntas localmente.

import fetch from "node-fetch";

const OPENTDB_BASE_URL = "https://opentdb.com/api.php";
const OPENTDB_CATEGORIES_URL = "https://opentdb.com/api_category.php";

// Decodificar entidades HTML
function decodeHtml(html) {
    if (!html) return "";
    return html
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&eacute;/g, "é")
        .replace(/&ouml;/g, "ö")
        .replace(/&uuml;/g, "ü")
        .replace(/&auml;/g, "ä")
        .replace(/&iacute;/g, "í")
        .replace(/&oacute;/g, "ó")
        .replace(/&uacute;/g, "ú")
        .replace(/&agrave;/g, "à")
        .replace(/&egrave;/g, "è")
        .replace(/&igrave;/g, "ì")
        .replace(/&ograve;/g, "ò")
        .replace(/&ugrave;/g, "ù")
        .replace(/&atilde;/g, "ã")
        .replace(/&otilde;/g, "õ")
        .replace(/&ntilde;/g, "ñ");
}

// Mezclar array (Fisher-Yates shuffle)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Obtener preguntas de trivia
export async function obtenerPreguntasTrivia(opciones = {}) {
    try {
        const {
            cantidad = 10,
            categoria = null,
            dificultad = null,
            tipo = "multiple" // multiple o boolean
        } = opciones;

        console.log(`Obteniendo ${cantidad} preguntas de trivia...`);

        // Construir URL con parámetros
        const params = new URLSearchParams({
            amount: cantidad.toString(),
            type: tipo
        });

        // Si no se especifica categoría, usar categoría 15 (Video Games) por defecto
        const categoriaFinal = categoria || "15";
        params.append("category", categoriaFinal);

        if (dificultad && ["easy", "medium", "hard"].includes(dificultad.toLowerCase())) {
            params.append("difficulty", dificultad.toLowerCase());
        }

        const url = `${OPENTDB_BASE_URL}?${params.toString()}`;
        console.log(`URL de Open Trivia API: ${url}`);

        const response = await fetch(url);
        const data = await response.json();

        if (data.response_code !== 0) {
            throw new Error(`Open Trivia API error: código de respuesta ${data.response_code}`);
        }

        // Procesar preguntas: decodificar HTML y mezclar respuestas
        const preguntas = data.results.map((pregunta, index) => {
            const preguntaDecodificada = decodeHtml(pregunta.question);
            const respuestaCorrecta = decodeHtml(pregunta.correct_answer);
            const respuestasIncorrectas = pregunta.incorrect_answers.map(r => decodeHtml(r));

            // Mezclar todas las respuestas
            const todasRespuestas = [respuestaCorrecta, ...respuestasIncorrectas];
            const respuestasMezcladas = shuffleArray(todasRespuestas);

            // Encontrar el índice de la respuesta correcta después de mezclar
            const indiceCorrecto = respuestasMezcladas.findIndex(r => r === respuestaCorrecta);

            return {
                id: index,
                categoria: decodeHtml(pregunta.category),
                dificultad: pregunta.difficulty,
                tipo: pregunta.type,
                pregunta: preguntaDecodificada,
                opciones: respuestasMezcladas,
                correcta: indiceCorrecto,
                respuestaCorrecta: respuestaCorrecta
            };
        });

        return preguntas;

    } catch (error) {
        console.error("Error al obtener preguntas de trivia:", error.message || error);
        throw error;
    }
}

// Obtener categorías disponibles
export async function obtenerCategoriasTrivia() {
    try {
        console.log("Obteniendo categorías de trivia...");

        const response = await fetch(OPENTDB_CATEGORIES_URL);
        const data = await response.json();

        if (!data.trivia_categories) {
            throw new Error("No se pudieron obtener las categorías");
        }

        return data.trivia_categories.map(cat => ({
            id: cat.id,
            nombre: decodeHtml(cat.name)
        }));

    } catch (error) {
        console.error("Error al obtener categorías de trivia:", error.message || error);
        throw error;
    }
}

// Obtener token de sesión para evitar preguntas repetidas
export async function obtenerTokenSesion() {
    try {
        console.log("Obteniendo token de sesión de Open Trivia API...");

        const response = await fetch("https://opentdb.com/api_token.php?command=request");
        const data = await response.json();

        if (data.response_code !== 0) {
            throw new Error(`Error al obtener token: código ${data.response_code}`);
        }

        return data.token;

    } catch (error) {
        console.error("Error al obtener token de sesión:", error.message || error);
        throw error;
    }
}

