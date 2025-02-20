import { showConfirmationModal, hideConfirmationModal } from "../global/confirmationModal.js"
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

  console.log(`🛑 Attempting to delete listing with ID: ${listingId}`);

  showConfirmationModal({
    title: "Delete Listing",
    message: "Are you sure you want to delete this listing? This action cannot be undone.",
    confirmText: "Yes, delete it",
    cancelText: "Cancel",
    onConfirm: async () => {
      console.log("✅ User confirmed deletion. Deleting...");
      hideConfirmationModal(); // 🔥 Skjul den første modalen før sletting

      try {
        const response = await deleteListing(listingId);
        console.log("✅ Deletion response:", response);

        if (!response || response.status !== 204) {
          throw new Error(`Server responded with status: ${response?.status}`);
        }

        // ✅ Vis suksessmelding i modalen
        showConfirmationModal({
          title: "Success",
          message: "Listing deleted successfully!",
          hideButtons: true, // Skjul knapper for å unngå flere klikk
        });

        // ✅ Vent litt før siden oppdateres
        setTimeout(() => {
          location.reload();
        }, 1500);

      } catch (error) {
        console.error("❌ Error deleting listing:", error);

        // ✅ Håndter feil og vis i modalen
        let errorMessage = "Failed to delete listing. Please try again.";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "object" && error !== null) {
          errorMessage = JSON.stringify(error, null, 2);
        }

        showConfirmationModal({
          title: "Error",
          message: errorMessage,
          confirmText: "OK",
          onConfirm: () => hideConfirmationModal(),
        });
      }
    },
    onCancel: () => {
      console.log("❌ User canceled deletion.");
    },
  });
}
