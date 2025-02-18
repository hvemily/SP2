import { API_BASE, API_KEY } from "../constants.js"; // 🔹 Importer API_KEY

/**
 * Deletes a listing by ID.
 * @param {string} listingId - The ID of the listing to delete.
 * @returns {Promise<void>}
 */
export async function deleteListing(listingId) {
  const token = localStorage.getItem("token");

  console.log("🔑 Token used for delete request:", token); // 🔥 Debugging

  if (!token) {
    throw new Error("No authentication token found.");
  }

  try {
    const response = await fetch(`${API_BASE}/auction/listings/${listingId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY, // 🔥 Legger til API-nøkkel
        "Content-Type": "application/json",
      },
    });

    console.log("🔄 Response status:", response.status); // 🔍 Debug status

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to delete listing: ${response.status} - ${errorText}`);
    }

    console.log(`✅ Listing ${listingId} deleted successfully.`);
  } catch (error) {
    console.error("❌ Error deleting listing:", error);
    throw error;
  }
}
