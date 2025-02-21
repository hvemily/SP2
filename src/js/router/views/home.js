// src/js/router/views/home.js
import { fetchListings, fetchFeaturedBids } from "../../api/post/read.js";

let currentPage = 0;
const postsPerPage = 8;
let allListings = [];

//Function to show listings on the current page
function renderCurrentPage() {
  console.log("🔄 Rendering page:", currentPage);
  const startIndex = currentPage * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  renderListings(allListings.slice(startIndex, endIndex));
  updatePaginationButtons();
}

//Updating pagination
function updatePaginationButtons() {
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  if (prevBtn) prevBtn.disabled = currentPage === 0;
  if (nextBtn) nextBtn.disabled = (currentPage + 1) * postsPerPage >= allListings.length;
}

// Creates pagination btns
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

// Renderer listings in DOM
async function renderListings(listingsData = []) {
  const listingsContainer = document.getElementById("auction-listings");
  if (!listingsContainer) return console.error("❌ No container found for listings!");

  listingsContainer.innerHTML = listingsData.length
    ? listingsData.map(createListingCard).join("")
    : "<p class='text-gray-500 text-center'>No listings available.</p>";
}

// Fetches and shows featured bids
async function renderFeaturedBids(featuredListings = []) {
  const featuredContainer = document.getElementById("featured-auctions");
  if (!featuredContainer) return console.error("❌ No container found for featured bids!");

  featuredContainer.innerHTML = featuredListings.length
    ? featuredListings.map(createListingCard).join("")
    : "<p class='text-gray-500 text-center'>No featured bids available.</p>";
}

//Makes HTML for listing card
function createListingCard({ id, title, description, seller, bids, media, endsAt }) {
  const highestBid = bids?.length
    ? `${Math.max(...bids.map(({ amount }) => amount))} credits`
    : "No bids yet";

  const sellerName = seller?.name || "Unknown Seller";
  const timeLeftString = calculateTimeLeft(endsAt);
  
  const imageSrc = media?.[0]?.url || "/src/assets/icons/v-black.png";
  const isPlaceholder = imageSrc === "/src/assets/icons/v-black.png";
  const imageClass = isPlaceholder ? "w-[50%] h-auto object-contain" : "w-full h-full object-cover";

  return `
    <a href="/listing/index.html?id=${id}" class="block">
      <div class="bg-white border border-gray-300 overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105 flex flex-col h-full">
        <div class="p-4 flex items-center justify-center overflow-hidden h-64">
          <img src="${imageSrc}" alt="${title}" class="${imageClass}">
        </div>
        <div class="p-4 flex flex-col flex-grow">
          <h3 class="text-lg font-bold font-[inter]">${title}</h3>
          <p class="text-gray-500 text-sm flex-grow">${description?.substring(0, 50) || "No description available."}...</p>
          <p class="text-black font-medium mt-2">Seller: ${sellerName}</p>
          <p class="text-black font-semibold mt-2 text-sm">Current Bid: ${highestBid} | <span class="text-gray-600 font-medium">${timeLeftString}</span></p>
          <button onclick="window.location.href='/listing/index.html?id=${id}'"
            class="text-black px-4 py-2 hover:bg-black hover:text-white font-medium mt-2 border">
            View listing
          </button>
        </div>
      </div>
    </a>
  `;
}

//Time before listing ends
function calculateTimeLeft(endsAt) {
  if (!endsAt) return "No end date";
  
  const now = new Date();
  const endDate = new Date(endsAt);
  const timeLeft = endDate - now;

  if (timeLeft <= 0) return "Expired";

  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  return `${days}d ${hours}h ${minutes}m left`;
}

// Search function
function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    renderListings(query
      ? allListings.filter(({ title, tags, description }) =>
          [title, description].some((field) => field?.toLowerCase().includes(query)) ||
          (tags && tags.some((tag) => tag.toLowerCase().includes(query))))
      : allListings
    );
  });
}

// Init funksjon
export default async function homeInit() {
  console.log("🏠 Initializing home page...");

  try {
    const listings = await fetchListings();
    console.log("🔍 API response for listings:", listings); // Debugging

    if (!listings || !Array.isArray(listings)) {
      console.error("❌ API response is not in expected format:", listings);
      return;
    }

    allListings = listings.filter(({ endsAt }) => new Date(endsAt) > new Date());

    renderCurrentPage();
    createPaginationControls();
    setupSearch();
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
  }

  try {
    const featuredBids = await fetchFeaturedBids();
    console.log("🔍 API response for featured bids:", featuredBids);

    if (!featuredBids || !Array.isArray(featuredBids)) {
      console.error("❌ Featured bids response is not in expected format:", featuredBids);
      return;
    }

    await renderFeaturedBids(featuredBids);
  } catch (error) {
    console.error("❌ Error fetching featured bids:", error);
  }
}
