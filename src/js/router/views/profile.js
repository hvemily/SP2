import { fetchProfile } from "../../api/profile/read.js";
import { updateProfile } from "../../api/profile/update.js"; // <-- Import for oppdatering av profil
import { deleteListing } from "../../api/post/delete.js";
import { showConfirmationModal } from "../../ui/global/confirmationModal.js";
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
    <div class="bg-white p-8 rounded-lg shadow-md text-center max-w-3xl mx-auto">
      <div class="flex flex-col items-center">
        <img id="avatar-img" src="${avatar?.url || '/src/assets/icons/default-avatar.png'}" 
             alt="Profile Avatar" class="w-32 h-32 rounded-full shadow-md border">
        <h2 class="text-3xl font-bold mt-4">${name || "Unknown User"}</h2>
        <p class="text-gray-600 text-lg">Credits: <span class="font-bold text-customBlue">${credits ?? "Not available"}</span></p>
      </div>

      <!-- Avatar Update Section -->
      <div class="mt-6">
        <input type="url" id="avatar-url" placeholder="Enter new avatar URL" 
               class="px-4 py-2 border rounded w-80 text-gray-700">
        <button id="update-avatar-btn" 
                class="bg-customBlue text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
          Update Avatar
        </button>
      </div>

      <!-- Make New Listing Button -->
      <div class="mt-6">
        <a href="../../listing/create/index.html"
           class="bg-customBlue text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition">
           + Make New Listing
        </a>
      </div>

      <!-- Listings Section -->
      <h3 class="text-2xl font-semibold mt-8">Your Listings</h3>
      <div id="listings-container" class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${userListings.length > 0 ? renderListings(userListings) : "<p class='text-gray-500'>You have no active listings.</p>"}
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
    alert("Please enter a valid URL for your avatar.");
    return;
  }

  try {
    await updateProfile({ avatar: { url: newAvatarUrl } }); // 🔥 Send avatar som objekt
    alert("✅ Avatar updated successfully!");

    // Oppdater avatar-bildet uten å måtte reloade hele siden
    document.getElementById("avatar-img").src = newAvatarUrl;
  } catch (error) {
    console.error("❌ Failed to update avatar:", error);
    alert("Failed to update avatar. Please try again.");
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
    .map(listing => `
      <div class="bg-gray-100 p-5 rounded-lg shadow-md flex flex-col justify-between">
        <div>
          <h4 class="font-bold text-lg">${listing.title}</h4>
          <p class="text-gray-600 text-sm mt-1">${listing.description || "No description available."}</p>
        </div>
        <div class="flex justify-between mt-4">
          <a href="/listing/edit/index.html?id=${listing.id}" class="text-blue-500 font-medium hover:underline">Edit</a>
          <button class="text-red-500 font-medium hover:underline delete-btn" data-id="${listing.id}">Delete</button>
        </div>
      </div>
    `)
    .join("");
}

// Erstatt standard click-eventet for delete-knapper
document.addEventListener("click", async (event) => {
  const deleteBtn = event.target.closest(".delete-btn");
  if (!deleteBtn) return;

  const listingId = deleteBtn.getAttribute("data-id");
  if (!listingId) return;

  // Bruk bekreftelsesmodalen i stedet for native confirm()
  showConfirmationModal({
    title: "Delete Listing",
    message: "Are you sure you want to delete this listing? This action cannot be undone.",
    confirmText: "Yes, delete it",
    cancelText: "Cancel",
    onConfirm: async () => {
      try {
        await deleteListing(listingId);
        showAlert("✅ Listing deleted successfully.", "success");
        profileInit(); // Refresh profile after deletion
      } catch (error) {
        console.error("❌ Failed to delete listing:", error);
        showAlert("Failed to delete listing.", "error");
      }
    },
    onCancel: () => {
      console.log("User canceled deletion.");
    },
  });
});



// Initialiser profilen når siden lastes
document.addEventListener("DOMContentLoaded", profileInit);
