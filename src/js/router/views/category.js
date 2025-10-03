// src/js/router/views/category.js
import { API_BASE } from "../../api/constants.js";
import { calculateTimeLeft } from "../../ui/utilities/timeEnds.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";

/**
 * Map fra meny/URL -> søkeord/tags i data.
 * - Venstresiden er det du bruker i URL (?category=art) og i menyen.
 * - Høyresiden er ord vi prøver å finne i title/description/tags.
 *   Legg til/fjern som du ønsker.
 */
const CATEGORY_MAP = {
  art: ["art", "arts", "painting", "print", "canvas", "illustration", "sketch", "drawing"],
  electronics: ["electronics", "camera", "phone", "laptop", "console", "headphones", "speaker", "tv"],
  fashion: ["fashion", "clothes", "clothing", "jacket", "shoes", "bag", "jewelry", "ring", "necklace"],
  "collectibles-memorabilia": ["collectibles", "memorabilia", "vintage", "retro", "figurine", "card"],
  "home-garden": ["home", "kitchen", "furniture", "decor", "lamp", "garden", "plant", "tool"],
  gaming: ["gaming", "console", "playstation", "xbox", "nintendo", "switch", "pc", "controller"],
  sports: ["sports", "football", "soccer", "basketball", "tennis", "golf", "jersey", "bike"],
  books: ["book", "books", "novel", "manga", "comic", "literature", "magazine"],
  toys: ["toy", "toys", "lego", "puzzle", "doll", "model"],
  // legg til egne:
  // "your-category": ["tag1","tag2","..."]
};

function getCategoryFromURL() {
  const raw = new URLSearchParams(window.location.search).get("category");
  return raw ? String(raw).toLowerCase() : null;
}

function toWordsLower(text) {
  return String(text || "")
    .toLowerCase();
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((t) => (typeof t === "string" ? t : (t?.name ?? "")))
    .filter(Boolean)
    .map((t) => t.toLowerCase());
}

export default async function renderCategoryPage() {
  const category = getCategoryFromURL();
  const listingsContainer = document.getElementById("category-listings");
  const titleElement = document.getElementById("category-title");

  if (!listingsContainer) return;

  if (titleElement) {
    titleElement.textContent = category
      ? `Showing results for: ${category.replaceAll("-", " ")}`
      : "All active listings";
  }

  try {
    // ✅ Bruk samme helper som resten av appen (inkl. X-Noroff-API-Key)
    const resp = await apiRequest(
      `${API_BASE}/auction/listings?sort=created&_order=desc&_seller=true&_bids=true&active=true&_limit=100`,
      "GET"
    );

    let all = resp?.data || [];

    // Kun aktive annonser (ikke utløpt)
    const now = new Date();
    all = all.filter((l) => l?.endsAt && new Date(l.endsAt) > now);

    // Hvis kategori valgt, filtrer med både tags og tekst
    let filtered = all;
    if (category && CATEGORY_MAP[category]) {
      const needles = CATEGORY_MAP[category].map((w) => w.toLowerCase());

      filtered = all.filter((item) => {
        const t = toWordsLower(item?.title);
        const d = toWordsLower(item?.description);
        const tags = normalizeTags(item?.tags);

        const textHit = needles.some((n) => t.includes(n) || d.includes(n));
        const tagHit = needles.some((n) => tags.includes(n) || tags.some((tg) => tg.includes(n)));

        return textHit || tagHit;
      });
    } else if (category && !CATEGORY_MAP[category]) {
      // Kategori finnes ikke i mapping – viser ingenting og forklarer.
      filtered = [];
    }

    listingsContainer.innerHTML =
      filtered.length > 0
        ? filtered.map(createListingCard).join("")
        : emptyState(category);
  } catch (err) {
    console.error("❌ Error fetching category listings:", err);
    listingsContainer.innerHTML = `
      <div class="text-red-600 border border-red-300 bg-red-50 p-4 text-center">
        Failed to load listings. Please try again.
      </div>`;
  }
}

function emptyState(category) {
  if (!category) {
    return `<p class="text-gray-500 text-center">No active listings found.</p>`;
  }
  const hint = CATEGORY_MAP[category]
    ? `Try adding tags like: <span class="font-medium">${CATEGORY_MAP[category].slice(0, 6).join(", ")}</span> when creating listings.`
    : `Unknown category: <span class="font-medium">${category}</span>. Add it to CATEGORY_MAP in <code>category.js</code>.`;

  return `
    <div class="max-w-xl mx-auto text-center p-6 border bg-white">
      <p class="text-gray-700">No active listings available in this category yet.</p>
      <p class="text-gray-500 mt-2">${hint}</p>
      <a href="/"
         class="inline-block mt-4 px-4 py-2 border hover:bg-black hover:text-white transition">
        Back to Home
      </a>
    </div>
  `;
}

function createListingCard({ id, title, description, seller, bids, media, endsAt }) {
  const highestBid = bids?.length ? `${Math.max(...bids.map(({ amount }) => Number(amount) || 0))} credits` : "No bids yet";
  const imageSrc = media?.[0]?.url || "/src/assets/icons/v-black.png";
  const imageClass = imageSrc.includes("v-black.png") ? "w-[50%] h-auto object-contain" : "w-full h-full object-cover";
  const timeLeftString = endsAt ? calculateTimeLeft(endsAt) : "No end date";

  return `
  <a href="/listing/index.html?id=${id}" class="block">
    <article class="bg-white border border-gray-300 overflow-hidden transition-transform hover:scale-[1.01] flex flex-col h-full">
      <div class="p-4 flex items-center justify-center overflow-hidden h-64">
        <img src="${imageSrc}" alt="${escapeHtml(title)}" class="${imageClass}">
      </div>
      <div class="p-4 flex flex-col flex-grow">
        <h3 class="text-lg font-bold font-[Inter]">${escapeHtml(title) || "Untitled"}</h3>
        <p class="text-gray-600 text-sm flex-grow">
          ${escapeHtml((description || "").slice(0, 120))}${(description || "").length > 120 ? "…" : ""}
        </p>
        <p class="text-black font-medium mt-2">Seller: ${escapeHtml(seller?.name || "Unknown")}</p>
        <div class="mt-2 flex items-center justify-between text-sm">
          <span class="text-black font-semibold">Current Bid: ${highestBid}</span>
          <span class="text-gray-700">Time Left: <span class="text-gray-600 font-medium">${timeLeftString}</span></span>
        </div>
        <button
          onclick="window.location.href='/listing/index.html?id=${id}'"
          class="text-black px-4 py-2 hover:bg-black hover:text-white font-medium mt-3 border">
          View listing
        </button>
      </div>
    </article>
  </a>
  `;
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
