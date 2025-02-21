import { API_LISTINGS } from "../constants.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";

/**
 * Sletter en listing basert på ID.
 * @param {string} listingId - ID-en til listing som skal slettes.
 * @returns {Promise<Object>} - API-responsen.
 */
export async function deleteListing(listingId) {
  return apiRequest(`${API_LISTINGS}/${listingId}`, "DELETE", null, true);
}
