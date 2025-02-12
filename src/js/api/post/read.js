const API_BASE_URL = "https://v2.api.noroff.dev/auction/listings";

export async function fetchListings(limit = 8, page = 1) {
    try {
        const response = await fetch(`${API_BASE_URL}?_seller=true&_bids=true&_active=true&_page=${page}&limit=${limit}&_sort=created&_order=desc`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        console.log("Fetched Listings Data:", json);
        console.log("Meta Data:", json.meta); // ✅ Sjekk om API-et faktisk respekterer `_limit`

        return json.data || [];
    } catch (error) {
        console.error("Error fetching listings:", error);
        return [];
    }
}

export async function fetchFeaturedBids(limit = 4) {
    try {
        const response = await fetch(
            `https://v2.api.noroff.dev/auction/listings?_seller=true&_bids=true&_active=true&limit=50`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const json = await response.json();
        const allListings = json.data || [];

        // Filtrer kun de med bud og sorter etter høyeste bud
        const sortedByHighestBid = allListings
            .filter(listing => listing.bids && listing.bids.length > 0)
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


