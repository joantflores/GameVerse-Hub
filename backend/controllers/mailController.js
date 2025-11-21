import express from "express";
import { sendWelcomeEmail } from "./../services/emailService.js"; 
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/send-welcome", async (req, res) => {
  try {
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

export default router;
