import { showAlert } from "../../../app.js";
import { createListing } from "../../api/post/create.js";
import { showConfirmationModal } from "../global/confirmationModal.js"; 

/**
 * Initializing create listing page
 */
export function initCreateListing() {
  const form = document.getElementById("create-listing-form");
  if (!form) {
    console.error("❌ Create listing form not found!");
    return;
  }
  
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const title = formData.get("title").trim();
    const description = formData.get("description").trim();
    const endsAtRaw = formData.get("endsAt").trim();
    const mediaUrl = formData.get("media").trim();
    const tagsRaw = formData.get("tags").trim();

    if (!title || !description || !endsAtRaw) {
      showConfirmationModal({
        title: "Error",
        message: "Please fill out all required fields: title, description, and deadline.",
        confirmText: "OK",
      });
      return;
    }

    // Converts endsAt to ISO-format
    const endsAt = new Date(endsAtRaw).toISOString();

    // Handle tags: split on comma
    const tags = tagsRaw ? tagsRaw.split(",").map(tag => tag.trim()).filter(tag => tag) : [];

    // Set up media as an array of objects with url and alt
    const media = mediaUrl ? [{ url: mediaUrl, alt: title }] : [];

    const listingData = {
      title,
      description,
      endsAt, 
      media,
      tags
    };

    console.log("Listing Data:", listingData);

    try {
      const createdListing = await createListing(listingData);
      console.log("✅ Listing created successfully:", createdListing);
      
      // success message
      showAlert("Listing created successfully!", "success");

      // redirect
      setTimeout(() => {
        window.location.href = "/profile/index.html";
      }, 2000);
      
    } catch (error) {
      console.error("❌ Failed to create listing:", error);

      // show error in modal
      let errorMessage = "Failed to create listing. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        errorMessage = JSON.stringify(error, null, 2); 
      }

      showConfirmationModal({
        title: "Error",
        message: errorMessage,
        confirmText: "OK",
      });
    }
  });
}
