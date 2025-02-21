import { API_BASE } from "../constants.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";

/**
 * Updates listing with the chosen post-ID and data
 * @param {string} postId - Id for the post to update
 * @param {Object} updatedData - Updated datas for the post
 * @returns {Promise<Object>} - The updated post
 */
export async function updatePost(postId, updatedData) {
  return apiRequest(`${API_BASE}/auction/listings/${postId}`, "PUT", updatedData, true);
}
