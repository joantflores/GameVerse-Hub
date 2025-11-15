import express from "express";
import cors from "cors";
import gameRouter from "../routes/gameRouter.js"; // 👈 asegúrate que la ruta sea correcta
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Usa el router importado
app.use("/api", gameRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend corriendo en puerto ${PORT}`));
