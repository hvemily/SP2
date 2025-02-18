import { API_BASE, API_KEY } from "../constants.js";

/**
 * Fetches the user's profile data using the username stored in localStorage.
 * @returns {Promise<Object>} The profile data.
 * @throws {Error} Throws an error if the request fails.
 */
export async function fetchProfile() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("name"); // Henter username fra localStorage

  console.log("🔍 Debugging fetchProfile()");
  console.log("📌 Token:", token);
  console.log("📌 Username:", username);

  if (!token || !username) {
    console.error("❌ No authentication token or username found.");
    throw new Error("No authentication token or username found.");
  }

  console.log("📡 Fetching profile for:", username);

  try {
    const response = await fetch(`${API_BASE}/auction/profiles/${username}?_listings=true`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": API_KEY, // 🔑 Legger til API-nøkkel
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch profile: ${response.status} - ${errorText}`);
    }

    const profileData = await response.json();
    console.log("✅ Profile fetched:", profileData);
    return profileData;
  } catch (error) {
    console.error("❌ Error fetching profile:", error);
    throw error;
  }
}
