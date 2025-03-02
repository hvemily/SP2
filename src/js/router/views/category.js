// router/views/category.js
import { API_BASE } from "../../api/constants.js";
import { calculateTimeLeft } from "../../ui/utilities/timeEnds.js";

/**
 * Gets category param from URL
 * @returns {string|null} Chosen category in small letters, or null if none are set
 */
export function getCategoryFromURL() {
  const category = new URLSearchParams(window.location.search).get("category");
  return category ? category.toLowerCase() : null;
}

export async function renderCategoryPage() {
  const category = getCategoryFromURL();
  const listingsContainer = document.getElementById("category-listings");
  const titleElement = document.getElementById("category-title");

  if (titleElement && category) {
    titleElement.textContent = `Showing results for: ${category.charAt(0).toUpperCase()}${category.slice(1)}`;
  }

  try {
    // Fetch all listings from API
    const response = await fetch(`${API_BASE}/auction/listings?sort=created&_order=desc&_seller=true&_bids=true&active=true&_limit=50`);

    if (!response.ok) {
      throw new Error(`Error fetching listings: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    let allListings = data.data || [];

    // 🔥 Filtrer ut annonser der sluttidspunktet er passert
    const now = new Date();
    allListings = allListings.filter(listing => new Date(listing.endsAt) > now);

    // 🔥 Filtrer på kategori (hvis det er en valgt kategori)
    const filteredListings = allListings.filter(({ tags, title, description }) => {
      return [title, description]
        .filter(Boolean) // Fjerner null/undefined verdier
        .some((field) => typeof field === "string" && field.toLowerCase().includes(category)) ||
        (Array.isArray(tags) && tags.some((tag) => typeof tag === "string" && tag.toLowerCase().includes(category)));
    });

    // 🎯 Oppdater DOM
    listingsContainer.innerHTML = filteredListings.length
      ? filteredListings.map(createListingCard).join("")
      : "<p class='text-gray-500 text-center'>No active listings available in this category.</p>";

  } catch (error) {
    console.error("❌ Error fetching category listings:", error);
    listingsContainer.innerHTML = "<p class='text-red-500 text-center'>Failed to load listings. Please try again.</p>";
  }
}

/**
 * makes HTML for listing card
 * @param {Object} listing - one listing.
 * @returns {string} HTML-string for listing card.
 */
export function createListingCard({ id, title, description, seller, bids, media, endsAt }) {
  const highestBid = bids?.length ? `${Math.max(...bids.map(({ amount }) => amount))} credits` : "No bids yet";
  const imageSrc = media?.[0]?.url || "/src/assets/icons/v-black.png";
  const imageClass = imageSrc.includes("v-black.png") ? "w-[50%] h-auto object-contain" : "w-full h-full object-cover";
  
  // ✅ Henter riktig tid igjen for auksjonen
  const timeLeftString = endsAt ? calculateTimeLeft(endsAt) : "No end date";

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
        <p class="text-black font-semibold mt-2 text-sm">
          Time Left: <span class="text-gray-600 font-medium">${timeLeftString}</span>
        </p>
        <button onclick="window.location.href='/listing/index.html?id=${id}'"
          class="text-black px-4 py-2 hover:bg-black hover:text-white font-medium mt-2 border">
          View listing
        </button>
      </div>
    </div>
  </a>
  `;
}

//Exporting default so the router can call the function
export default renderCategoryPage;
