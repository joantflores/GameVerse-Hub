import express from "express";
import cors from "cors";
import gameRouter from "../routes/gameRouter.js";
import mailRouter from "../controllers/mailController.js";
import 'dotenv/config';

const app = express();

app.use(cors({
  origin: ["https://tu-frontend.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use("/api", gameRouter);
app.use("/api/mail", mailRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Backend corriendo en puerto ${PORT}`)
);
