import { API_KEY } from "../../api/constants.js";

/**
 * En felles funksjon for alle API-kall.
 * @param {string} endpoint - API-endepunktet (f.eks. `/auth/login`).
 * @param {string} method - HTTP-metoden (GET, POST, PUT, DELETE).
 * @param {Object} [body] - Data som skal sendes med (valgfritt).
 * @param {boolean} [requiresAuth=false] - Om forespørselen krever autorisasjon.
 * @returns {Promise<Object|null>} - JSON-responsen fra API-et eller null for DELETE.
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

    // 🔥 Sjekk om responsen har innhold før du forsøker å parse JSON
    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json();
    }

    return null; // Returner null hvis DELETE-responsen er tom
  } catch (error) {
    console.error("❌ API Request Error:", error);
    throw error;
  }
}
