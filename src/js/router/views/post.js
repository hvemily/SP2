import { fetchSingleListing } from "../../api/post/read.js";
import { API_KEY, API_LISTINGS, API_BASE } from "../../api/constants.js";
import { showConfirmationModal } from "../../ui/global/confirmationModal.js";
import { showAlert } from "../../../app.js";
/**
 * Hovedfunksjon som henter 'id' fra URL, laster data og viser i DOM.
 * Eksporteres som default slik at routeren kan kalle module.default().
 */
export default async function initListingDetail() {
  const params = new URLSearchParams(window.location.search);
  const listingId = params.get("id");

  if (!listingId) {
    console.error("❌ No listing ID found in URL!");
    return;
  }

  try {
    await loadAndRenderListing(listingId);
  } catch (error) {
    console.error("❌ Could not fetch listing details:", error);
    const container = document.getElementById("category-listings");
    if (container) {
      container.innerHTML = `<p class="text-red-500 text-center">Failed to load listing details. Please try again later.</p>`;
    }
  }
}

/**
 * Henter data for en enkelt listing fra API-et, og kaller renderListingDetail for å vise den.
 * @param {string} listingId 
 */
async function loadAndRenderListing(listingId) {
  const listing = await fetchSingleListing(listingId);
  console.log("🔎 Single listing detail:", listing);
  renderListingDetail(listing);
}

/**
 * Viser detaljert informasjon om en listing i DOM-en.
 * @param {Object} listing - Data for en enkelt post.
 */
function renderListingDetail(listing) {
  const container = document.getElementById("category-listings");
  if (!container) {
    console.error("❌ Container for listing detail not found!");
    return;
  }

  // Oppdater sidetittel (hvis elementet finnes)
  const titleElement = document.getElementById("category-title");
  if (titleElement) {
    titleElement.textContent = listing.title || "Untitled";
  }

  // Beregn det høyeste budet
  const highestBidAmount =
    listing.bids && listing.bids.length > 0
      ? Math.max(...listing.bids.map(bid => bid.amount))
      : 0;
  const highestBidText = highestBidAmount > 0
    ? `${highestBidAmount} credit${highestBidAmount === 1 ? "" : "s"}`
    : "No bids yet";

  // Beregn tid igjen for auksjonen
  const endsAt = new Date(listing.endsAt);
  const now = new Date();
  let timeLeftString = "Expired";
  const timeLeft = endsAt - now;
  if (timeLeft > 0) {
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    timeLeftString = `${days}d ${hours}h ${minutes}m left`;
  }

  container.innerHTML = `
    <div class="bg-white p-6 shadow-md rounded flex flex-col md:flex-row gap-6">
      <!-- Bilde-seksjon -->
<div class="flex-1 flex items-center justify-center">
  ${
    listing.media && listing.media.length > 0
      ? `<img src="${listing.media[0].url || listing.media[0]}" alt="${listing.title}" class="max-w-[500px] max-h-[400px] w-auto h-auto rounded object-cover" />`
      : `<img src="/src/assets/icons/v-black.png" alt="Placeholder" class="max-w-[300px] max-h-[250px] w-auto h-auto object-cover" />`
  }
</div>


      <!-- Info-seksjon -->
      <div class="flex-1 flex flex-col justify-center gap-4">
        <h2 class="text-3xl font-bold font-[crimson]">${listing.title}</h2>
        <p class="text-gray-600">${listing.description || "No description available."}</p>
        <p class="text-gray-700 font-medium">Seller: ${listing.seller?.name || "Unknown"}</p>
        <p class="text-gray-700 font-medium">
          Bids so far: <span id="bidCount">${listing.bids ? listing.bids.length : 0}</span>
        </p>
        <p class="text-customBlue font-semibold mt-2">
          Highest Bid: <span id="currentHighestBid">${highestBidText}</span> | 
          <span class="text-gray-600 font-medium">${timeLeftString}</span>
        </p>
        
        <!-- Knapper/handlinger -->
        <div class="mt-4 flex flex-col gap-4">
          <button id="placeBidBtn" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-700">
            Place Bid
          </button>
        </div>
        
        <!-- Skjema for å by -->
        <form id="bidForm" class="mt-4 hidden flex flex-col gap-2">
          <label for="bidAmount" class="text-gray-700 font-medium">Your Bid:</label>
          <input
            type="number"
            id="bidAmount"
            class="border border-gray-300 p-2 rounded"
            placeholder="Enter your bid in credits"
            min="1"
          />
          <button type="submit" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-700">
            Submit Bid
          </button>
        </form>
      </div>
    </div>
  `;

  // Legg til event listeners
  const placeBidBtn = document.getElementById("placeBidBtn");
  const bidForm = document.getElementById("bidForm");
  
  placeBidBtn.addEventListener("click", () => {
    bidForm.classList.toggle("hidden");
  });

  // Håndter innsending av bud
  bidForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const bidAmount = Number(document.getElementById("bidAmount").value);
  
    if (isNaN(bidAmount) || bidAmount <= 0) {
      showAlert("Invalid bid", "Please enter a valid bid amount.");
      return;
    }
  
    try {
      await handleBid(listing.id, bidAmount);
      // Etter et vellykket bud, re-fetch listing-detaljene for å oppdatere UI
      await loadAndRenderListing(listing.id);
    } catch (error) {
      console.error("❌ Failed to place bid:", error);
      showAlert("An error occurred while placing your bid. Please try again.");
    }
  });
}  


/**
 * Håndterer innsending av bud: sjekker kreditter, sender bud til API og oppdaterer kreditter lokalt.
 * @param {string} listingId 
 * @param {number} bidAmount 
 */
async function handleBid(listingId, bidAmount) {
  const email = localStorage.getItem("email");
  if (!email) {
    showAlert("Login Required", "You must be logged in to place a bid.", "error");
    return;
  }

  const creditsKey = `credits_${email}`;
  let userCredits = Number(localStorage.getItem(creditsKey));
  if (isNaN(userCredits)) {
    userCredits = 0;
  }

  if (bidAmount > userCredits) {
    showAlert("Insufficient Credits", `Not enough credits! You only have ${userCredits} credits.`, "error");
    return;
  }

  try {
    const response = await fetch(`${API_LISTINGS}/${listingId}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "X-Noroff-API-Key": API_KEY
      },
      body: JSON.stringify({ amount: bidAmount }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("🚨 Bid error response:", errorData);

      // Forsøk å hente en meningsfull feilmelding fra API-et
      let errorMsg = "Failed to place bid.";
      if (errorData?.errors?.length > 0) {
        errorMsg = errorData.errors.map(err => err.message).join("\n");
      } else if (errorData?.message) {
        errorMsg = errorData.message;
      } else if (response.status === 400) {
        errorMsg = "Bid amount is too low. Please place a higher bid.";
      }

      throw new Error(`Status: ${response.status} - ${errorMsg}`);
    }

    // Oppdater brukerens credits lokalt
    userCredits -= bidAmount;
    localStorage.setItem(creditsKey, userCredits);

    showAlert("Bid Placed!", `Your bid of ${bidAmount} credits has been placed successfully.`, "success");
  } catch (error) {
    console.error("❌ handleBid error:", error);
    showAlert("Bid Error", `Failed to place bid: ${error.message}`, "error");
  }
}




/**
 * Henter budene for en gitt listing.
 * @param {string} listingId - ID-en til listing-en
 * @returns {Promise<Array>} - En liste med bud
 */
export async function fetchBidsForListing(listingId) {
  try {
    const response = await fetch(`${API_BASE}/auction/listings/${listingId}?_bids=true`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch bids: ${response.statusText}`);
    }

    const data = await response.json();
    return data?.bids ?? []; // Returner budene eller en tom liste
  } catch (error) {
    console.error("❌ Error fetching bids:", error);
    return [];
  }
}


/**
 * Viser budene for en listing.
 * @param {string} listingId - ID-en til listing-en
 */
async function showBids(listingId) {
  const bidsContainer = document.getElementById("bids-container");
  if (!bidsContainer) return;

  // Hent budene fra API-et
  const bids = await fetchBidsForListing(listingId);

  if (bids.length === 0) {
    bidsContainer.innerHTML = "<p class='text-gray-500'>No bids have been placed yet.</p>";
    return;
  }

  // Sorter budene fra høyeste til laveste
  bids.sort((a, b) => b.amount - a.amount);

  // Generer HTML for budene
  bidsContainer.innerHTML = `
    <h3 class="text-lg font-semibold mt-4">Bids</h3>
    <ul class="mt-2 border-t pt-2 space-y-2">
      ${bids
        .map(
          (bid) => `
        <li class="flex justify-between text-gray-700">
          <span>${bid.bidderName}</span>
          <span class="font-semibold">${bid.amount} credits</span>
        </li>
      `
        )
        .join("")}
    </ul>
  `;
}

/**
 * Legger til event-listener på "View Bids"-knappen.
 */
document.addEventListener("DOMContentLoaded", () => {
  const viewBidsBtn = document.getElementById("viewBidsBtn");
  const listingId = new URLSearchParams(window.location.search).get("id");

  if (viewBidsBtn && listingId) {
    viewBidsBtn.addEventListener("click", () => showBids(listingId));
  }
});