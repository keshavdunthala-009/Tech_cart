# TechCart Electronics

A responsive e-commerce site built with React (Vite) + vanilla CSS, Redux Toolkit (persisted to
localStorage), Axios (`.then()` chains only), and a `json-server` fake REST API (`db.json`).

## Stack
- React 19 + Vite
- React Router v7
- Redux Toolkit + React Redux (auth / cart / wishlist / location, all persisted to localStorage)
- Axios (`.then/.catch/.finally` — no async/await anywhere in the app)
- React Toastify (toast notifications)
- Recharts (admin dashboard graphs)
- Lucide React (icon set) + Inter (Google Font)
- json-server (`db.json`) as the CRUD backend

## Getting Started

1. Install dependencies (already done if you're reading this right after generation):
   ```
   npm install
   ```
2. Start the fake API server (json-server) on **port 4500**:
   ```
   npm run server
   ```
3. In a second terminal, start the Vite dev server on **port 4400**:
   ```
   npm run dev
   ```
4. Open **http://localhost:4400/**.

> ⚠️ Ports 4500/4400 (not the usual 5000/5173) were chosen deliberately to avoid colliding with
> other projects that might already be running on this machine. The app's Axios client
> (`src/api/axiosClient.js`) is hardcoded to `http://localhost:4500` — if you change the
> `server` script's port in `package.json`, update that file (and `vite.config.js`'s
> `server.port`) to match.

## Seed accounts (from `db.json`)
- **Admin:** admin@techcart.com / Admin@123 — login at `/admin/login`
- **Customer:** shaikfaizanab@gmail.com / Faizan@123 — login at `/login`
- A few more sample customers are in `db.json` under `users`.

New admin accounts require the signup code `TECHCART-ADMIN` on `/admin/register` so random
visitors can't self-promote to admin.

## Project Structure
See `src/` — `api/` (axios calls), `features/` (Redux slices), `components/`, `pages/`
(customer pages + `pages/admin/` for the admin panel), `routes/AppRoutes.jsx`, `styles/`
(design tokens + global styles), `utils/` (regex validators, currency/date formatting).

## Data
`db.json` ships with 66 products across 6 electronics categories (Mobiles, Laptops, ACs, TVs,
Game Consoles, Tabs), 4 users, 9 sample orders, and 6 customer reviews shown on the home page —
enough for the admin dashboard and storefront to have real numbers from day one. Product images
are hotlinked from Wikimedia Commons: each category has a small curated pool (3–4 images) of
individually reviewed, real, plain-background product photos that products cycle through — every
image was downloaded and visually checked before being added, rather than pulled from a random
keyword search. An internet connection is required to see them.

## Notes on implementation choices
- Cart and Wishlist live entirely in Redux + localStorage (not in `db.json`) since they're
  per-browser state; Users, Products, Categories, Orders and Reviews are the real CRUD/read
  resources served by json-server.
- Location detection uses `navigator.geolocation` + the free OpenStreetMap Nominatim
  reverse-geocoding API (no API key required).
- Admin and customer auth are fully separate pages/flows (`/login` + `/register` vs.
  `/admin/login` + `/admin/register`), both validated with regex (see `src/utils/validators.js`).
- Category icons are resolved by slug through `getCategoryIcon()` in
  `src/constants/categories.js`, not read off the API response, so they stay consistent
  regardless of data source.
