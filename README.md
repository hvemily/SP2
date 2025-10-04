# Vérité Auctions — Semester Project 2

[![Netlify](https://img.shields.io/badge/Netlify-deployed-00C7B7?logo=netlify)](https://veriteauctions.netlify.app/)
![Vite](https://img.shields.io/badge/Vite-MPA-646CFF?logo=vite)
![Tailwind](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwindcss)

Vérité Auctions is a simple auction site built as part of the Noroff Frontend **Semester Project 2**.  


> **Live site:** https://veriteauctions.netlify.app/

---

## ✨ Features

- Sign up (required domain: `@stud.noroff.no`)
- Login / logout + display **available credits**
- Update avatar
- Create new auctions (title, description, media, tags, end time)
- **Bid on other users’ listings** and view bid history
- Search & browse public listings (no auth required)
- Category page with **smart matching** (singular/plural & simple aliases, e.g. `watch` ⇄ `watches`)
- Polished UI
  - Modern cards (aspect ratio, hover, badges, line-clamp)
  - Listing detail with gallery thumbnails and time-left badge

---

## 🧱 Tech stack

- **Vite** (multi‑page, ES modules)
- **Tailwind CSS**
- **Vanilla JS**
- **Noroff Auction API**
- **Netlify** (hosting)
- Figma (design planning)

---

## 🖼️ Screenshots

> Add 2–3 screenshots or a short GIF here (Home, Listing detail, Create listing).  
> Store them under `public/readme/` and reference like below.

```
![Home](public/readme/home.png)
![Listing detail](public/readme/detail.png)
```

---

## 🚀 Getting started

```bash
git clone https://github.com/hvemily/SP2.git
cd SP2
npm install
npm run dev
```

**Build & preview**

```bash
npm run build
npm run preview
```

---

## ⚙️ Configuration

Constants are defined in `src/js/api/constants.js` (API base and endpoints).  
If you prefer environment variables with Vite, add a `.env` file at the project root:

```
VITE_API_BASE=https://v2.api.noroff.dev
# Optional API key if you use one:
VITE_NOROFF_API_KEY=your_api_key_here
```

Then read them from `constants.js` via `import.meta.env.VITE_API_BASE` (etc.).

**Authentication**  
- After login, an `accessToken` (JWT) is stored in `localStorage` and sent as `Authorization: Bearer <token>` where required.
- Credits can be displayed from the user profile endpoint.

---

## 🔌 API notes

- **Base:** `https://v2.api.noroff.dev`
- **Listings:** `GET /auction/listings?…`
- **Single listing:** `GET /auction/listings/{id}?_bids=true&_seller=true`
- **Create listing:** `POST /auction/listings`
- **Place bid:** `POST /auction/listings/{id}/bids`
- **Bid history:** fetched via the single‑listing endpoint using `?_bids=true`  
  (there is no separate `GET /bids` route).

---

## 🗂 Project structure

```
SP2/
├─ auth/                      # login/register HTML
├─ listing/                   # listing index/create/edit/category HTML
├─ profile/                   # profile HTML
├─ public/                    # static assets (put README images here)
├─ src/
│  ├─ app.js                  # app init, alerts, etc.
│  ├─ js/
│  │  ├─ api/                 # API helpers (read/create/etc.)
│  │  ├─ router/              # router + views (lazy‑loaded)
│  │  └─ ui/                  # UI utilities/components
│  └─ assets/                 # icons, images
├─ netlify.toml               # build (npm run build), publish (dist)
├─ vite.config.js             # base: "/"
└─ index.html
```

---

## 🛠 Implementation notes

- **Routing:** uses `import.meta.glob("./views/*.js")` for safe, production‑ready lazy loading.  
  This avoids MIME‑type errors from direct `import(modulePath)` on Netlify builds.
- **Cards (home/featured):** aspect‑ratio media, subtle hover‑scale, time badge, line‑clamp text.
- **Category search:** tolerant matching for singular/plural and simple aliases to reduce false negatives.
- **Listing detail:** gallery thumbnails, color‑coded time‑left badge, improved bid flow.
- **Strict MIME fix:** `vite.config.js` sets `base: "/"` so assets resolve correctly in production.

---

## ♿ Accessibility & QA

- Semantic headings and buttons with appropriate `aria-label`s where needed
- Keyboard navigation tested on core flows (login, create, bid)
- Contrast checked for primary/secondary states
- Basic performance pass:
  - `loading="lazy"` on non-critical images
  - Reduced layout shift in cards

---

## 🚢 Deploy (Netlify)

- **Build command:** `npm run build`
- **Publish directory:** `dist/`

`netlify.toml` (included) handles the build and SPA routing:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## ✅ Requirements checklist

- Uses an approved CSS framework (**Tailwind CSS**)
- Hosted on an approved platform (**Netlify**)
- Follows Noroff Auction API constraints
- Links to design/planning assets (Figma / Kanban)

---

## 🧭 Roadmap / Improvements

- Server‑side pagination for search results
- Stronger validation on “Create listing” (URL, end date in the future)
- 404/empty states with small illustrations

---

## 📄 License

MIT © 2025 Emily — see `LICENSE` for details.  
> Educational project; provided as‑is.
