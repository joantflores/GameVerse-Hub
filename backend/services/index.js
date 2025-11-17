import express from "express";
import cors from "cors";
import gameRouter from "../routes/gameRouter.js";
import mailRouter from "../controllers/mailController.js";
import 'dotenv/config';

const app = express();

// CORS - allow origin from FRONTEND_URL env var (set this in Render)
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.FRONTEND || "";

app.use(cors({
  origin: FRONTEND_URL ? [FRONTEND_URL] : true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

// Rutas principales
app.use("/api", gameRouter);

// Rutas de email
app.use("/api/mail", mailRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));
