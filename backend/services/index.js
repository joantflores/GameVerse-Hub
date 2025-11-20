import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();

// SOLO UNA variable FRONTEND_URL → ya no habrá duplicado
const FRONTEND_URL = process.env.FRONTEND_URL || "";
const allowedOrigins = FRONTEND_URL.split(',').map(url => url.trim()).filter(url => url !== '');

console.log("CORS permitido para:", allowedOrigins.length > 0 ? allowedOrigins.join(', ') : "ANY");

// CORS CONFIG
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origen (como Postman o solicitudes de archivos locales)
      if (!origin) return callback(null, true);
      // Si el origen está en nuestra lista de permitidos, o si no hay orígenes configurados (en desarrollo)
      if (allowedOrigins.includes(origin) || allowedOrigins.length === 0) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Endpoint raíz para evitar "Cannot GET /"
app.get("/", (req, res) => {
  res.json({
    status: "Backend funcionando correctamente",
    documentation: "/api",
  });
});

// Puerto Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Backend corriendo en puerto ${PORT}`)
);
