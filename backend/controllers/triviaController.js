import * as triviaService from "../services/triviaService.js";

export async function getTriviaQuestions(req, res) {
    try {
        const questions = await triviaService.getTriviaQuestions();
        res.json(questions);
    } catch (error) {
        console.error("Error getting trivia questions:", error);
        res.status(500).json({ error: "Failed to fetch trivia questions" });
    }
}
