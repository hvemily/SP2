import { API_BASE, API_KEY } from "../constants.js";

/**
 * Updates the user's profile information.
 * @param {Object} profileData - The profile data to update.
 * @returns {Promise<Object>} - The updated profile data.
 */
export async function updateProfile(profileData) {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("name"); // Henter brukernavnet

  if (!token || !username) {
    throw new Error("No authentication token or username found.");
  }

  try {
    const response = await fetch(`${API_BASE}/auction/profiles/${username}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "X-Noroff-API-Key": API_KEY, // 🔥 API-nøkkel må være med
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to update profile: ${response.status} - ${errorText}`);
    }

    const updatedProfile = await response.json();
    console.log("✅ Profile updated:", updatedProfile);
    return updatedProfile;
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw error;
  }
}
