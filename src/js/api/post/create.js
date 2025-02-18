import { API_BASE, API_KEY } from "../constants.js";

/**
 * Oppretter en ny listing ved å sende en POST-request til API-et.
 * @param {Object} listingData - Dataene for den nye listing-en.
 * @returns {Promise<Object>} - Den opprettede listing-en fra API-et.
 */
export async function createListing(listingData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found.");
  }
  
  try {
    const response = await fetch(`${API_BASE}/auction/listings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY
      },
      body: JSON.stringify(listingData),
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create listing: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("❌ Error creating listing:", error);
    throw error;
  }
}
