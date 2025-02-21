import { API_KEY } from "./constants.js";

/**
 * Generates headers for API requests.
 * @param {boolean} [requiresAuth=false] - Whether to include Authorization header.
 * @returns {Object} Headers object with API key and optional authorization token.
 */
export function headers(requiresAuth = false) {
  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };

  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}
