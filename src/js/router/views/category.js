// router/views/category.js
import { apiRequest } from "../../ui/utilities/apiRequest.js";
import { setLogoutListener } from "../../ui/global/logout.js";

/**
 * Henter kategori-parameteren fra URL-en.
 * @returns {string|null} Den valgte kategorien i små bokstaver, eller null hvis ingen er satt.
 */
export function getCategoryFromURL() {
  const category = new URLSearchParams(window.location.search).get("category");
  return category ? category.toLowerCase() : null;
}

/**
 * Render kategori-siden: Henter alle listings, filtrerer basert på kategori, og viser dem i DOM-en.
 */
export async function renderCategoryPage() {
  const category = getCategoryFromURL();
  const listingsContainer = document.getElementById("category-listings");
  const titleElement = document.getElementById("category-title");

  if (titleElement && category) {
    titleElement.textContent = `Showing results for: ${category.charAt(0).toUpperCase()}${category.slice(1)}`;
  }

  try {
    // 🔹 Bruker apiRequest for å holde alle API-kall konsistente
    const allListings = await apiRequest(`/auction/listings?sort=created&_order=desc&_seller=true&_bids=true&active=true&_limit=50`);
    const filteredListings = allListings?.filter(({ tags, title, description }) => {
      return [tags, title, description].some((field) => field?.toLowerCase().includes(category));
    }) || [];

    listingsContainer.innerHTML = filteredListings.length
      ? filteredListings.map(createListingCard).join("")
      : "<p class='text-gray-500 text-center'>No listings available in this category.</p>";

  } catch (error) {
    console.error("❌ Error fetching category listings:", error);
    listingsContainer.innerHTML = "<p class='text-red-500 text-center'>Failed to load listings. Please try again.</p>";
  }
}

/**
 * Lager HTML for et listing-kort.
 * @param {Object} listing - En enkelt listing.
 * @returns {string} HTML-streng for listing-kortet.
 */
export function createListingCard({ id, title, description, seller, bids, media }) {
  const highestBid = bids?.length ? `${Math.max(...bids.map(({ amount }) => amount))} credits` : "No bids yet";
  const imageSrc = media?.[0]?.url || "/src/assets/icons/v-black.png";
  const imageClass = imageSrc.includes("v-black.png") ? "w-[50%] h-auto object-contain" : "w-full h-full object-cover";

  return `
    <a href="/listing/index.html?id=${id}" class="block">
      <div class="bg-white border border-gray-300 overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105 flex flex-col h-full">
        <div class="p-4 flex items-center justify-center overflow-hidden h-64">
          <img src="${imageSrc}" alt="${title}" class="${imageClass}">
        </div>
        <div class="p-4 flex flex-col flex-grow">
          <h3 class="text-lg font-bold font-[crimson]">${title}</h3>
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

// Eksporter default slik at routeren kan kalle denne funksjonen
export default renderCategoryPage;
