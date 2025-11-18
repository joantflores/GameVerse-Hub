// backend/controllers/mailController.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Configura el transporter (ya lo tenías)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: (process.env.SMTP_SECURE === "true"),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Función exportada para envío desde el servidor (la mantengo)
export async function sendWelcomeEmail(toEmail, displayName) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: toEmail,
    subject: "Bienvenido a GameVerseHub 🎮",
    text: `Hola ${displayName || "usuario"},\n\n¡Bienvenido a GameVerseHub! Gracias por registrarte.\n\nSaludos,\nEl equipo de GameVerseHub`
  };

  return transporter.sendMail(mailOptions);
}

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
