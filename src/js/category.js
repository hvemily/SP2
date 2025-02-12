import { fetchListings } from "../../src/js/api/post/read";

const placeholderImage = "/src/assets/icons/v-black.png";
const categoryListingsContainer = document.getElementById("category-listings");
const categoryTitle = document.getElementById("category-title");

// 🚀 Hent kategori fra URL
function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get("category") || "All";
}

// 🚀 Hent og vis annonser basert på kategori
async function renderCategoryListings() {
  console.log("Fetching listings for category...");
  const category = getCategoryFromURL();
  categoryTitle.textContent = `Showing results for: ${category}`;

  const allListings = await fetchListings();
  console.log("Listings received:", allListings); // Se om du faktisk får data

  const filteredListings = allListings.filter(listing =>
      listing.tags?.some(tag => tag.toLowerCase() === category.toLowerCase())
  );

  if (filteredListings.length === 0) {
      categoryListingsContainer.innerHTML = "<p class='text-gray-500 text-center'>No listings available in this category.</p>";
      return;
  }

  categoryListingsContainer.innerHTML = filteredListings
      .map(listing => createListingCard(listing))
      .join("");

  highlightActiveCategory(category);
}


// 🚀 Funksjon for å lage kortene
function createListingCard(listing) {
    const highestBid = listing.bids?.length
        ? `${Math.max(...listing.bids.map(bid => bid.amount))} ${Math.max(...listing.bids.map(bid => bid.amount)) === 1 ? "credit" : "credits"}`
        : "No bids yet";

    const imageSrc = listing.media?.[0]?.url || listing.media?.[0] || placeholderImage;
    const isPlaceholder = imageSrc === placeholderImage;
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
                    <p class="text-gray-500 text-sm flex-grow">${listing.description ? listing.description.substring(0, 50) + '...' : "No description available."}</p>
                    <p class="text-gray-700 font-medium mt-2">Seller: ${listing.seller?.name || listing.seller?.username || "Unknown Seller"}</p>
                    <p class="text-customBlue font-semibold mt-2">Current Bid: ${highestBid}</p>
                    <button onclick="handleMakeOffer('${listing.id}')" class="text-black px-4 py-2 hover:bg-black hover:text-white font-medium mt-2 border">
                        Make Offer
                    </button>
                </div>
            </div>
        </a>
    `;
}

// 🚀 Marker aktiv kategori i navbaren
function highlightActiveCategory(category) {
    document.querySelectorAll(".category-link").forEach(link => {
        link.classList.remove("font-bold");
        if (link.href.includes(`category=${category}`)) {
            link.classList.add("font-bold");
        }
    });
}

// 🚀 Håndter bud-knapp klikk
function handleMakeOffer(listingId) {
    const isLoggedIn = !!localStorage.getItem("token");

    if (isLoggedIn) {
        window.location.href = `/bid.html?id=${listingId}`;
    } else {
        window.location.href = "/login.html";
    }
}

// 🚀 Kjør funksjonen når siden laster
document.addEventListener("DOMContentLoaded", renderCategoryListings);
