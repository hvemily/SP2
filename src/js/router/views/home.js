// src/js/router/views/home.js
import { fetchListings, fetchFeaturedBids } from "../../api/post/read.js";
import { calculateTimeLeft } from "../../ui/utilities/timeEnds.js";

let currentPage = 0;
const postsPerPage = 8;
let allListings = [];

/* =========================
   Card component (refreshed)
   ========================= */
function createListingCard({ id, title, description, seller, bids, media, endsAt }) {
  const credits = bids?.length ? Math.max(...bids.map(({ amount }) => amount)) : null;
  const highestBid = credits !== null ? `${credits} credits` : "No bids yet";
  const bidCount = bids?.length || 0;

  const sellerName = seller?.name || "Unknown Seller";
  const timeLeftString = calculateTimeLeft(endsAt);

  const imageSrc = media?.[0]?.url || "/src/assets/icons/v-black.png";
  const isPlaceholder = imageSrc === "/src/assets/icons/v-black.png";

  const timeBadgeTone = (() => {
    if (!endsAt) return "bg-gray-800/70 backdrop-blur";
    const ms = new Date(endsAt).getTime() - Date.now();
    if (ms <= 0) return "bg-gray-800/70 backdrop-blur";
    const hours = ms / 36e5;
    if (hours < 6) return "bg-red-600/80";
    if (hours < 24) return "bg-amber-500/90";
    return "bg-emerald-600/80";
  })();

  const sellerInitial =
    (sellerName && sellerName.trim()[0]?.toUpperCase()) || "U";

  return `
    <article class="group relative rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg overflow-hidden">
      <a href="/listing/index.html?id=${id}" class="block">
        <div class="relative aspect-[4/3] overflow-hidden">
          <img
            src="${imageSrc}"
            alt="${title ? title.replace(/"/g, "&quot;") : "Listing image"}"
            loading="lazy"
            class="${isPlaceholder ? "object-contain p-6" : "object-cover"} w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <div class="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full ${timeBadgeTone} px-3 py-1 text-xs font-medium text-white shadow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11 8h2v6h-2zm1-8C5.935 0 1 4.935 1 11s4.935 11 11 11 11-4.935 11-11S18.065 0 12 0zm0 20a9 9 0 1 1 0-18 9 9 0 0 1 0 18z"/></svg>
            ${timeLeftString || "Ends soon"}
          </div>
        </div>
      </a>

      <div class="p-4">
        <a href="/listing/index.html?id=${id}" class="block">
          <h3 class="text-base font-semibold leading-snug line-clamp-2">
            ${title || "Untitled listing"}
          </h3>
        </a>

        <p class="mt-2 text-sm text-gray-600 line-clamp-2">
          ${description ? description : "No description available."}
        </p>

        <div class="mt-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold">
              ${sellerInitial}
            </div>
            <div class="leading-tight">
              <p class="text-xs text-gray-500">Seller</p>
              <p class="text-sm font-medium">${sellerName}</p>
            </div>
          </div>

          <div class="text-right">
            <p class="text-xs text-gray-500">Current bid</p>
            <p class="text-sm font-semibold">${highestBid}</p>
            <p class="mt-0.5 text-[11px] text-gray-500">${bidCount} bid${bidCount === 1 ? "" : "s"}</p>
          </div>
        </div>

        <div class="mt-4">
          <a
            href="/listing/index.html?id=${id}"
            class="inline-flex w-full items-center justify-center rounded-lg border border-gray-900 px-3 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
            aria-label="View listing ${title ? title.replace(/"/g, "&quot;") : ""}"
          >
            View listing
          </a>
        </div>
      </div>
    </article>
  `;
}

/* =========================
   Pagination (polished)
   ========================= */
function updatePaginationButtons() {
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");
  if (prevBtn) prevBtn.disabled = currentPage === 0;
  if (nextBtn) nextBtn.disabled = (currentPage + 1) * postsPerPage >= allListings.length;
}

function createPaginationControls() {
  if (document.getElementById("prevPage") && document.getElementById("nextPage")) return;

  const container = document.getElementById("auction-listings");
  if (!container) return;

  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination-controls flex justify-center mt-8 gap-3";
  paginationContainer.innerHTML = `
    <button id="prevPage"
      class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
      ← Previous
    </button>
    <button id="nextPage"
      class="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50">
      Next →
    </button>
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

/* =========================
   Render helpers
   ========================= */
function renderCurrentPage() {
  const startIndex = currentPage * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  renderListings(allListings.slice(startIndex, endIndex));
  updatePaginationButtons();
}

async function renderListings(listingsData = []) {
  const listingsContainer = document.getElementById("auction-listings");
  if (!listingsContainer) return console.error("❌ No container found for listings!");

  // Ensure nice grid even if HTML forgot classes
  listingsContainer.classList.add(
    "grid", "gap-6",
    "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4"
  );

  listingsContainer.innerHTML = listingsData.length
    ? listingsData.map(createListingCard).join("")
    : "<p class='text-gray-500 text-center'>No listings available.</p>";
}

async function renderFeaturedBids(featuredListings = []) {
  const featuredContainer = document.getElementById("featured-auctions");
  if (!featuredContainer) return console.error("❌ No container found for featured bids!");

  // Match grid style
  featuredContainer.classList.add(
    "grid", "gap-6",
    "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4"
  );

  featuredContainer.innerHTML = featuredListings.length
    ? featuredListings.map(createListingCard).join("")
    : "<p class='text-gray-500 text-center'>No featured bids available.</p>";
}

/* =========================
   Search
   ========================= */
function setupSearch() {
  const searchInput = document.getElementById("searchInput");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = query
      ? allListings.filter(({ title, tags, description }) =>
          [title, description].some((field) => field?.toLowerCase().includes(query)) ||
          (tags && tags.some((tag) => tag.toLowerCase().includes(query))))
      : allListings;

    // Reset to first page when searching, then render only first page of results
    currentPage = 0;
    const pageSlice = filtered.slice(0, postsPerPage);
    renderListings(pageSlice);

    // Update next/prev enabled state based on filtered length
    const total = filtered.length;
    const nextBtn = document.getElementById("nextPage");
    const prevBtn = document.getElementById("prevPage");
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = postsPerPage >= total;
  });
}

/* =========================
   Init
   ========================= */
export default async function homeInit() {
  try {
    const listings = await fetchListings();
    if (!listings || !Array.isArray(listings)) {
      console.error("❌ API response is not in expected format:", listings);
      return;
    }

    // Only future/active listings
    allListings = listings.filter(({ endsAt }) => new Date(endsAt) > new Date());

    renderCurrentPage();
    createPaginationControls();
    setupSearch();
  } catch (error) {
    console.error("❌ Error fetching listings:", error);
  }

  try {
    const featuredBids = await fetchFeaturedBids();
    if (!featuredBids || !Array.isArray(featuredBids)) {
      console.error("❌ Featured bids response is not in expected format:", featuredBids);
      return;
    }
    await renderFeaturedBids(featuredBids);
  } catch (error) {
    console.error("❌ Error fetching featured bids:", error);
  }
}
