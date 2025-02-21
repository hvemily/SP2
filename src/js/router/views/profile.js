import { showAlert } from "../../../app.js";
import { fetchProfile } from "../../api/profile/read.js";
import { updateProfile } from "../../api/profile/update.js";
import { onDeleteListing } from "../../ui/post/delete.js";

/**
 * Initialiserer profilen.
 */
document.addEventListener("DOMContentLoaded", profileInit);

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
 * Renderer brukerens profil.
 * @param {Object} profileData - Brukerdata fra API-et.
 */
function renderProfile(profileData) {
  const container = document.getElementById("profile-container");
  if (!container) return console.error("❌ Profile container not found!");

  const { name, avatar, credits, listings } = profileData.data || {};
  const userListings = Array.isArray(listings) ? listings : [];

  container.innerHTML = `
    <div class="bg-white p-10 rounded-lg shadow-lg text-center max-w-3xl mx-auto border border-gray-300">
      <div class="flex flex-col items-center">
        <img id="avatar-img" src="${avatar?.url || '/src/assets/icons/default-avatar.png'}" 
             alt="Profile Avatar" class="w-32 h-32 rounded-full shadow-md border border-gray-400 object-cover">
        <h2 class="text-2xl font-medium mt-4 text-black tracking-wide font-[crimson]">${name || "Unknown User"}</h2>
        <p class="text-gray-600 text-lg mt-1">Credits: <span class="font-bold text-black">${credits ?? "Not available"}</span></p>
      </div>

      <div class="mt-8">
        <input type="url" id="avatar-url" placeholder="Enter new avatar URL" 
               class="px-4 py-2 border border-gray-400 rounded-md w-80 text-gray-700 focus:outline-none focus:ring-2 focus:ring-black">
        <button id="update-avatar-btn" class="bg-black text-white px-6 py-2 rounded-md font-semibold mt-2 transition hover:bg-gray-400">
          Update Avatar
        </button>
      </div>

      <div class="mt-10">
        <a href="../../listing/create/index.html"
           class="bg-black text-white px-6 py-3 rounded-md font-semibold transition hover:bg-gray-400">
           + Make New Listing
        </a>
      </div>

      <h3 class="text-2xl font-semibold mt-12 text-black border-b pb-2 font-[crimson]">My Listings</h3>
      <div id="listings-container" class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${userListings.length ? renderListings(userListings) : "<p class='text-gray-500 italic mt-4'>You have no active listings.</p>"}
      </div>
    </div>
  `;

  document.getElementById("update-avatar-btn").addEventListener("click", handleUpdateAvatar);
}

/**
 * Håndterer oppdatering av avatar.
 */
async function handleUpdateAvatar() {
  const newAvatarUrl = document.getElementById("avatar-url").value.trim();
  if (!newAvatarUrl) return showAlert("Please enter a valid URL for your avatar.", "error");

  try {
    await updateProfile({ avatar: { url: newAvatarUrl } });
    showAlert("✅ Avatar updated successfully!");
    document.getElementById("avatar-img").src = newAvatarUrl;
  } catch (error) {
    console.error("❌ Failed to update avatar:", error);
    showAlert("Please enter a valid URL", "error");
  }
}

/**
 * Genererer HTML for brukerens annonser.
 * @param {Array} listings - Liste med annonser.
 * @returns {string} HTML markup.
 */
function renderListings(listings) {
  return listings
    .map(listing => {
      const imageUrl = listing.media?.[0]?.url?.trim() || "/src/assets/icons/default-placeholder.png";
      return `
      <div class="bg-gray-100 p-5 shadow-md flex flex-col justify-between border hover:scale-105 cursor-pointer">
        <img src="${imageUrl}" alt="${listing.media?.[0]?.alt || listing.title}" class="w-full h-48 object-cover rounded-md shadow-sm">
        <div class="mt-4">
          <h4 class="font-bold text-lg">${listing.title}</h4>
          <p class="text-gray-600 text-sm mt-1">${listing.description || "No description available."}</p>
        </div>
        <div class="flex justify-between mt-4">
          <a href="/listing/edit/index.html?id=${listing.id}" class="text-blue-500 font-medium hover:underline">Edit</a>
          <button class="text-red-500 font-medium hover:underline delete-btn" data-id="${listing.id}">Delete</button>
        </div>
      </div>
      `;
    })
    .join("");
}

/**
 * Lytter etter sletting av annonser.
 */
document.addEventListener("click", async (event) => {
  const deleteBtn = event.target.closest(".delete-btn");
  if (!deleteBtn) return;

  const listingId = deleteBtn.getAttribute("data-id");
  if (listingId) onDeleteListing(listingId);
});
