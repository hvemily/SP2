import { API_LISTINGS } from "../constants.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";

/**
 * Deleting listing based on ID
 * @param {string} listingId - Id to the listing for deletion
 * @returns {Promise<Object>} - API-response.
 */
export async function deleteListing(listingId) {
  return apiRequest(`${API_LISTINGS}/${listingId}`, "DELETE", null, true);
}
