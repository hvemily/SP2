import { fetchSingleListing } from "../../api/post/read.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";
import { showAlert } from "../../../app.js";
import { API_LISTINGS } from "../../api/constants.js";
import { calculateTimeLeft } from "../../ui/utilities/timeEnds.js";

/**
 * Hovedfunksjon: Henter listing-ID fra URL, laster data og viser i DOM.
 */
export default async function initListingDetail() {
  const listingId = new URLSearchParams(window.location.search).get("id");
  if (!listingId) {
    console.error("❌ No listing ID found in URL!");
    return;
  }

  try {
    const listing = await fetchSingleListing(listingId);
    renderListingDetail(listing);
  } catch (error) {
    console.error("❌ Could not fetch listing details:", error);
    document.getElementById("category-listings").innerHTML = 
      `<p class="text-red-500 text-center">Failed to load listing details. Please try again later.</p>`;
  }
}

/**
 * Detailed info on the listing in DOM
 */
function renderListingDetail(listing) {
  const container = document.getElementById("category-listings");
  if (!container) return console.error("❌ Container for listing detail not found!");

  const titleElement = document.getElementById("category-title");
  if (titleElement) titleElement.textContent = listing.title || "Untitled";

  const currentHighestBid = listing.bids?.length 
    ? Math.max(...listing.bids.map(bid => Number(bid.amount))) 
    : 0;

  const timeLeft = calculateTimeLeft(listing.endsAt);

  container.innerHTML = `
    <div class="bg-white p-6 shadow-md rounded flex flex-col md:flex-row gap-6">
      <div class="flex-1 flex items-center justify-center">
        <img src="${listing.media?.[0]?.url || "/src/assets/icons/v-black.png"}"
             alt="${listing.title}" class="max-w-[500px] max-h-[400px] w-auto h-auto rounded object-cover" />
      </div>
      <div class="flex-1 flex flex-col justify-center gap-4">
        <h2 class="text-3xl font-bold font-[crimson]">${listing.title}</h2>
        <p class="text-gray-600">${listing.description || "No description available."}</p>
        <p class="text-gray-700 font-medium">Seller: ${listing.seller?.name || "Unknown"}</p>
        <p class="text-gray-700 font-medium">Bids so far: <span id="bidCount">${listing.bids?.length || 0}</span></p>
        <p class="text-customBlue font-semibold mt-2">
          Highest Bid: <span id="currentHighestBid">${currentHighestBid} credits</span> | 
          <span class="text-gray-600 font-medium">${timeLeft}</span>
        </p>
        <div class="mt-4 flex flex-col gap-4">
          <button id="placeBidBtn" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-700">Place Bid</button>
        </div>
        <form id="bidForm" class="mt-4 hidden flex flex-col gap-2">
          <label for="bidAmount" class="text-gray-700 font-medium">Your Bid:</label>
          <input type="number" id="bidAmount" class="border border-gray-300 p-2 rounded" placeholder="Enter your bid in credits" min="1" />
          <button type="submit" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-700">Submit Bid</button>
        </form>
      </div>
    </div>
  `;

  addBidEventListeners(listing.id, currentHighestBid);
}


/**
 * Event listener to handle bid
 */
function addBidEventListeners(listingId, currentHighestBid) {
  document.getElementById("placeBidBtn").addEventListener("click", () => {
    document.getElementById("bidForm").classList.toggle("hidden");
  });

  document.getElementById("bidForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const bidAmount = Number(document.getElementById("bidAmount").value);
    const highestBid = Number(currentHighestBid); // Sikrer at det er et tall

    // 🔍 Sjekk at budet er en gyldig verdi
    if (isNaN(bidAmount) || bidAmount <= 0 || bidAmount <= highestBid) {
      return showAlert(
        `Your bid must be higher than the current highest bid (${highestBid} credits).`,
        "Invalid Bid",
        "error"
      );
    }

    try {
      await handleBid(listingId, bidAmount);
      await initListingDetail(); // Oppdaterer siden etter et vellykket bud
    } catch (error) {
      let errorMessage = "An error occurred while placing your bid. Please try again.";
      if (error.errors && Array.isArray(error.errors)) {
        errorMessage = error.errors[0]?.message || errorMessage;
      }

      showAlert("Bid Error", errorMessage, "error");
    }
  });
}


/**
 * Handling send in on bids
 */
async function handleBid(listingId, bidAmount) {
  const email = localStorage.getItem("email");
  if (!email) {
    return showAlert("Login Required", "You must be logged in to place a bid.", "error");
  }

  const creditsKey = `credits_${email}`;
  const userCredits = Number(localStorage.getItem(creditsKey)) || 0;

  if (bidAmount > userCredits) {
    return showAlert("Insufficient Credits", `Not enough credits! You only have ${userCredits} credits.`, "error");
  }

  try {
    const response = await apiRequest(`${API_LISTINGS}/${listingId}/bids`, "POST", { amount: bidAmount }, true);

    // 👀 Logg hele API-responsen

    localStorage.setItem(creditsKey, userCredits - bidAmount);
    showAlert(`Your bid of ${bidAmount} credits has been placed successfully.`, "success");
  } catch (error) {
    console.error("❌ API Bid Error:", error);

    if (error.errors && Array.isArray(error.errors)) {
      // 👀 Logg feilmeldingene fra API-et

      const firstError = error.errors[0]?.message || "An unknown error occurred.";

      if (firstError.includes("Your bid must be higher than the current bid")) {
        
      }

      return showAlert("Bid Error", firstError, "error");
    }

    // Fallback error message
    showAlert("Bid Error", "An unexpected error occurred. Please try again.", "error");
  }
}


/**
 * Fetches and shows bids for listing
 */
async function showBids(listingId) {
  const bidsContainer = document.getElementById("bids-container");
  if (!bidsContainer) return;

  try {
    const bids = await apiRequest(`/auction/listings/${listingId}/bids`, "GET", null, true);
    bidsContainer.innerHTML = bids.length 
      ? `<h3 class="text-lg font-semibold mt-4">Bids</h3>
         <ul class="mt-2 border-t pt-2 space-y-2">
           ${bids.sort((a, b) => b.amount - a.amount)
                 .map(bid => `<li class="flex justify-between text-gray-700"><span>${bid.bidderName}</span><span class="font-semibold">${bid.amount} credits</span></li>`)
                 .join("")}
         </ul>`
      : "<p class='text-gray-500'>No bids have been placed yet.</p>";
  } catch (error) {
    console.error("❌ Error fetching bids:", error);
  }
}

/**
 * Event listener on the view bids btn
 */
document.addEventListener("DOMContentLoaded", () => {
  const viewBidsBtn = document.getElementById("viewBidsBtn");
  const listingId = new URLSearchParams(window.location.search).get("id");
  if (viewBidsBtn && listingId) {
    viewBidsBtn.addEventListener("click", () => showBids(listingId));
  }
});
