import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465", 10);
const SMTP_SECURE = (process.env.SMTP_SECURE || "true") === "true"; // true for 465, false for 587
const SMTP_USER = process.env.SMTP_USER; // Gmail address
const SMTP_PASS = process.env.SMTP_PASS; // App password or SMTP password
const FROM = process.env.EMAIL_FROM || "GameVerse Hub <no-reply@example.com>";

if (!SMTP_USER || !SMTP_PASS) {
  console.warn("??  SMTP credentials not configured. Set SMTP_USER and SMTP_PASS in .env");
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined
});

export async function sendWelcomeEmail(toEmail, toName) {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error("SMTP credentials not configured");
  }

  const subject = "Welcome to GameVerse Hub";
  const text = `Hello ${toName || ''},\n\nWelcome to GameVerse Hub! We're glad to have you. Explore games, play trivia and have fun!\n\n� The GameVerse Hub Team`;
  const html = `<p>Hello ${toName || ''},</p><p>Welcome to <strong>GameVerse Hub</strong>! We're glad to have you. Explore games, play trivia and have fun!</p><p>� The GameVerse Hub Team</p>`;

  const info = await transporter.sendMail({
    from: FROM,
    to: toEmail,
    subject,
    text,
    html
  });

  return info;
}
