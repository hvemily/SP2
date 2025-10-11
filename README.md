# Vérité Auctions — Semester Project 2

An auction marketplace built for the Noroff **Semester Project 2**. Users can register, log in, create listings, upload an avatar, place bids, and browse/search active auctions. Unauthenticated users can still discover listings, but authoring actions require an account.

> **Live demo:** _(add your deployed link here)_  
> **Repository:** https://github.com/hvemily/SP2

---

## ✨ Features

- **Auth**: Register, log in/out, persisted session
- **Profile**: View credits, update profile avatar
- **Listings**: Create listings with title, description, media, and end date
- **Bidding**: Place bids on active listings
- **Browse**: Search and filter listings; view single-listing detail
- **Responsive UI**: Mobile-first layout with accessible focus states
- **Error handling**: Friendly messages for failed network calls and validation

---

## 🧱 Tech Stack

- **Vite** (dev server & build)
- **Vanilla JavaScript (ES Modules)**
- **HTML5** & **CSS** (utility-first **framework** styling)
- **Tailwind CSS** (configured via PostCSS) *(if applicable in this repo)*

> See `package.json`, `postcss.config.js`, and `tailwind.config.js` for setup.

---

## 📦 Getting Started

```bash
# 1) Install dependencies
npm install

# 2) Start dev server
npm run dev

# 3) Build for production
npm run build

# 4) Preview local production build
npm run preview
```

The app typically runs on **http://localhost:5173** in development.

---

## 🔗 API

This project integrates with the **Noroff Auction API** (v2).  
You will need a valid registered user to access authenticated endpoints for creating listings and placing bids.

- Base: `https://v2.api.noroff.dev`  
- Listings: `/auction/listings`  
- Profiles: `/auction/profiles/{name}`  
- Bids: `/auction/listings/{id}/bids`

> Tokens are stored client-side for authenticated requests.

---

## 🗺️ Core Routes

- `/` – Home (latest/active listings, search)
- `/login` – Log in
- `/register` – Register new user
- `/profile` – Profile (avatar + credits)
- `/listings/create` – Create a new listing
- `/listings/:id` – Listing detail + bid UI

---

## ♿ Accessibility & UX

- Semantic HTML and labelled controls
- Keyboard-friendly navigation with visible focus
- Reduced layout shift (image aspect-ratio set)
- Color contrast checked for interactive elements
- Clear validation errors, toast/alert semantics

---

## 🛠️ Development Notes

- **State & Data**: Simple module state with fetch wrappers and defensive parsing
- **Images**: Prefer optimized images ≤ **200KB** (portfolio requirement)
- **Env**: Public API base can be centralized (e.g., `src/constants/api.js`)
- **Build**: Static output suitable for Netlify/Vercel

---

## ✅ Assignment Checklist

- [x] Public GitHub repository
- [x] Live deployment _(add link)_
- [x] README with setup, features, and routes
- [x] Ability to register, log in, update avatar
- [x] Create listings and place bids
- [x] Browse and search listings
- [x] Responsive, accessible UI

---

## 📸 Screenshots (optional)

_Add 1–2 lightweight screenshots (≤ 200KB each) to showcase the UI._

---

## 👩‍💻 Author

**Emily Brynestad** – Frontend Developer & Visual Designer  
Portfolio: https://emilybrynestad.netlify.app

---

## 🪪 License

This project is made under the license of **Noroff School of Technology and Digital Media** (educational use).
