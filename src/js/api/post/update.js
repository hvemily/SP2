import { API_BASE } from "../constants.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";

/**
 * Oppdaterer en listing med den angitte post-ID og data.
 * @param {string} postId - ID-en til posten som skal oppdateres.
 * @param {Object} updatedData - De oppdaterte dataene for posten.
 * @returns {Promise<Object>} - Den oppdaterte posten.
 */
export async function updatePost(postId, updatedData) {
  return apiRequest(`${API_BASE}/auction/listings/${postId}`, "PUT", updatedData, true);
}
