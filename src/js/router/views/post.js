import { fetchSingleListing } from "../../api/post/read.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";
import { showAlert } from "../../../app.js";
import { API_LISTINGS } from "../../api/constants.js";
import { calculateTimeLeft } from "../../ui/utilities/timeEnds.js";

/**
 * Entry: Get listing ID from URL, load data and render
 */
export default async function initListingDetail() {
  const listingId = new URLSearchParams(window.location.search).get("id");
  if (!listingId) {
    console.error("❌ No listing ID found in URL!");
    return;
  }

  try {
    const listing = await fetchSingleListing(listingId); // forventer ett listing-objekt
    renderListingDetail(listing);
    wireBidToggle();
    wireThumbClicks();
    wireViewBids(listing.id);
  } catch (error) {
    console.error("❌ Could not fetch listing details:", error);
    const c = document.getElementById("category-listings");
    if (c) {
      c.innerHTML = `<p class="text-red-500 text-center">Failed to load listing details. Please try again later.</p>`;
    }
  }
}

/* =========================
  Rendering detail page
   ========================= */
function renderListingDetail(listing) {
  const container = document.getElementById("category-listings");
  if (!container) return console.error("❌ Container for listing detail not found!");

  const titleElement = document.getElementById("category-title");
  if (titleElement) titleElement.textContent = listing.title || "Untitled";

  const bids = Array.isArray(listing.bids) ? listing.bids : [];
  const highest = bids.length ? Math.max(...bids.map(b => Number(b.amount))) : 0;
  const bidCount = bids.length;
  const sellerName = listing?.seller?.name || "Unknown";
  const timeLeft = calculateTimeLeft(listing.endsAt);

  const media = Array.isArray(listing.media) ? listing.media : [];
  const mainSrc = media?.[0]?.url || "/src/assets/icons/v-black.png";
  const isPlaceholder = mainSrc === "/src/assets/icons/v-black.png";

  // Fargelogikk for time badge
  const timeBadgeTone = (() => {
    if (!listing.endsAt) return "bg-gray-800/70 backdrop-blur";
    const ms = new Date(listing.endsAt).getTime() - Date.now();
    if (ms <= 0) return "bg-gray-800/70 backdrop-blur";
    const hours = ms / 36e5;
    if (hours < 6) return "bg-red-600/80";
    if (hours < 24) return "bg-amber-500/90";
    return "bg-emerald-600/80";
  })();

  const sellerInitial = sellerName.trim()[0]?.toUpperCase?.() || "U";

  container.innerHTML = `
    <section class="mx-auto max-w-6xl">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
        <!-- Media column -->
        <div>
          <div class="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <img
              id="listing-main-image"
              src="${mainSrc}"
              alt="${(listing.title || "Listing image").replace(/"/g, "&quot;")}"
              class="${isPlaceholder ? "object-contain p-10" : "object-cover"} h-[420px] w-full"
              loading="eager"
            />
            <div class="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full ${timeBadgeTone} px-3 py-1 text-xs font-medium text-white shadow">
              ${svgClock()}
              ${timeLeft || "Ends soon"}
            </div>
          </div>

          ${
            media.length > 1
              ? `
            <div class="mt-4 grid grid-cols-5 gap-3">
              ${media
                .slice(0, 10)
                .map(
                  (m, idx) => `
                <button
                  class="thumb-btn group overflow-hidden rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-black"
                  data-image="${m.url}"
                  aria-label="Show image ${idx + 1}"
                >
                  <img
                    src="${m.url}"
                    alt="Thumbnail ${idx + 1}"
                    class="h-20 w-full object-cover transition-transform group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </button>`
                )
                .join("")}
            </div>
          `
              : ""
          }
        </div>

        <!-- Info column -->
        <div>
          <h1 class="text-2xl font-semibold leading-tight">${listing.title || "Untitled listing"}</h1>
          <p class="mt-2 text-sm text-gray-600 whitespace-pre-line">${listing.description || "No description available."}</p>

          <div class="mt-6 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold">
                ${sellerInitial}
              </div>
              <div class="leading-tight">
                <p class="text-xs text-gray-500">Seller</p>
                <p class="text-sm font-medium">${sellerName}</p>
              </div>
            </div>

            <div class="text-right">
              <p class="text-xs text-gray-500">Current bid</p>
              <p class="text-lg font-semibold"><span id="currentHighestBid">${highest}</span> credits</p>
              <p class="mt-0.5 text-[11px] text-gray-500"><span id="bidCount">${bidCount}</span> bid${bidCount === 1 ? "" : "s"}</p>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button id="placeBidBtn"
              class="inline-flex items-center justify-center rounded-lg border border-gray-900 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-900 hover:text-white">
              ${svgHammer()}
              Place bid
            </button>

            <button id="viewBidsBtn"
              class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50">
              ${svgList()}
              View bid history
            </button>
          </div>

          <!-- Bid form -->
          <form id="bidForm" class="mt-4 hidden space-y-3 rounded-xl border border-gray-200 bg-white p-4">
            <label for="bidAmount" class="text-sm font-medium text-gray-800">Your bid (credits)</label>
            <input
              type="number" id="bidAmount" min="1" step="1" inputmode="numeric"
              class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your bid"
              aria-describedby="bidHelp"
            />
            <p id="bidHelp" class="text-xs text-gray-500">Your bid must be higher than the current highest bid.</p>

            <div class="flex items-center gap-3">
              <button type="submit"
                class="inline-flex items-center justify-center rounded-lg border border-gray-900 px-4 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-900 hover:text-white">
                Submit bid
              </button>
              <button type="button" id="cancelBidBtn"
                class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>

          <!-- Bid history container -->
          <div id="bids-container" class="mt-6 rounded-xl border border-gray-200 bg-white p-4 hidden"></div>
        </div>
      </div>
    </section>
  `;

  // Wire bid submit handling (needs current highest)
  addBidEventListeners(listing.id, highest);
}

/* =========================
   Event wiring
   ========================= */
function wireBidToggle() {
  const btn = document.getElementById("placeBidBtn");
  const form = document.getElementById("bidForm");
  const cancel = document.getElementById("cancelBidBtn");
  if (!btn || !form) return;

  btn.addEventListener("click", () => form.classList.toggle("hidden"));
  if (cancel) cancel.addEventListener("click", () => form.classList.add("hidden"));
}

function wireThumbClicks() {
  const mainImg = document.getElementById("listing-main-image");
  const thumbs = document.querySelectorAll(".thumb-btn");
  if (!mainImg || !thumbs.length) return;
  thumbs.forEach((b) =>
    b.addEventListener("click", () => {
      const url = b.getAttribute("data-image");
      if (url) mainImg.src = url;
    })
  );
}

function wireViewBids(listingId) {
  const btn = document.getElementById("viewBidsBtn");
  if (!btn || !listingId) return;
  btn.addEventListener("click", async () => {
    const b = document.getElementById("bids-container");
    if (!b) return;
    if (!b.classList.contains("hidden")) {
      b.classList.add("hidden");
      b.innerHTML = "";
      return;
    }
    await showBids(listingId);
    b.classList.remove("hidden");
  });
}

/* =========================
   Bid handling
   ========================= */
function addBidEventListeners(listingId, currentHighestBid) {
  const form = document.getElementById("bidForm");
  if (!form) return;

  // Make sure we don't double register listeners with re-rendering
  const clone = form.cloneNode(true);
  form.parentNode.replaceChild(clone, form);
  const f = document.getElementById("bidForm");

  f.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = document.getElementById("bidAmount");
    const bidAmount = Number(input?.value);
    const highestBid = Number(currentHighestBid);

    if (isNaN(bidAmount) || bidAmount <= 0 || bidAmount <= highestBid) {
      return showAlert(`Invalid Bid: Your bid must be higher than the current highest bid (${highestBid} credits).`, "error");
    }

    try {
      await handleBid(listingId, bidAmount);
      await initListingDetail(); // re-render
      showAlert(`Your bid of ${bidAmount} credits has been placed successfully.`, "success");
    } catch (error) {
      const msg = error?.errors?.[0]?.message || "An error occurred while placing your bid. Please try again.";
      showAlert(msg, "error");
    }
  }, { once: true });
}

/**
 * Send bid to API + simple localStorage credit update
 * NB: keeps you existing signature for apiReqquest (url, method, body, auth)
 */
async function handleBid(listingId, bidAmount) {
  const email = localStorage.getItem("email");
  if (!email) {
    return showAlert("You must be logged in to place a bid.", "error");
  }

  const creditsKey = `credits_${email}`;
  const userCredits = Number(localStorage.getItem(creditsKey)) || 0;

  if (bidAmount > userCredits) {
    return showAlert(`Not enough credits! You only have ${userCredits} credits.`, "error");
  }

  await apiRequest(`${API_LISTINGS}/${listingId}/bids`, "POST", { amount: bidAmount }, true);

  // Update locally for snappy UI
  localStorage.setItem(creditsKey, String(userCredits - bidAmount));
  return true;
}

/* =========================
   Get and view bidding history
   ========================= */
async function showBids(listingId) {
  const bidsContainer = document.getElementById("bids-container");
  if (!bidsContainer) return;

  try {
    const resp = await apiRequest(`/auction/listings/${listingId}?_bids=true&_seller=true`, "GET", null, true);
    const listingObj = resp?.data ?? resp ?? {};
    const list = Array.isArray(listingObj.bids) ? listingObj.bids : [];

    bidsContainer.innerHTML = list.length
      ? `
        <h3 class="text-base font-semibold">Bid history</h3>
        <ul class="mt-3 divide-y divide-gray-100 rounded-lg border border-gray-100">
          ${list
            .sort((a, b) => Number(b.amount) - Number(a.amount))
            .map(
              (bid) => `
            <li class="flex items-center justify-between px-3 py-2 text-sm">
              <span class="text-gray-700">${bid.bidderName || "Unknown"}</span>
              <span class="font-semibold">${Number(bid.amount)} credits</span>
            </li>`
            )
            .join("")}
        </ul>`
      : `<p class='text-gray-500'>No bids have been placed yet.</p>`;
  } catch (error) {
    console.error("❌ Error fetching bids:", error);
    bidsContainer.innerHTML = `<p class='text-red-500'>Failed to load bids.</p>`;
  }
}

/* =========================
   Ikoner (inline SVG)
   ========================= */
function svgClock() {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11 8h2v6h-2zm1-8C5.935 0 1 4.935 1 11s4.935 11 11 11 11-4.935 11-11S18.065 0 12 0zm0 20a9 9 0 1 1 0-18 9 9 0 0 1 0 18z"/></svg>`;
}
function svgHammer() {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M17.7 2.3a1 1 0 0 1 1.4 0l2.6 2.6a1 1 0 0 1 0 1.4l-3 3a1 1 0 0 1-1.4 0l-1-1-2.1 2.1 1 1a1 1 0 0 1 0 1.4L7.4 21.6a2 2 0 0 1-2.8 0l-2.2-2.2a2 2 0 0 1 0-2.8l8.8-8.8a1 1 0 0 1 1.4 0l1 1L15 6.8l-1-1a1 1 0 0 1 0-1.4l3.7-2.1z"/></svg>`;
}
function svgList() {
  return `<svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"/></svg>`;
}
