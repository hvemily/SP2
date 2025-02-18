// src/js/ui/post/update.js
import { updatePost } from "../../api/post/update.js";
import { showAlert } from "../../../app.js";

/**
 * Håndterer innsending av redigeringsskjemaet for et innlegg.
 * @param {Event} event - Skjemaets submit-hendelse.
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
  
  // Konverter endsAt til ISO-format; datetime-local gir f.eks. "2023-08-24T15:30" som må konverteres
  const endsAt = new Date(endsAtRaw).toISOString();
  
  // Behandle tags: splitt på komma, trim og fjern tomme verdier
  const tags = tagsRaw ? tagsRaw.split(",").map(tag => tag.trim()).filter(tag => tag) : [];
  
  // Sett opp media som en array med objekt (inkluderer alt-tekst)
  const media = mediaUrl ? [{ url: mediaUrl, alt: title }] : [];
  
  const updatedData = {
    title,
    description,
    endsAt,
    media,
    tags,
  };

  // Hent post-ID fra URL (forutsetter at det finnes i query-string som ?id=...)
  const postId = new URLSearchParams(window.location.search).get("id");
  if (!postId) {
    showAlert("No post ID found.", "error");
    return;
  }
  
  try {
    await updatePost(postId, updatedData);
    showAlert("Post updated successfully!", "success");
    // Redirect til My Profile etter 2 sekunder
    setTimeout(() => {
      window.location.href = "/profile/index.html";
    }, 2000);
  } catch (error) {
    showAlert("Failed to update post: " + error.message, "error");
    console.error("Error updating post:", error);
  }
}
