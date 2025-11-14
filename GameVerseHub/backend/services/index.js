import express from "express";
import cors from "cors";
import gameRouter from "../routes/gameRouter.js"; // 👈 asegúrate que la ruta sea correcta
import dotenv from "dotenv";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Prioridad: Variables de entorno del sistema > archivo .env
// En producción, las variables de entorno del sistema tienen prioridad
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env");

// Solo cargar .env si no hay variables de entorno del sistema (desarrollo local)
const tieneEnvSistema = process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET;

if (!tieneEnvSistema && existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log("📄 Archivo .env cargado (modo desarrollo)");
} else if (!tieneEnvSistema) {
    console.log("ℹ️  No se encontró archivo .env, usando variables de entorno del sistema");
}

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Usa el router importado
app.use("/api", gameRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));
