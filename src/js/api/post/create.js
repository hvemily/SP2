import { API_LISTINGS } from "../constants.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";

/**
 * Creating a new listing by sending a POST-req to the API.
 * @param {Object} listingData - Data for the new listing
 * @returns {Promise<Object>} - The created listing from the API
 */
export async function createListing(listingData) {
  return apiRequest(API_LISTINGS, "POST", listingData, true);
}
