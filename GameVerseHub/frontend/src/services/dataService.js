export const estadisticas = [
    { jugador: "Alice", partidas_jugadas: 120, victorias: 85 },
    { jugador: "Bob", partidas_jugadas: 95, victorias: 50 },
    { jugador: "Charlie", partidas_jugadas: 150, victorias: 100 }
]

export const triviaData = [
    {
        pregunta: "¿En qué año salió Dota 2?",
        opciones: ["2010", "2013", "2015", "2009"],
        correcta: 1
    },
    {
        pregunta: "¿Cuál fue el primer juego de The Witcher?",
        opciones: ["2007", "2010", "2015", "2011"],
        correcta: 0
    },
    {
        pregunta: "¿De qué país es originario Pokémon?",
        opciones: ["China", "Corea", "Japón", "EE. UU."],
        correcta: 2
    },
];


// Simular llamadas async
export function getEstadisticas() {
    return new Promise((resolve) => setTimeout(() => resolve(estadisticas), 300));
}

export function getTrivia() {
    return new Promise((resolve) => setTimeout(() => resolve(triviaData), 300));
}

// dataService.js
export async function getJuegos(nombre) {
    if (!nombre || nombre.trim() === "") return [];

    try {
        const response = await fetch(`http://localhost:3000/api/juegos?nombre=${nombre}`);
        const data = await response.json();
        return data;
    } catch (err) {
        console.error("Error obteniendo juegos:", err);
        return [];
    }
}

