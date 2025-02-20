// router/views/category.js
import { fetchListings } from "../../api/post/read.js";
import { setLogoutListener } from "../../ui/global/logout.js";

/**
 * Henter kategori-parameteren fra URL-en.
 * @returns {string|null} Den valgte kategorien i små bokstaver, eller null hvis ingen er satt.
 */
export function getCategoryFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get("category");
  console.log("🔍 Kategori fra URL:", category);
  return category ? category.toLowerCase() : null;
}

/**
 * Render kategori-siden: Henter alle listings, filtrerer basert på kategori, 
 * og viser resultatene i DOM-en.
 */
export async function renderCategoryPage() {
  const category = getCategoryFromURL();
  const listingsContainer = document.getElementById("category-listings");
  const titleElement = document.getElementById("category-title");

  if (titleElement && category) {
    titleElement.textContent =
      "Showing results for: " +
      category.charAt(0).toUpperCase() +
      category.slice(1);
  }

  // Hent listings – vi henter flere slik at filtreringen får et bredt utvalg
  const allListings = await fetchListings(50);
  console.log("✅ Hentede annonser:", allListings);

  // Filtrer listings basert på kategori (sjekker tags, tittel og beskrivelse)
  const filteredListings = allListings.filter((listing) => {
    const lowerCategory = category;
    const inTags =
      listing.tags &&
      listing.tags.some((tag) => tag.toLowerCase().includes(lowerCategory));
    const inTitle =
      listing.title &&
      listing.title.toLowerCase().includes(lowerCategory);
    const inDescription =
      listing.description &&
      listing.description.toLowerCase().includes(lowerCategory);
    return inTags || inTitle || inDescription;
  });

  console.log(`🎯 Filtrerte annonser for kategori "${category}":`, filteredListings);

  // Hvis ingen listings matcher, vis en melding
  if (!filteredListings.length) {
    if (listingsContainer) {
      listingsContainer.innerHTML =
        "<p class='text-gray-500 text-center'>No listings available in this category.</p>";
    }
    return;
  }

  // Render de filtrerte listingene
  if (listingsContainer) {
    listingsContainer.innerHTML = filteredListings
      .map((listing) => createListingCard(listing))
      .join("");
  }
}

/**
 * Lager HTML-koden for et enkelt listing-kort.
 * @param {Object} listing - En enkelt listing.
 * @returns {string} HTML-streng for listing-kortet.
 */
export function createListingCard(listing) {
  // Beregn høyeste bud
  const highestBid =
    listing.bids && listing.bids.length > 0
      ? `${Math.max(...listing.bids.map((bid) => bid.amount))} ${
          Math.max(...listing.bids.map((bid) => bid.amount)) === 1 ? "credit" : "credits"
        }`
      : "No bids yet";

  // Velg bilde (bruk placeholder hvis ingen bilde)
  const imageSrc =
    listing.media?.[0]?.url || listing.media?.[0] || "/src/assets/icons/v-black.png";
  const isPlaceholder = imageSrc.includes("v-black.png");
  const imageClass = isPlaceholder ? "w-[50%] h-auto object-contain" : "w-full h-full object-cover";

  return `
    <a href="/listing/index.html?id=${listing.id}" class="block">
      <div class="bg-white border border-gray-300 overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105 flex flex-col h-full">
        <div class="p-4">
          <div class="w-full h-64 flex items-center justify-center overflow-hidden">
            <img src="${imageSrc}" alt="${listing.title}" class="${imageClass}">
          </div>
        </div>
        <div class="p-4 flex flex-col flex-grow">
          <h3 class="text-lg font-bold font-[crimson]">${listing.title}</h3>
          <p class="text-gray-500 text-sm flex-grow">
            ${listing.description ? listing.description.substring(0, 50) + "..." : "No description available."}
          </p>
          <p class="text-black font-medium mt-2">Seller: ${listing.seller?.name || "Unknown Seller"}</p>
          <p class="text-black font-semibold mt-2">Current Bid: ${highestBid}</p>
<button onclick="window.location.href='/listing/index.html?id=${listing.id}'"
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
