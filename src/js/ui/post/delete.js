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
      hideConfirmationModal(); 

      try {
        const response = await deleteListing(listingId);
        console.log("✅ Deletion response:", response);

        if (!response || response.status === undefined || response.status === 204) {
          console.log("✅ Listing deleted successfully (assuming success due to no response body).");
          showAlert("Listing deleted successfully!", "success");

          document.querySelector(`[data-id="${listingId}"]`)?.closest(".listing-card")?.remove();

          setTimeout(() => {
            location.reload();
          }, 1500);

          return;
        }

        throw new Error(`Unexpected response: ${response?.status || "No status returned"}`);

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
