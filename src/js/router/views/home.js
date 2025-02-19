// src/js/router/views/home.js
import { fetchListings, fetchFeaturedBids } from "../../api/post/read.js";

let currentPage = 0;
const postsPerPage = 8;
let allListings = []; // Alle innlegg lagres her

// Denne funksjonen viser innleggene for gjeldende side
function renderCurrentPage() {
  const startIndex = currentPage * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const listingsToShow = allListings.slice(startIndex, endIndex);
  renderListings(listingsToShow);
  updatePaginationButtons();
}

// Oppdaterer knappene for paginering
function updatePaginationButtons() {
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  if (prevBtn) prevBtn.disabled = currentPage === 0;
  if (nextBtn) nextBtn.disabled = ((currentPage + 1) * postsPerPage >= allListings.length);
}

// Lager pagineringskontroller
function createPaginationControls() {
  if (document.getElementById("prevPage") && document.getElementById("nextPage")) return;

  const container = document.getElementById("auction-listings");
  if (!container) return;
  
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination-controls flex justify-center mt-4 space-x-4";
  paginationContainer.innerHTML = `
    <button id="prevPage" class="bg-gray-300 text-gray-800 px-3 py-1 rounded">Previous</button>
    <button id="nextPage" class="bg-gray-300 text-gray-800 px-3 py-1 rounded">Next</button>
  `;
  container.insertAdjacentElement("afterend", paginationContainer);
  
  document.getElementById("prevPage").addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      renderCurrentPage();
    }
  });
  
  document.getElementById("nextPage").addEventListener("click", () => {
    if ((currentPage + 1) * postsPerPage < allListings.length) {
      currentPage++;
      renderCurrentPage();
    }
  });
  updatePaginationButtons();
}

// Renderer listings i containeren "auction-listings"
async function renderListings(listingsData = null) {
  const listingsContainer = document.getElementById("auction-listings");
  if (!listingsContainer) {
    console.error("No container found for listings!");
    return;
  }
  // Tøm containeren før rendering
  listingsContainer.innerHTML = "";

  if (!listingsData) {
    listingsData = allListings;
  }

  if (listingsData.length === 0) {
    listingsContainer.innerHTML = "<p class='text-gray-500 text-center'>No listings available.</p>";
    return;
  }

  listingsContainer.innerHTML = listingsData
    .map(listing => {
      console.log("Bids Data:", listing.bids);
      console.log("Seller Data:", listing.seller);

      const highestBid = listing.bids && listing.bids.length > 0
        ? `${Math.max(...listing.bids.map(bid => bid.amount))} ${Math.max(...listing.bids.map(bid => bid.amount)) === 1 ? "credit" : "credits"}`
        : "No bids yet";

      const sellerName = listing.seller?.name || listing.seller?.username || "Unknown Seller";

      const endsAt = new Date(listing.endsAt);
      const now = new Date();
      const timeLeft = endsAt - now;
      let timeLeftString = "Expired";
      if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        timeLeftString = `${days}d ${hours}h ${minutes}m left`;
      }

      const imageSrc = listing.media?.[0]?.url || listing.media?.[0] || "/src/assets/icons/v-black.png";
      const isPlaceholder = imageSrc === "/src/assets/icons/v-black.png";
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
              <h3 class="text-lg font-medium">${listing.title}</h3>
              <p class="text-gray-500 text-sm flex-grow">
                ${listing.description ? listing.description.substring(0, 50) + '...' : "No description available."}
              </p>
              <p class="text-gray-700 font-medium mt-2">Seller: ${sellerName}</p>
              <p class="text-customBlue font-semibold mt-2">Current Bid: ${highestBid} | <span class="text-gray-600 font-medium">${timeLeftString}</span></p>
<button onclick="window.location.href='/listing/index.html?id=${listing.id}'"
  class="text-black px-4 py-2 hover:bg-black hover:text-white font-medium mt-2 border">
  View listing
</button>
            </div>
          </div>
        </a>
      `;
    })
    .join("");
}

// Renderer featured bids i containeren "featured-auctions"
async function renderFeaturedBids(featuredListings) {
  const featuredContainer = document.getElementById("featured-auctions");
  if (!featuredContainer) {
    console.error("No container found for featured bids!");
    return;
  }
  if (featuredListings.length === 0) {
    featuredContainer.innerHTML = "<p class='text-gray-500 text-center'>No featured bids available.</p>";
    return;
  }
  featuredContainer.innerHTML = featuredListings
    .map(listing => {
      console.log("Featured Listing:", listing);
      const highestBid = listing.bids?.length
        ? `${Math.max(...listing.bids.map(bid => bid.amount))} credits`
        : "No bids yet";
      const imageSrc = listing.media?.[0]?.url || listing.media?.[0] || "/src/assets/icons/v-black.png";
      const isPlaceholder = imageSrc === "/src/assets/icons/v-black.png";
      const imageClass = isPlaceholder ? "w-[50%] h-auto object-contain" : "w-full h-full object-cover";
      return `
        <a href="/listing/index.html?id=${listing.id}" class="block">
          <div class="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105 flex flex-col h-full">
            <div class="p-4">
              <div class="w-full h-64 flex items-center justify-center overflow-hidden">
                <img src="${imageSrc}" alt="${listing.title}" class="${imageClass}">
              </div>
            </div>
            <div class="p-4 flex flex-col flex-grow">
              <h3 class="text-lg font-medium">${listing.title}</h3>
              <p class="text-gray-500 text-sm flex-grow">${listing.description ? listing.description.substring(0, 50) + '...' : "No description available."}</p>
              <p class="text-customBlue font-semibold mt-2">Current Bid: ${highestBid}</p>
<button onclick="window.location.href='/listing/index.html?id=${listing.id}'"
  class="text-black px-4 py-2 hover:bg-black hover:text-white font-medium mt-2 border">
  View listing
</button>
            </div>
          </div>
        </a>
      `;
    })
    .join("");
}

// Søkefunksjon (bruk kun "input" event for å unngå duplikater)
if (document.getElementById("searchInput")) {
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", async (event) => {
    const query = searchInput.value.toLowerCase().trim();
    if (query === "") {
      renderListings(allListings);
    } else {
      let filteredListings = allListings.filter(listing =>
        listing.title.toLowerCase().includes(query) ||
        (listing.tags && listing.tags.some(tag => tag.toLowerCase().includes(query))) ||
        (listing.description && listing.description.toLowerCase().includes(query))
      );
      renderListings(filteredListings);
    }
  });
}

// Eksporter en init-funksjon som routeren kan kalle
export default async function homeInit() {
  console.trace("homeInit called!");
  console.log("🏠 homeInit() running in home.js...");
  try {
    const listings = await fetchListings();
    console.log("✅ Listings fetched:", listings);
    if (!listings || listings.length === 0) {
      console.warn("⚠️ No listings found!");
    }
    const now = new Date();
    allListings = listings.filter(listing => new Date(listing.endsAt) > now);
    renderCurrentPage();
    createPaginationControls();
  } catch (error) {
    console.error("❌ Error rendering listings:", error);
  }
  
  try {
    const featuredBids = await fetchFeaturedBids();
    console.log("✅ Featured bids fetched:", featuredBids);
    if (!featuredBids || featuredBids.length === 0) {
      console.warn("⚠️ No featured bids found!");
    }
    await renderFeaturedBids(featuredBids);
  } catch (error) {
    console.error("❌ Error rendering featured bids:", error);
  }
}
