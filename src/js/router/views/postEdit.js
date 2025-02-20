// src/js/router/views/postEdit.js
import { fetchSingleListing } from "../../api/post/read.js";
import { onUpdatePost } from "../../ui/post/update.js";
import { showAlert } from "../../../app.js";

/**
 * Default export: Starter redigering av et innlegg.
 * @param {string} postId - ID-en til posten som skal redigeres.
 */
export default async function editListing(postId) {
  if (!postId) {
    console.error("No post ID provided for editing.");
    return;
  }
  
  try {
    const post = await fetchSingleListing(postId);
    renderEditForm(post);
  } catch (error) {
    console.error("Failed to fetch post for editing:", error);
    const container = document.getElementById("edit-post-container");
    if (container) {
      container.innerHTML = `<p class="text-red-500 text-center">Failed to load post details. Please try again later.</p>`;
    }
  }
}

/**
 * Renders et preutfylt redigeringsskjema med eksisterende postdata.
 * @param {Object} post - Post-objekt med eksisterende data.
 */
function renderEditForm(post) {
  const container = document.getElementById("edit-post-container");
  if (!container) {
    console.error("Edit post container not found.");
    return;
  }
  
  // For datetime-local input, konverter ISO-strengen til formatet "YYYY-MM-DDTHH:MM"
  const formattedEndsAt = formatDateTimeLocal(post.endsAt);

  container.innerHTML = `
    <form id="edit-post-form" class="bg-white p-6 border max-w-lg mx-auto">
      <label class="block mb-2 font-medium">Title</label>
      <input type="text" name="title" value="${post.title}" required class="w-full p-2 border rounded">

      <label class="block mt-4 mb-2 font-medium">Description</label>
      <textarea name="description" required class="w-full p-2 border rounded">${post.description}</textarea>

      <label class="block mt-4 mb-2 font-medium">Deadline</label>
      <input type="datetime-local" name="endsAt" value="${formattedEndsAt}" required class="w-full p-2 border rounded">

      <label class="block mt-4 mb-2 font-medium">Media (Image URL)</label>
      <input type="url" name="media" value="${post.media && post.media.length > 0 ? post.media[0].url : ''}" placeholder="Optional" class="w-full p-2 border rounded">

      <label class="block mt-4 mb-2 font-medium">Tags (comma separated)</label>
      <input type="text" name="tags" value="${post.tags ? post.tags.join(', ') : ''}" placeholder="e.g. Art, Vintage" class="w-full p-2 border rounded">

      <button type="submit" class="bg-black text-white px-4 py-2 rounded mt-4 w-full">Update Post</button>
    </form>
  `;

  const form = document.getElementById("edit-post-form");
  if (form) {
    form.addEventListener("submit", onUpdatePost);
  } else {
    showAlert("Edit form not found.", "error");
  }
}

/**
 * Hjelpefunksjon for å formatere en ISO-dato til et format som en datetime-local input godtar.
 * @param {string} isoDate - ISO-dato
 * @returns {string} Formatert dato (YYYY-MM-DDTHH:MM)
 */
function formatDateTimeLocal(isoDate) {
  const date = new Date(isoDate);
  const pad = (num) => String(num).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
