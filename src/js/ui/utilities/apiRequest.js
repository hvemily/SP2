import { API_KEY } from "../../api/constants.js";

/**
 * Joint function for all API call
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE).
 * @param {Object} [body] - Data to send with
 * @param {boolean} [requiresAuth=false] - If the request require authorization
 * @returns {Promise<Object|null>} - JSON response from API or null for DELETE.
 */
export async function apiRequest(endpoint, method = "GET", body = null, requiresAuth = false) {
  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };

  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config = { method, headers };
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    console.log(`🚀 API Request: ${method} ${endpoint}`);
    const response = await fetch(endpoint, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return null; // Returns null if DELETE response is empty
  } catch (error) {
    console.error("❌ API Request Error:", error);
    throw error;
  }
}
