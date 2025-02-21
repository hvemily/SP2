import { API_LISTINGS, API_BASE } from "../constants.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";

/**
 * Henter listings med paginering.
 * @param {number} limit - Antall listings per side.
 * @param {number} page - Hvilken side som skal hentes.
 * @returns {Promise<Array>} - Liste over listings.
 */


export async function fetchListings(limit = 8, page = 1) {
  const response = await apiRequest(
      `${API_BASE}/auction/listings?sort=created&_order=desc&_seller=true&_bids=true&active=true&_page=${page}&_limit=${limit}`,
      "GET"
  );

  console.log("✅ API Response:", response);

  return response.data || [];  // <-- Sørg for at den returnerer en array
}



/**
 * Henter de annonser med de høyeste budene.
 * @param {number} limit - Antall annonser som skal returneres.
 * @returns {Promise<Array>} - Liste over de høyeste budene.
 */
export async function fetchFeaturedBids(limit = 4) {
  try {
    const responseData = await apiRequest(
      `${API_LISTINGS}?_seller=true&_bids=true&_active=true&_limit=50`
    );

    const allListings = responseData.data || [];

    return allListings
      .filter((listing) => listing.bids?.length > 0)
      .sort(
        (a, b) =>
          Math.max(...b.bids.map((bid) => bid.amount), 0) -
          Math.max(...a.bids.map((bid) => bid.amount), 0)
      )
      .slice(0, limit);
  } catch (error) {
    console.error("❌ Error fetching featured bids:", error);
    return [];
  }
}

/**
 * Henter data for én spesifikk listing basert på ID.
 * @param {string} id - ID-en til listing.
 * @returns {Promise<Object>} - Data for den aktuelle listing-en.
 */
export async function fetchSingleListing(id) {
  try {
    const responseData = await apiRequest(
      `${API_LISTINGS}/${id}?_bids=true&_seller=true`
    );
    return responseData.data;
  } catch (error) {
    console.error("❌ fetchSingleListing error:", error);
    throw error;
  }
}
