// src/js/api/post/update.js
import { API_BASE, API_KEY } from "../constants.js";

/**
 * Oppdaterer en listing med den angitte post-ID og data.
 * @param {string} postId - ID-en til posten som skal oppdateres.
 * @param {Object} updatedData - De oppdaterte dataene for posten.
 * @returns {Promise<Object>} - Den oppdaterte posten.
 */
export async function updatePost(postId, updatedData) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("User not logged in.");
  }
  
  try {
    const response = await fetch(`${API_BASE}/auction/listings/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY,
      },
      body: JSON.stringify(updatedData),
    });
    
    if (!response.ok) {
      throw new Error(`Error updating post: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("❌ updatePost error:", error);
    throw error;
  }
}
