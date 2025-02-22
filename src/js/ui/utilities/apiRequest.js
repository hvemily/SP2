import { API_KEY } from "../../api/constants";


/**
 * Felles funksjon for alle API-kall
 * @param {string} endpoint - API-endepunkt
 * @param {string} method - HTTP-metode (GET, POST, PUT, DELETE).
 * @param {Object} [body] - Data som skal sendes med
 * @param {boolean} [requiresAuth=false] - Om forespørselen krever autorisasjon
 * @returns {Promise<Object>} - JSON-respons fra API-et
 * @throws {Object} - JSON-feilobjekt fra API-et ved feil
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
    const response = await fetch(endpoint, config);

    const contentType = response.headers.get("Content-Type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      throw data || { status: response.status, message: response.statusText };
    }

    return data;
  } catch (error) {
    console.error("❌ API Request Error:", error);
    throw error;
  }
}
