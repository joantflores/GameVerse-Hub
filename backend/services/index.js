import express from "express";
import cors from "cors";
import gameRouter from "../routes/gameRouter.js";
import mailRouter from "../controllers/mailController.js"; // default export (router)
import "dotenv/config";


const app = express();

// SOLO UNA variable FRONTEND_URL → ya no habrá duplicado
const FRONTEND_URL = process.env.FRONTEND_URL || "";

console.log("CORS permitido para:", FRONTEND_URL || "ANY");

// CORS CONFIG
app.use(
  cors({
    origin: FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json());

// Rutas
app.use("/api", gameRouter);
app.use("/api/mail", mailRouter);

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
