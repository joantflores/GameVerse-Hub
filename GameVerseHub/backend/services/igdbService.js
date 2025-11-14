import fetch from "node-fetch";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";

// Asegurar ruta absoluta
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prioridad: Variables de entorno del sistema > archivo .env
// En servidores/producción, las variables de entorno del sistema tienen prioridad
// El archivo .env solo se usa en desarrollo local

// Primero verificar si ya hay variables de entorno del sistema (producción)
const tieneEnvSistema = process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET;

// Solo cargar .env si no hay variables de entorno del sistema (desarrollo local)
if (!tieneEnvSistema) {
    const envPath = path.resolve(__dirname, "../.env");
    if (existsSync(envPath)) {
        dotenv.config({ path: envPath });
        console.log("📄 Archivo .env cargado (modo desarrollo)");
    } else {
        console.log("ℹ️  No se encontró archivo .env");
    }
}

// Verificar credenciales (pueden venir de variables de entorno del sistema o .env)
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const tieneCredenciales = CLIENT_ID && CLIENT_SECRET;

// Detectar si estamos en producción o desarrollo
const esProduccion = process.env.NODE_ENV === 'production' || !existsSync(path.resolve(__dirname, "../.env"));

if (tieneCredenciales) {
    const fuente = esProduccion ? "variables de entorno del sistema" : "archivo .env";
    console.log(`✅ Credenciales de Twitch encontradas (${fuente})`);
    console.log("✅ CLIENT_ID:", CLIENT_ID.substring(0, 8) + "...");
} else {
    console.error("❌ ERROR: No se encontraron credenciales de Twitch");
    if (esProduccion) {
        console.error("💡 Para usar la API de IGDB, configura las variables de entorno:");
        console.error("   TWITCH_CLIENT_ID y TWITCH_CLIENT_SECRET");
    } else {
        console.error("💡 Para usar la API de IGDB, crea un archivo .env en backend/ con:");
        console.error("   TWITCH_CLIENT_ID=tu_client_id");
        console.error("   TWITCH_CLIENT_SECRET=tu_client_secret");
    }
}

// Obtener token de Twitch para IGDB
async function obtenerToken() {
    try {
        console.log("Obteniendo token de Twitch...");
        const response = await fetch(
            `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
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
    // Verificar que haya credenciales
    if (!tieneCredenciales) {
        const error = new Error("Credenciales de Twitch no configuradas. Configura TWITCH_CLIENT_ID y TWITCH_CLIENT_SECRET.");
        error.code = "NO_CREDENTIALS";
        throw error;
    }

    try {
        const token = await obtenerToken();

        const response = await fetch("https://api.igdb.com/v4/games", {
            method: "POST",
            headers: {
                "Client-ID": CLIENT_ID,
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            },
            body: `search "${nombre}"; fields name, genres.name, first_release_date, summary, cover.url; limit 5;`
        });

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`Error de IGDB API: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`);
        }

        console.log("🔍 Buscando en IGDB:", nombre);
        const juegos = await response.json();
        console.log("✅ Respuesta IGDB recibida:", juegos.length, "juegos encontrados");

        // Si no hay resultados, devolver array vacío
        if (!Array.isArray(juegos) || juegos.length === 0) {
            console.log("ℹ️  No se encontraron juegos para:", nombre);
            return [];
        }

        return juegos;

    } catch (error) {
        console.error("❌ Error al buscar juegos en IGDB:", error.message);
        throw error;
    }
}

// Permite probar directamente desde Node
if (process.argv[2]) {
    buscarJuegos(process.argv[2]).then(juegos => console.log(juegos));
}