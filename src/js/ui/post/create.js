import { createListing } from "../../api/post/create.js";
import { showAlert } from "../../../app.js"; // Sørg for at showAlert er eksportert fra app.js

/**
 * Initialiserer create listing-siden.
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
      alert("Please fill out all required fields: title, description, and deadline.");
      return;
    }

    // Konverter endsAt til ISO-format
    const endsAt = new Date(endsAtRaw).toISOString();

    // Behandle tags: splitt på komma, trim, og fjern tomme verdier
    const tags = tagsRaw ? tagsRaw.split(",").map(tag => tag.trim()).filter(tag => tag) : [];

    // Sett opp media som en array av objekter med url og alt
    const media = mediaUrl ? [{ url: mediaUrl, alt: title }] : [];

    const listingData = {
      title,
      description,
      endsAt, // ISO-formatet, f.eks. "2025-01-01T12:00:00Z"
      media: mediaUrl ? [{ url: mediaUrl, alt: title }] : [],
      tags
    };

    console.log("Listing Data:", listingData);

    try {
      const createdListing = await createListing(listingData);
      console.log("Listing created successfully:", createdListing);
      
      // Vis en suksessmelding via modal/alert
      showAlert("Listing created successfully!", "success");
      
      // Etter 2 sekunder, redirect til "My Profile" siden
      setTimeout(() => {
        window.location.href = "/profile/index.html";
      }, 2000);
      
    } catch (error) {
      console.error("Failed to create listing:", error);
      alert("Failed to create listing: " + error.message);
    }
  });
}
