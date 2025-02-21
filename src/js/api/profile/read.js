import { API_BASE } from "../constants.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";

/**
 * Fetches the user's profile data using the username stored in localStorage.
 * @returns {Promise<Object>} The profile data.
 * @throws {Error} Throws an error if the request fails.
 */
export async function fetchProfile() {
  const username = localStorage.getItem("name"); 
  if (!username) throw new Error("No username found in localStorage.");

  console.log("📡 Fetching profile for:", username);
  
  return apiRequest(`${API_BASE}/auction/profiles/${username}?_listings=true`, "GET", null, true);
}
