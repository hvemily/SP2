import { API_LISTINGS } from "../constants.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";

/**
 * Oppretter en ny listing ved å sende en POST-request til API-et.
 * @param {Object} listingData - Dataene for den nye listing-en.
 * @returns {Promise<Object>} - Den opprettede listing-en fra API-et.
 */
export async function createListing(listingData) {
  return apiRequest(API_LISTINGS, "POST", listingData, true);
}
