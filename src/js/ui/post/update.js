// src/js/ui/post/update.js
import { updatePost } from "../../api/post/update.js";
import { showAlert } from "../../../app.js";

/**
 * Handling POST of edit form
 * @param {Event} event - form's submit event.
 */
export async function onUpdatePost(event) {
  event.preventDefault();
  
  const form = event.target;
  const title = form.title.value.trim();
  const description = form.description.value.trim();
  const endsAtRaw = form.endsAt.value.trim();
  const mediaUrl = form.media.value.trim();
  const tagsRaw = form.tags.value.trim();
  
  if (!title || !description || !endsAtRaw) {
    showAlert("Please fill out all required fields: title, description, and deadline.", "error");
    return;
  }
  

  const endsAt = new Date(endsAtRaw).toISOString();
  

  const tags = tagsRaw ? tagsRaw.split(",").map(tag => tag.trim()).filter(tag => tag) : [];
  

  const media = mediaUrl ? [{ url: mediaUrl, alt: title }] : [];
  
  const updatedData = {
    title,
    description,
    endsAt,
    media,
    tags,
  };


  const postId = new URLSearchParams(window.location.search).get("id");
  if (!postId) {
    showAlert("No post ID found.", "error");
    return;
  }
  
  try {
    await updatePost(postId, updatedData);
    showAlert("Post updated successfully!", "success");
    // Redirect
    setTimeout(() => {
      window.location.href = "/profile/index.html";
    }, 2000);
  } catch (error) {
    showAlert("Failed to update post: " + error.message, "error");
    console.error("Error updating post:", error);
  }
}
