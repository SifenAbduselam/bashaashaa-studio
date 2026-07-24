// Vercel Serverless Function — POST /api/booking
// Forwards the booking form submission to a Telegram chat via the Telegram
// Bot API. No traditional backend or database is used; secrets stay on the
// server via environment variables and are never exposed to the frontend.
//
// Required environment variables (set in Vercel Project Settings):
//   TELEGRAM_BOT_TOKEN  — token for your Telegram bot (from @BotFather)
//   TELEGRAM_CHAT_ID    — chat/channel ID that should receive bookings

const REQUIRED_FIELDS = ['name', 'phone', 'email', 'service', 'date'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const { name, phone, email, service, date, message = '' } = req.body || {};

  const missing = REQUIRED_FIELDS.filter(
    (field) => !{ name, phone, email, service, date }[field]?.toString().trim()
  );
  if (missing.length) {
    return res.status(400).json({
      error: `Please fill in: ${missing.join(', ')}.`,
    });
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID env vars.');
    return res.status(500).json({
      error: 'Booking is temporarily unavailable. Please try again later.',
    });
  }

  const text = [
    '<b>New Booking Request — Bashaashaa Studio</b>',
    '',
    `<b>Name:</b> ${escapeHtml(name)}`,
    `<b>Phone:</b> ${escapeHtml(phone)}`,
    `<b>Email:</b> ${escapeHtml(email)}`,
    `<b>Service:</b> ${escapeHtml(service)}`,
    `<b>Preferred Date:</b> ${escapeHtml(date)}`,
    message ? `<b>Message:</b> ${escapeHtml(message)}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  try {
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: 'HTML',
        }),
      }
    );

    const data = await telegramRes.json();

    if (!telegramRes.ok || !data.ok) {
      console.error('Telegram API error:', data);
      return res.status(502).json({
        error: 'We could not send your booking. Please try again shortly.',
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Booking handler error:', err);
    return res.status(500).json({
      error: 'Something went wrong. Please try again.',
    });
  }
}
