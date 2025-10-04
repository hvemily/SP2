// router/views/category.js
import { API_BASE } from "../../api/constants.js";

/** ---- Helpers for smarter matching ---- **/

function singularize(s) {
  if (!s) return s;
  if (s.endsWith("es")) return s.slice(0, -2); 
  if (s.endsWith("s")) return s.slice(0, -1);
  return s;
}
function pluralize(s) {
  if (!s) return s;
  if (s.endsWith("s")) return s;
  if (/(ch|sh|x|z)$/.test(s)) return s + "es";
  return s + "s";
}

function normalizeText(t) {
  return (t || "").toLowerCase().replace(/[_-]+/g, " ").trim();
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Optional alias map per category
const CATEGORY_ALIASES = {
  watch: ["watch", "watches", "wristwatch", "timepiece"],
  vintage: ["vintage", "retro", "classic", "old-school", "old school"],
  art: ["painting", "watercolour", "acrylic", "wall art", "wallart", "picture", "art"],
  fashion: ["clothing", "clothes", "shoes", "shirt", "dress", "suit", "hat"],
  collectibles: ["watch", "watches", "ring", "toy", "telephoe", "glasses"],
  jewelry: ["necklace", "earrings", "ring", "rings", "bracelet", "earstuds"],
};

function buildNeedles(category) {
  const base = normalizeText(category);
  const needles = new Set([base, singularize(base), pluralize(base)]);

  const aliases = CATEGORY_ALIASES[base];
  if (aliases?.length) {
    for (const a of aliases) needles.add(normalizeText(a));
  }
  // Fjern tomme:
  return Array.from(needles).filter(Boolean);
}

function textHasAnyWord(text, needles) {
  const norm = normalizeText(text);
  return needles.some((n) => {
    const rx = new RegExp(`\\b${escapeRegExp(n)}\\b`, "i");
    return rx.test(norm);
  });
}

function tagsHaveAny(tags, needles) {
  if (!Array.isArray(tags)) return false;
  return tags.some((tag) => {
    const norm = normalizeText(tag);
    return needles.some((n) => norm.includes(n));
  });
}

/**
 * Gets category param from URL
 * @returns {string|null} Chosen category in small letters, or null if none are set
 */
export function getCategoryFromURL() {
  const category = new URLSearchParams(window.location.search).get("category");
  return category ? category.toLowerCase() : null;
}

/**
 * Rendering category page: fetching listings, filtering based on category and viewing in DOM
 */
export async function renderCategoryPage() {
  const category = getCategoryFromURL();
  const listingsContainer = document.getElementById("category-listings");
  const titleElement = document.getElementById("category-title");

  if (!listingsContainer) return;

  if (titleElement && category) {
    titleElement.textContent = `Showing results for: ${category.charAt(0).toUpperCase()}${category.slice(1)}`;
  }

  if (!category) {
    listingsContainer.innerHTML = "<p class='text-gray-500 text-center'>No category selected.</p>";
    return;
  }

  const needles = buildNeedles(category);

  try {
    // Fetching all listings
    const response = await fetch(
      `${API_BASE}/auction/listings?sort=created&_order=desc&_seller=true&_bids=true&active=true&_limit=50`
    );

    if (!response.ok) {
      throw new Error(`Error fetching listings: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const allListings = data.data || [];

    // Smarter filter: ordgrenser i tekst + løsere match i tags
    const filteredListings = allListings.filter(({ tags, title, description }) => {
      const tMatch = textHasAnyWord(title, needles) || textHasAnyWord(description, needles);
      const tagMatch = tagsHaveAny(tags, needles);
      return tMatch || tagMatch;
    });

    listingsContainer.innerHTML = filteredListings.length
      ? filteredListings.map(createListingCard).join("")
      : "<p class='text-gray-500 text-center'>No listings available in this category.</p>";

  } catch (error) {
    console.error("❌ Error fetching category listings:", error);
    listingsContainer.innerHTML = "<p class='text-red-500 text-center'>Failed to load listings. Please try again.</p>";
  }
}

/**
 * Makes HTML for a listing card
 * @param {Object} listing - One listing.
 * @returns {string} HTML-string for listing card.
 */
export function createListingCard({ id, title, description, seller, bids, media }) {
  const highestBid = bids?.length ? `${Math.max(...bids.map(({ amount }) => amount))} credits` : "No bids yet";
  const imageSrc = media?.[0]?.url || "/src/assets/icons/v-black.png";
  const imageClass = imageSrc.includes("v-black.png") ? "w-[50%] h-auto object-contain" : "w-full h-full object-cover";

  return `
    <a href="/listing/index.html?id=${id}" class="block mb-10">
      <div class="bg-white border border-gray-300 overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105 flex flex-col h-full">
        <div class="p-4 flex items-center justify-center overflow-hidden h-64">
          <img src="${imageSrc}" alt="${title}" class="${imageClass}">
        </div>
        <div class="p-4 flex flex-col flex-grow">
          <h3 class="text-lg font-bold font-[Inter]">${title}</h3>
          <p class="text-gray-500 text-sm flex-grow">${description?.substring(0, 50) || "No description available."}...</p>
          <p class="text-black font-medium mt-2">Seller: ${seller?.name || "Unknown Seller"}</p>
          <p class="text-black font-semibold mt-2">Current Bid: ${highestBid}</p>
          <button onclick="window.location.href='/listing/index.html?id=${id}'"
            class="text-black px-4 py-2 hover:bg-black hover:text-white font-medium mt-2 border">
            View listing
          </button>
        </div>
      </div>
    </a>
  `;
}

export default renderCategoryPage;
