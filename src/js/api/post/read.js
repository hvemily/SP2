import { API_LISTINGS, API_BASE } from "../constants.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";

/**
 * Fetching listing with pagination
 * @param {number} limit - Number of listings per page
 * @param {number} page - Which page to be fetched
 * @returns {Promise<Array>} - List of listings. 
 */


export async function fetchListings(limit = 8, page = 1) {
  const response = await apiRequest(
      `${API_BASE}/auction/listings?sort=created&_order=desc&_seller=true&_bids=true&active=true&_page=${page}&_limit=${limit}`,
      "GET"
  );

  console.log("✅ API Response:", response);

  return response.data || [];  
}



/**
 * Fetch listings with highest bids
 * @param {number} limit - Number of listings to return
 * @returns {Promise<Array>} - List over highest bids
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
 * Fetching data for a specifiv listing based on ID
 * @param {string} id - ID of the listing.
 * @returns {Promise<Object>} - Data for the chosen listing
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
