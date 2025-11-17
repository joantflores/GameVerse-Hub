import express from "express";
import cors from "cors";
import gameRouter from "../routes/gameRouter.js";
import mailRouter from "../controllers/mailController.js";
import 'dotenv/config';

const app = express();

// =============== CORS FIX ===============
const FRONTEND_URL = process.env.FRONTEND_URL || process.env.FRONTEND;

app.use(cors({
  origin: FRONTEND_URL
    ? [FRONTEND_URL, "http://localhost:5173"]
    : "*",   
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

app.use("/api", gameRouter);
app.use("/api/mail", mailRouter);

app.get("/", (req, res) => {
  res.send("🔥 GameVerse Hub Backend ONLINE");
});

app.get("/status", (req, res) => {
  res.json({
    status: "ok",
    service: "GameVerse Hub API",
    time: new Date().toISOString(),
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));
