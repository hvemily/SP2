import { API_BASE } from "../constants.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";

/**
 * Updates the user's profile information.
 * @param {Object} profileData - The profile data to update.
 * @returns {Promise<Object>} - The updated profile data.
 */
export async function updateProfile(profileData) {
  const username = localStorage.getItem("name");
  if (!username) throw new Error("No username found in localStorage.");

  return apiRequest(`${API_BASE}/auction/profiles/${username}`, "PUT", profileData, true);
}
