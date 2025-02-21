import { API_KEY } from "../../api/constants.js";

/**
 * En felles funksjon for API-kall.
 * @param {string} endpoint - API-endepunktet.
 * @param {string} method - HTTP-metoden (GET, POST, PUT, DELETE).
 * @param {Object} [body=null] - Request body (valgfritt).
 * @param {boolean} [requiresAuth=false] - Om forespørselen krever autorisasjon.
 * @returns {Promise<Object|null>} - JSON-responsen eller null hvis tom respons.
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
  
      // ✅ Håndterer 204 No Content
      if (response.status === 204) {
        return { success: true, status: response.status };
      }
  
      const responseData = await response.json();
  
      if (!response.ok) {
        throw new Error(responseData.errors?.[0]?.message || response.statusText);
      }
  
      return responseData;
    } catch (error) {
      console.error("❌ API Request Error:", error);
      throw error;
    }
  }
  
