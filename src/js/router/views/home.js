import { fetchListings } from "../../api/post/read";
import { fetchFeaturedBids } from "../../api/post/read";

const placeholderImage = "/src/assets/icons/v-black.png"; // Definer placeholder-bildet her
const searchInput = document.getElementById("searchInput");
let allListings = [];

async function renderListings(listingsData = null) {
    const listingsContainer = document.getElementById("auction-listings");

    if (!listingsContainer) {
        console.error("No container found for listings!");
        return;
    }

    // Hvis ingen spesifikk liste er gitt, hent fra API og lagre i allListings
    if (!listingsData) {
        allListings = await fetchListings(); // Lagrer alle oppføringer for søk
        listingsData = allListings; // Bruk de hentede dataene
    }

    if (listingsData.length === 0) {
        listingsContainer.innerHTML = "<p class='text-gray-500 text-center'>No listings available.</p>";
        return;
    }

    listingsContainer.innerHTML = listingsData
        .map(listing => {
            console.log("Bids Data:", listing.bids);
            console.log("Seller Data:", listing.seller);

            // Hent høyeste bud
            const highestBid = listing.bids && listing.bids.length > 0 
            ? `${Math.max(...listing.bids.map(bid => bid.amount))} ${Math.max(...listing.bids.map(bid => bid.amount)) === 1 ? "credit" : "credits"}` 
            : "No bids yet";

            // Hent selgerens navn
            const sellerName = listing.seller?.name || listing.seller?.username || "Unknown Seller";

            // Beregn tid igjen på auksjonen
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

            // Sett riktig bilde
            const imageSrc = listing.media?.[0]?.url || listing.media?.[0] || placeholderImage;
            const isPlaceholder = imageSrc === placeholderImage; 
            const imageClass = isPlaceholder ? "w-[50%] h-auto object-contain" : "w-full h-full object-cover";

            return `
                <a href="/listing/index.html?id=${listing.id}" class="block">
                    <div class="bg-white border border-gray-300 overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105 flex flex-col h-full">
                        
                        <div class="p-4"> 
                            <div class="w-full h-64 flex items-center justify-center overflow-hidden">
                                <img src="${imageSrc}"
                                    alt="${listing.title}" 
                                    class="${imageClass}">
                            </div>
                        </div>

                        <div class="p-4 flex flex-col flex-grow">
                            <h3 class="text-lg font-medium ">${listing.title}</h3>
                            <p class="text-gray-500 text-sm flex-grow ">${listing.description ? listing.description.substring(0, 50) + '...' : "No description available."}</p>
                            
                            <p class="text-gray-700 font-medium mt-2">
                                Seller: ${sellerName}
                            </p>

                            <p class="text-customBlue font-semibold mt-2">
                                Current Bid: ${highestBid} | <span class="text-gray-600 font-medium">${timeLeftString}</span>
                            </p>

                            <button onclick="handleMakeOffer('${listing.id}')" 
                                    class="text-black px-4 py-2 hover:bg-black hover:text-white font-medium mt-2 border">
                                Make Offer
                            </button>
                        </div>
                    </div>
                </a>
            `;
        })
        .join("");
}



function handleMakeOffer(listingId) {
    const isLoggedIn = !!localStorage.getItem("token");

    if (isLoggedIn) {
        window.location.href = `/bid.html?id=${listingId}`;
    } else {
        window.location.href = "/login.html";
    }
}


async function renderFeaturedBids() {
    const featuredContainer = document.getElementById("featured-auctions");

    if (!featuredContainer) {
        console.error("No container found for featured bids!");
        return;
    }

    const featuredListings = await fetchFeaturedBids();

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

            // Hent riktig bilde (samme logikk som i renderListings)
            const imageSrc = listing.media?.[0]?.url || listing.media?.[0] || placeholderImage;
            const isPlaceholder = imageSrc === placeholderImage;
            const imageClass = isPlaceholder ? "w-[50%] h-auto object-contain" : "w-full h-full object-cover";

            return `
                <a href="/listing/index.html?id=${listing.id}" class="block">
                    <div class="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105 flex flex-col h-full">
                        
                        <div class="p-4"> 
                            <div class="w-full h-64 flex items-center justify-center overflow-hidden">
                                <img src="${imageSrc}"
                                    alt="${listing.title}" 
                                    class="${imageClass}">
                            </div>
                        </div>

                        <div class="p-4 flex flex-col flex-grow">
                            <h3 class="text-lg font-medium">${listing.title}</h3>
                            <p class="text-gray-500 text-sm flex-grow">${listing.description ? listing.description.substring(0, 50) + '...' : "No description available."}</p>
                            
                            <p class="text-customBlue font-semibold mt-2">
                                Current Bid: ${highestBid}
                            </p>

                            <button onclick="handleMakeOffer('${listing.id}')" 
                                class="text-black px-4 py-2 hover:bg-black hover:text-white font-medium mt-2 border">
                                    Make Offer
                            </button>
                        </div>
                    </div>
                </a>
            `;
        })
        .join("");
}

async function handleSearch(event) {
    const query = searchInput.value.toLowerCase().trim();

    if (event.type === "input" || (event.type === "keydown" && event.key === "Enter")) {
        if (query === "") {
            renderListings(allListings); // Tilbakestill til alle lister
        } else {
            // 🔹 Søk først kun i titler
            let filteredListings = allListings.filter(listing =>
                listing.title.toLowerCase().includes(query)
            );

            // 🔥 Hvis færre enn 8 treff på titler, legg til treff fra tags
            if (filteredListings.length < 8) {
                const tagMatches = allListings.filter(listing =>
                    listing.tags && listing.tags.some(tag => tag.toLowerCase().includes(query))
                );

                // Unngå duplikater ved å bruke et Set
                filteredListings = [...new Set([...filteredListings, ...tagMatches])];
            }

            // 🔥 Hvis fortsatt færre enn 8, hent flere fra API-et
            if (filteredListings.length < 8) {
                const additionalListings = await fetchListings(20); // Henter 20 ekstra fra API
                const moreFiltered = additionalListings.filter(listing =>
                    listing.title.toLowerCase().includes(query) ||
                    (listing.tags && listing.tags.some(tag => tag.toLowerCase().includes(query)))
                );

                // Legg til flere treff, men ikke duplikater
                filteredListings = [...new Set([...filteredListings, ...moreFiltered])].slice(0, 8);
            }

            renderListings(filteredListings);
        }
    }
}

// Legg til event listeners for input + enter
searchInput.addEventListener("input", handleSearch);
searchInput.addEventListener("keydown", handleSearch);



document.addEventListener("DOMContentLoaded", async () => {
    console.log("Fetching fresh listings...");
    await renderListings();
    await renderFeaturedBids();
  });
