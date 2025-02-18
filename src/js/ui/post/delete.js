import { showAlert, showConfirmationModal } from "../../../app.js";
import { deleteListing } from "../../api/post/delete.js";

/**
 * Handles the deletion of a listing by its ID.
 * Confirms with the user before deleting the listing, then calls `deleteListing` function.
 *
 * @param {string|number} listingId - The ID of the listing to delete.
 */
export async function onDeleteListing(listingId) {
  if (!listingId) {
    console.error("❌ listingId is missing in onDeleteListing");
    return;
  }

  // Bruk en gjenbrukbar bekreftelsesmodal med et konfigurasjonsobjekt
  showConfirmationModal({
    title: "Delete Listing",
    message: "Are you sure you want to delete this listing? This action cannot be undone.",
    confirmText: "Yes, delete it",
    cancelText: "Cancel",
    onConfirm: async () => {
      try {
        await deleteListing(listingId);
        showAlert("Listing deleted successfully!", "success");
        location.reload(); // Refresh page after delete
      } catch (error) {
        showAlert("Failed to delete listing. Please try again.", "error");
        console.error("❌ Error deleting listing:", error);
      }
    },
    onCancel: () => {
      console.log("User canceled deletion.");
    },
  });
}
