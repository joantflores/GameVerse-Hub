import express from 'express';
import { sendWelcomeEmail } from '../services/emailService.js';

const router = express.Router();

router.post('/send-welcome', async (req, res) => {
  try {
    const { email, displayName } = req.body;
    if (!email) return res.status(400).json({ error: 'Email required' });

    await sendWelcomeEmail(email, displayName || '');
    res.json({ success: true });
  } catch (err) {
    console.error('Error sending welcome email:', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

export default router;
