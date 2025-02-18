import { API_KEY } from "./constants";

/**
 * Generates headers for API requests.
 * 
 * @returns {Headers} A Headers object with the appropriate API key and authorization token (if available).
 */
export function headers() {
  const headers = new Headers();

  // Include API key if available
  if (API_KEY) {
    headers.append("X-Noroff-API-Key", API_KEY);
  }

  // Include authorization token if available
  const token = localStorage.getItem("token");
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  headers.append("Content-Type", "application/json");
  
  return headers;
}
