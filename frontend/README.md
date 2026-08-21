# HM Dance Studio — Portal

A full public site + studio admin dashboard for HM Dance Studio (Motihari), built with React, React Router, and Vite.

## Run it locally

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

## Build for production

```bash
npm run build
```

Output goes to `dist/` — deploy that folder to any static host (Vercel, Netlify, etc).

## What's inside

- **Public site** (`/`, `/about`, `/rentals`, `/contact`) — Navbar + Footer via `MainLayout`
- **Auth** (`/login`, `/register`) — standalone, no site chrome
- **Studio dashboard** (`/dashboard/*`) — sidebar shell via `DashboardLayout`
  - `/dashboard` — Overview (stats, today's schedule, activity)
  - `/dashboard/calendar` — weekly class calendar
  - `/dashboard/kanban` — drag-and-drop enrollment pipeline
  - `/dashboard/settings` — theme & studio detail preferences

All styling lives in `src/styles/tokens.css` as CSS variables (colors, type, spacing) — change values there to re-theme the whole app.

## Notes

- Login/Register currently just navigate to `/dashboard` on submit — wire up your real auth API in `src/pages/Login.jsx` and `src/pages/Register.jsx`.
- Dashboard data (stats, schedule, kanban cards) is hardcoded sample data in each page — swap in real API calls when your backend is ready.
