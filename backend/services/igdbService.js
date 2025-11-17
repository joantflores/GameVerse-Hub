import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Asegurar ruta absoluta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Verificar que las variables de entorno estén configuradas (sin exponer valores)
if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    console.warn("⚠️  Advertencia: TWITCH_CLIENT_ID o TWITCH_CLIENT_SECRET no configuradas");
}


// Obtener token de Twitch para IGDB
async function obtenerToken() {
    try {
        const response = await fetch(
            `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
            { method: "POST" }
        );

        const data = await response.json();

        if (!data.access_token) {
            throw new Error("No se obtuvo token de Twitch");
        }
        
        return data.access_token;

    } catch (error) {
        console.error("Error al obtener token de Twitch:", error.message);
        throw error;
    }
}

// Buscar juegos en IGDB con campos expandidos
export async function buscarJuegos(nombre, opciones = {}) {
    try {
        const { limit = 20, offset = 0 } = opciones;
        const token = await obtenerToken();

        // Campos expandidos para obtener más información
        const fields = `name, genres.name, platforms.name, first_release_date, summary, 
            cover.url, rating, rating_count, storyline, involved_companies.company.name,
            screenshots.url, videos.video_id, websites.category, websites.url`;

        const body = `search "${nombre}"; 
            fields ${fields}; 
            limit ${limit}; 
            offset ${offset};`;

        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: body
        });

        console.log("Buscando juego:", nombre);
        const juegos = await response.json();
        console.log(`Respuesta IGDB: ${juegos.length} juegos encontrados`);

        if (!Array.isArray(juegos) || juegos.length === 0) {
            return [];
        }

        return juegos;

    } catch (error) {
        console.error("Error al buscar juegos:", error.message);
        return [];
    }
}

// Obtener detalles completos de un juego por ID
export async function obtenerDetalleJuego(juegoId) {
    try {
        const token = await obtenerToken();

        const fields = `name, genres.name, platforms.name, first_release_date, summary,
            cover.url, rating, rating_count, storyline, involved_companies.company.name,
            screenshots.url, videos.video_id, websites.category, websites.url,
            game_modes.name, themes.name, player_perspectives.name`;

        const body = `where id = ${juegoId}; fields ${fields};`;

        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: body
        });

        const juegos = await response.json();
        return juegos.length > 0 ? juegos[0] : null;

    } catch (error) {
        console.error("Error al obtener detalle del juego:", error.message);
        throw error;
    }
}

// Obtener géneros disponibles
export async function obtenerGeneros() {
    try {
        const token = await obtenerToken();

        const response = await fetch("https://api.igdb.com/v4/genres", {
            method: "POST",
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: "fields name; limit 50;"
        });

        return await response.json();

    } catch (error) {
        console.error("Error al obtener géneros:", error.message);
        return [];
    }
}

// Obtener plataformas disponibles
export async function obtenerPlataformas() {
    try {
        const token = await obtenerToken();

        const response = await fetch("https://api.igdb.com/v4/platforms", {
            method: "POST",
            headers: {
                "Client-ID": process.env.TWITCH_CLIENT_ID,
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: "fields name; limit 50;"
        });

        return await response.json();

    } catch (error) {
        console.error("Error al obtener plataformas:", error.message);
        return [];
    }
}

// Permite probar directamente desde Node
if (process.argv[2]) {
    buscarJuegos(process.argv[2]).then(juegos => console.log(juegos));
}