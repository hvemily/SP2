// src/js/router/views/postEdit.js
import { fetchSingleListing } from "../../api/post/read.js";
import { onUpdatePost } from "../../ui/post/update.js";
import { showAlert } from "../../../app.js";

/**
 * Starter redigering av et innlegg.
 * @param {string} postId - ID-en til posten som skal redigeres.
 */
export default async function editListing(postId) {
  if (!postId) {
    console.error("❌ No post ID provided for editing.");
    return;
  }

  try {
    const post = await fetchSingleListing(postId);
    if (!post) {
      throw new Error("Post data is undefined or null.");
    }
    renderEditForm(post);
  } catch (error) {
    console.error("❌ Failed to fetch post for editing:", error);
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
    console.error("❌ Edit post container not found.");
    return;
  }

  // Formater `endsAt` for datetime-local input
  const formattedEndsAt = post.endsAt ? formatDateTimeLocal(post.endsAt) : "";

  container.innerHTML = `
    <form id="edit-post-form" class="bg-white p-6 border max-w-lg mx-auto">
      <label class="block mb-2 font-medium">Title</label>
      <input type="text" name="title" value="${post.title || ""}" required class="w-full p-2 border rounded">

      <label class="block mt-4 mb-2 font-medium">Description</label>
      <textarea name="description" required class="w-full p-2 border rounded">${post.description || ""}</textarea>

      <label class="block mt-4 mb-2 font-medium">Deadline</label>
      <input type="datetime-local" name="endsAt" value="${formattedEndsAt}" required class="w-full p-2 border rounded">

      <label class="block mt-4 mb-2 font-medium">Media (Image URL)</label>
      <input type="url" name="media" value="${post.media?.[0]?.url || ""}" placeholder="Optional" class="w-full p-2 border rounded">

      <label class="block mt-4 mb-2 font-medium">Tags (comma separated)</label>
      <input type="text" name="tags" value="${post.tags?.join(", ") || ""}" placeholder="e.g. Art, Vintage" class="w-full p-2 border rounded">

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
 * Formaterer en ISO-dato til "YYYY-MM-DDTHH:MM" for datetime-local input.
 * @param {string} isoDate - ISO-dato
 * @returns {string} Formatert dato eller tom string hvis datoen er ugyldig.
 */
function formatDateTimeLocal(isoDate) {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}T${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}
