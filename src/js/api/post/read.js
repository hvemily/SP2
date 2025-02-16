import { API_LISTINGS } from "../constants.js";

export async function fetchListings(limit = 8, page = 1) {
    console.log(`🚀 Fetching listings: limit=${limit}, page=${page}`);

    if (!API_LISTINGS) {
        console.error("❌ API_LISTINGS is undefined! Check your environment variables or API configuration.");
        return [];
    }

    try {
        const response = await fetch(
            `${API_LISTINGS}?_sort=created&_order=desc&_seller=true&_bids=true&_page=${page}&_limit=${limit}`
        );

        console.log("🔄 Response received:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("📦 Full API response:", responseData);

        if (Array.isArray(responseData.data)) {
            // 🚨 Manuell sortering i tilfelle API-et ikke returnerer riktig
            return responseData.data.sort((a, b) => new Date(b.created) - new Date(a.created));
        } else {
            console.error("❌ Unexpected API response format:", responseData);
            return [];
        }
    } catch (error) {
        console.error("❌ Error fetching listings:", error);
        return [];
    }
}


// 🚀 Hent annonser med de høyeste budene (Featured Bids)
export async function fetchFeaturedBids(limit = 4) {
    try {
        const response = await fetch(
            `${API_LISTINGS}?_seller=true&_bids=true&_active=true&_limit=50`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        const allListings = json.data || [];

        // Filtrer annonser med bud og sorter etter høyeste bud
        const sortedByHighestBid = allListings
            .filter(listing => listing.bids?.length > 0)
            .sort((a, b) => {
                const maxBidA = Math.max(...a.bids.map(bid => bid.amount), 0);
                const maxBidB = Math.max(...b.bids.map(bid => bid.amount), 0);
                return maxBidB - maxBidA;
            });

        return sortedByHighestBid.slice(0, limit); // Returner kun de X høyeste
    } catch (error) {
        console.error("Error fetching featured bids:", error);
        return [];
    }
}
