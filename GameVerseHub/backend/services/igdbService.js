import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Asegurar ruta absoluta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

console.log("✅ CLIENT_ID:", process.env.TWITCH_CLIENT_ID);
console.log("✅ CLIENT_SECRET:", process.env.TWITCH_CLIENT_SECRET);


// Obtener token de Twitch para IGDB
async function obtenerToken() {
    try {
        console.log("Obteniendo token de Twitch...");
        const response = await fetch(
            `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
            { method: "POST" }
        );

        const data = await response.json();
        console.log("Respuesta de Twitch token:", data);

        if (!data.access_token) throw new Error("No se obtuvo token de Twitch");
        return data.access_token;

    } catch (error) {
        console.error("Error al obtener token:", error.message);
        throw error;
    }
}

// Buscar juegos en IGDB
export async function buscarJuegos(nombre) {
    try {
        const token = await obtenerToken();

        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: `search "${nombre}"; fields name, genres.name, first_release_date, summary, cover.url; limit 5;`
        });

        console.log("Buscando juego:", nombre);
        console.log("Token usado:", token);
        const juegos = await response.json();
        console.log("Respuesta IGDB:", juegos);

        // Si no hay resultados, devolvemos un ejemplo
        if (!Array.isArray(juegos) || juegos.length === 0) {
            return [{
                id: 999,
                name: "Juego de prueba",
                summary: "No se obtuvieron datos de IGDB.",
                genres: [{ id: 1, name: "Demo" }],
                cover: { url: null }
            }];
        }

        return juegos;

    } catch (error) {
        console.error("Error al buscar juegos:", error.message);
        return [{
            id: 999,
            name: "Juego de prueba",
            summary: "Hubo un error al obtener datos de IGDB.",
            genres: [{ id: 1, name: "Demo" }],
            cover: { url: null }
        }];
    }
}

// Permite probar directamente desde Node
if (process.argv[2]) {
    buscarJuegos(process.argv[2]).then(juegos => console.log(juegos));
}