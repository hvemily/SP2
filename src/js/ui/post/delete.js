import { showAlert } from "../../../app.js";
import { deleteListing } from "../../api/post/delete.js";
import { showConfirmationModal, hideConfirmationModal } from "../../ui/global/confirmationModal.js";

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
      hideConfirmationModal(); // Skjul bekreftelsesmodalen

      try {
        const response = await deleteListing(listingId);
        console.log("✅ Deletion response:", response);

        if (!response || response.status !== 204) {
          throw new Error(`Server responded with status: ${response?.status}`);
        }

        // ✅ Vis grønn suksessmelding
        showAlert("Listing deleted successfully!", "success");

        // ✅ Oppdater siden etter 1,5 sekunder
        setTimeout(() => {
          location.reload();
        }, 1500);

      } catch (error) {
        console.error("❌ Error deleting listing:", error);
        showAlert("Failed to delete listing, try again.", "error");
      }
    },
    onCancel: () => {
      console.log("❌ User canceled deletion.");
    },
  });
}
