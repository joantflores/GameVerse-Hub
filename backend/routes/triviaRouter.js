import express from "express";
import { getTriviaQuestions } from "../controllers/triviaController.js";

const router = express.Router();

router.get("/questions", getTriviaQuestions);

export default router;
