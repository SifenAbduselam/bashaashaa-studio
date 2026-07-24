# Bashaashaa Studio

A premium, black-and-white luxury photography & video production studio
website — built as a sales portfolio piece. React + Vite + Tailwind CSS +
Framer Motion on the frontend, with a serverless Telegram booking pipeline
(no traditional backend) on Vercel.

## Design

- **Palette:** near-black stage (`#050505` / `#0a0a0a`), off-white type
  (`#f5f5f2`), warm parchment accent (`#e8e4dc`), and two grays for hairlines
  and muted text. No color — every photograph is normalized to true
  black & white via an Unsplash `sat=-100` parameter so the palette never
  drifts.
- **Type:** Fraunces (display serif, editorial/magazine feel) paired with
  Manrope (body) and Space Mono (uppercase labels/captions).
- **Signature element:** a viewfinder-style corner bracket that appears on
  image hover (`.frame-corners` in `src/index.css`), echoing a camera
  viewfinder, plus a vertical "BASHAASHAA / VOL. 01" spine at the page edge —
  a nod to a magazine's printed spine rather than a decorative flourish.

## Getting started

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env` and fill in your Telegram credentials for the
booking form to work locally with `vercel dev` (a plain `vite dev` server
won't run the `/api` function — use the Vercel CLI for that):

```bash
npm i -g vercel
vercel dev
```

## Deploying to Vercel

1. Push this project to a Git repository and import it in Vercel.
2. In Project Settings → Environment Variables, add:
   - `TELEGRAM_BOT_TOKEN` — from [@BotFather](https://t.me/BotFather)
   - `TELEGRAM_CHAT_ID` — the chat/channel that should receive bookings
     (message your bot once, then check
     `https://api.telegram.org/bot<token>/getUpdates` to find the chat ID)
3. Deploy. Vercel automatically detects `api/booking.js` as a serverless
   function — no extra configuration needed.

## Project structure

```
src/
  components/   Navbar, Hero, GallerySection, ServicesSection,
                AboutSection, TestimonialsSection, BookingForm,
                ContactSection, Footer, Reveal (shared scroll-reveal)
  data/         photos.js — single source of truth for gallery,
                services, testimonials, and hero content
  hooks/        useScrolled.js — navbar scroll-state hook
api/
  booking.js    Serverless function: validates the form, forwards it
                to Telegram, keeps secrets server-side
```

## Business info on file

- **Name:** Bashaashaa Studio
- **Services:** Photography & Video Production
- **Location:** Jimma, Ethiopia
- **Phone:** 0932 453 742 / 0900 946 999
- **TikTok:** @bashaashaastudiojimma

No business email was provided, so the contact section intentionally omits
one. Add it in `src/components/ContactSection.jsx` once you have a real
address to publish.

## Notes

- Every image in `src/data/photos.js` is a verified, live Unsplash URL
  (checked at the time this project was built) — swap them for the studio's
  own photography and video stills before launch.
- Reduced-motion users automatically get instant transitions
  (`prefers-reduced-motion` is respected globally in `src/index.css`).
