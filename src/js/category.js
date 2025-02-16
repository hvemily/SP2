import { fetchListings } from "../../src/js/api/post/read";

const categoryListingsContainer = document.getElementById("category-listings");
const categoryTitle = document.getElementById("category-title");

// 🚀 Hent kategori fra URL
function getCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get("category");
    console.log("🔍 Kategori fra URL:", category);
    return category ? category.toLowerCase() : null;
}

// 🚀 Hent og vis annonser basert på kategori
async function renderCategoryListings() {
    console.log("📡 Henter annonser...");
    const category = getCategoryFromURL();
    if (!category) {
        console.warn("⚠️ Ingen kategori valgt. Viser alle annonser.");
        categoryTitle.textContent = "All Listings";
        return renderAllListings();
    }

    categoryTitle.textContent = `Showing results for: ${category.charAt(0).toUpperCase() + category.slice(1)}`;

    // Hent alle annonser
    const allListings = await fetchListings();
    console.log("✅ Hentede annonser:", allListings);

    // 🚀 Filtrer annonsene basert på kategori (tags)
    const filteredListings = allListings.filter(listing => {
        return listing.tags?.some(tag => tag.toLowerCase() === category);
    });

    console.log(`🎯 Filtrerte annonser for kategori "${category}":`, filteredListings);

    // Hvis ingen annonser matcher kategorien
    if (filteredListings.length === 0) {
        categoryListingsContainer.innerHTML = "<p class='text-gray-500 text-center'>No listings available in this category.</p>";
        return;
    }

    // Gjør klar HTML for filtrerte annonser
    categoryListingsContainer.innerHTML = filteredListings
        .map(listing => createListingCard(listing))
        .join("");
}

// 🚀 Funksjon for å vise alle annonser hvis ingen kategori er valgt
async function renderAllListings() {
    const allListings = await fetchListings();
    categoryListingsContainer.innerHTML = allListings
        .map(listing => createListingCard(listing))
        .join("");
}

// 🚀 Funksjon for å lage kortene
function createListingCard(listing) {
    const highestBid = listing.bids?.length
        ? `${Math.max(...listing.bids.map(bid => bid.amount))} credits`
        : "No bids yet";

    const imageSrc = listing.media?.[0]?.url || listing.media?.[0] || "/src/assets/icons/v-black.png";
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
                    <h3 class="text-lg font-medium">${listing.title}</h3>
                    <p class="text-gray-500 text-sm flex-grow">${listing.description ? listing.description.substring(0, 50) + '...' : "No description available."}</p>
                    <p class="text-gray-700 font-medium mt-2">Seller: ${listing.seller?.name || "Unknown Seller"}</p>
                    <p class="text-customBlue font-semibold mt-2">Current Bid: ${highestBid}</p>
                    <button onclick="handleMakeOffer('${listing.id}')" class="text-black px-4 py-2 hover:bg-black hover:text-white font-medium mt-2 border">
                        Make Offer
                    </button>
                </div>
            </div>
        </a>
    `;
}

// 🚀 Kjør funksjonen når siden laster
document.addEventListener("DOMContentLoaded", renderCategoryListings);
