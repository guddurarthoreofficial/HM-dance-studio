# HM Dance Studio — Website

React + Vite + Tailwind CSS. Dark, poster-inspired design built for HM Dance Studio, Motihari.

## Run locally

```bash
npm install
npm run dev
```

Open the printed localhost URL.

## Build for production (Vercel)

```bash
npm run build
```

This outputs a `dist/` folder — deploy that to Vercel same as your current site
(hm-dance-studio.vercel.app). Framework preset: **Vite**.

## Things to edit (all at the top of `src/App.jsx`)

- `SOCIAL.instagram` / `SOCIAL.facebook` — put your real Instagram and Facebook links here.
- `REGISTER_URL` — already set to your Google Form.
- `WHATSAPP_NUMBER` — the floating WhatsApp button and "Chat on WhatsApp" link both use this
  number (currently Piyush Sir's, `+91 89696 64247`).
- `PHONE_NUMBERS` — the two studio numbers shown in the Location section.
- `MAP_QUERY` — the text used to place the embedded Google Map pin.
- `PROGRAMS` — the 8 class cards (Hip Hop, Bollywood, Contemporary, Semi Classical, Free Style,
  Kids Dance, Yoga, Exercise). Edit `desc` for any of them freely.

No image files are required — the design uses color, type and layout instead of photos, so it'll
look right the moment you deploy it. If you'd like real photos of the studio/teacher swapped in
later, drop them in `src/assets/` and reference them in `About` (teacher photo) and `Hero`.
