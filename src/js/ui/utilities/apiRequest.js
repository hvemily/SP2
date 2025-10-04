// apiRequest.js
import { API_KEY, API_BASE } from "../../api/constants";

/**
 * Felles funksjon for alle API-kall
 */
export async function apiRequest(endpoint, method = "GET", body = null, requiresAuth = false) {
  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY,
  };

  if (requiresAuth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  // ⬇️ Make absolute URL
  const url =
    /^https?:\/\//i.test(endpoint)
      ? endpoint
      : `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get("Content-Type") || "";
    const isJson = contentType.includes("application/json");
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
