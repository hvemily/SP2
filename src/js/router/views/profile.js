import { showAlert } from "../../../app.js";
import { fetchProfile } from "../../api/profile/read.js";
import { updateProfile } from "../../api/profile/update.js"; // <-- Import for oppdatering av profil
import { onDeleteListing } from "../../ui/post/delete.js";
/**
 * Initializes the profile page.
 */
export async function profileInit() {
  console.log("👤 Loading profile...");

  try {
    const profile = await fetchProfile();
    console.log("✅ Profile fetched:", profile);
    renderProfile(profile);
  } catch (error) {
    console.error("❌ Failed to load profile:", error);
  }
}

/**
 * Renders the user's profile details.
 * @param {Object} profileData - The user's profile data.
 */
export function renderProfile(profileData) {
  const container = document.getElementById("profile-container");

  if (!container) {
    console.error("❌ Profile container not found!");
    return;
  }

  // 🔥 Hent dataen fra riktig sted
  const { name, avatar, credits, listings } = profileData.data || {};

  // Sjekk om `listings` er en liste
  const userListings = Array.isArray(listings) ? listings : [];

  container.innerHTML = `
    <div class="bg-white p-10 rounded-lg shadow-lg text-center max-w-3xl mx-auto border border-gray-300">
      
      <!-- Profilseksjon -->
      <div class="flex flex-col items-center">
        <img id="avatar-img" src="${avatar?.url || '/src/assets/icons/default-avatar.png'}" 
             alt="Profile Avatar" class="w-32 h-32 rounded-full shadow-md border border-gray-400 object-cover">
        <h2 class="text-4xl font-bold mt-4 text-black tracking-wide font-[crimson]">${name || "Unknown User"}</h2>
        <p class="text-gray-600 text-lg mt-1">Credits: <span class="font-bold text-black">${credits ?? "Not available"}</span></p>
      </div>

      <!-- Avatar Update Section -->
      <div class="mt-8">
        <input type="url" id="avatar-url" placeholder="Enter new avatar URL" 
               class="px-4 py-2 border border-gray-400 rounded-md w-80 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black">
        <button id="update-avatar-btn" 
                class="bg-black text-white px-6 py-2 rounded-md font-semibold mt-2 transition hover:bg-gray-400">
          Update Avatar
        </button>
      </div>

      <!-- Make New Listing Button -->
      <div class="mt-10">
        <a href="../../listing/create/index.html"
           class="bg-black text-white px-6 py-3 rounded-md font-semibold transition hover:bg-gray-400">
           + Make New Listing
        </a>
      </div>

      <!-- Listings Section -->
      <h3 class="text-2xl font-semibold mt-12 text-black border-b pb-2 font-[crimson]">My Listings</h3>
      <div id="listings-container" class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${userListings.length > 0 
          ? renderListings(userListings) 
          : "<p class='text-gray-500 italic mt-4'>You have no active listings.</p>"}
      </div>
    </div>
  `;

  // Legg til event listener for oppdatering av avatar
  document.getElementById("update-avatar-btn").addEventListener("click", handleUpdateAvatar);
}


/**
 * Handles updating the user's avatar.
 */
/**
 * Handles updating the user's avatar.
 */
async function handleUpdateAvatar() {
  const newAvatarUrl = document.getElementById("avatar-url").value.trim();

  if (!newAvatarUrl) {
    showAlert("Please enter a valid URL for your avatar." , "error");
    return;
  }

  try {
    await updateProfile({ avatar: { url: newAvatarUrl } }); // 🔥 Send avatar som objekt
    showAlert("✅ Avatar updated successfully!");

    // Oppdater avatar-bildet uten å måtte reloade hele siden
    document.getElementById("avatar-img").src = newAvatarUrl;
  } catch (error) {
    console.error("❌ Failed to update avatar:", error);
    showAlert("Please enter a valid URL", "error");
  }
}




/**
 * Generates HTML for user listings.
 * @param {Array} listings - Array of user's listings.
 * @returns {string} HTML markup for the listings.
 */
/**
 * Generates HTML for user listings.
 * @param {Array} listings - Array of user's listings.
 * @returns {string} HTML markup for the listings.
 */
export function renderListings(listings) {
  return listings
    .map(listing => {
      // Standard fallback-bilde hvis ingen media finnes
      let imageUrl = "/src/assets/icons/default-placeholder.png"; 

      // Sjekk om media-arrayet finnes og har en gyldig URL
      if (Array.isArray(listing.media) && listing.media.length > 0 && listing.media[0].url !== "string" && listing.media[0].url.trim() !== "") {
        imageUrl = listing.media[0].url;
      }

      return `
      <div class="bg-gray-100 p-5 shadow-md flex flex-col justify-between border hover:scale-105 cursor-pointer">
        <!-- Listing Image -->
        <img src="${imageUrl}" alt="${listing.media[0]?.alt || listing.title}" class="w-full h-48 object-cover rounded-md shadow-sm">

        <!-- Listing Content -->
        <div class="mt-4">
          <h4 class="font-bold text-lg font-[crimson]">${listing.title}</h4>
          <p class="text-gray-600 text-sm mt-1">${listing.description || "No description available."}</p>
        </div>

        <!-- Edit/Delete Buttons -->
        <div class="flex justify-between mt-4">
          <a href="/listing/edit/index.html?id=${listing.id}" class="text-blue-500 font-medium hover:underline">Edit</a>
          <button class="text-red-500 font-medium hover:underline delete-btn" data-id="${listing.id}">Delete</button>
        </div>
      </div>
      `;
    })
    .join("");
}



document.addEventListener("click", async (event) => {
  const deleteBtn = event.target.closest(".delete-btn");
  if (!deleteBtn) return;

  const listingId = deleteBtn.getAttribute("data-id");
  if (!listingId) return;

  // 👉 Bruk eksisterende `onDeleteListing` fra `delete.js`
  onDeleteListing(listingId);
});




// Initialiser profilen når siden lastes
document.addEventListener("DOMContentLoaded", profileInit);
