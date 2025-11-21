/*Este archivo configura el servidor Express que actua como nucleo del backend, definiendo reglas de CORS basadas en un FRONTEND_URL configurable, 
habilitando JSON parsing y conectando las rutas principales del proyecto, incluyendo juegos, correo y trivia. 
Centraliza toda la infraestructura del servidor, gestiona la seguridad de acceso entre front-end y back-end, y expone un endpoint raiz para verificar que el servicio esta operativo. 
Al mantener esta configuracion limpia y organizada, garantiza que el backend pueda funcionar correctamente tanto en desarrollo como en produccion (Render).*/

import express from "express";
import cors from "cors";
import gameRouter from "../routes/gameRouter.js";
import mailRouter from "../controllers/mailController.js"; 
import triviaRouter from "../routes/triviaRouter.js"; 
import "dotenv/config";


const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || "";
const allowedOrigins = FRONTEND_URL.split(',').map(url => url.trim()).filter(url => url !== '');

console.log("CORS permitido para:", allowedOrigins.length > 0 ? allowedOrigins.join(', ') : "ANY");

// CORS CONFIG
app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitudes sin origen (como Postman o solicitudes de archivos locales)
      if (!origin) return callback(null, true);
      // Si el origen esta en nuestra lista de permitidos, o si no hay origenes configurados (en desarrollo)
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

// Rutas
app.use("/api", gameRouter);
app.use("/api/mail", mailRouter);
app.use("/api/trivia", triviaRouter); 

app.get("/", (req, res) => {
  res.json({
    status: "Backend funcionando correctamente",
    documentation: "/api",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Backend corriendo en puerto ${PORT}`)
);
