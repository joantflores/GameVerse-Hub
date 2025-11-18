import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendWelcomeEmail(toEmail, displayName) {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: toEmail,
    subject: "Welcome to GameVerseHub",
    text: `Hello ${displayName || 'usuario'},\n\n¡Bienvenido a GameVerseHub!\nGracias por unirte a la plataforma.\n\nSaludos,\nEl equipo de GameVerseHub`
  };

  return transporter.sendMail(mailOptions);
}
