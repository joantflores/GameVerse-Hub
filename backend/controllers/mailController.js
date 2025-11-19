// backend/controllers/mailController.js
import express from "express";
import { sendWelcomeEmail } from "../services/emailService"; // Import from services
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Endpoint público controlado para que lo llame tu frontend o el backend (protegido por SECRET opcional)
router.post("/send-welcome", async (req, res) => {
  try {
    // Protección simple: si defines MAIL_SECRET en env, requiere header 'x-mail-secret'
    const MAIL_SECRET = process.env.MAIL_SECRET || "";
    if (MAIL_SECRET) {
      const header = req.get("x-mail-secret") || "";
      if (header !== MAIL_SECRET) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    }

    const { email, displayName } = req.body;
    if (!email) return res.status(400).json({ error: "email is required" });

    await sendWelcomeEmail(email, displayName);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error sending welcome email:", err);
    return res.status(500).json({ error: err.message || "Error sending email" });
  }
});

// Exporta router por defecto (esto arregla el error que viste en Render)
export default router;
