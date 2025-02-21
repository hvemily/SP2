/**
 * Viser en gjenbrukbar bekreftelsesmodal.
 *
 * @param {Object} options - Configuration object for modal
 * @param {string} options.title - Title in Modal
 * @param {string} options.message - Main message in modal
 * @param {string} [options.confirmText="Confirm"] - Text to confirm btn
 * @param {string} [options.cancelText="Cancel"] - Text to cancel btn
 * @param {function} [options.onConfirm] - Calls when user confirms action
 * @param {function} [options.onCancel] - Calls when user cancels action
 */
export function showConfirmationModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}) {
  const modal = document.getElementById("confirmation-modal");
  const titleEl = document.getElementById("confirmation-title");
  const messageEl = document.getElementById("confirmation-message");
  const confirmBtn = document.getElementById("confirm-button");
  const cancelBtn = document.getElementById("cancel-button");

  titleEl.textContent = title;
  messageEl.textContent = message;

  // Oppdater knappetekster
  confirmBtn.textContent = confirmText;
  cancelBtn.textContent = cancelText;

  // Remove eg earlies listeners
  confirmBtn.replaceWith(confirmBtn.cloneNode(true));
  cancelBtn.replaceWith(cancelBtn.cloneNode(true));

  //Get new btns after change
  const newConfirmBtn = document.getElementById("confirm-button");
  const newCancelBtn = document.getElementById("cancel-button");

  // Set up actions
  newConfirmBtn.onclick = () => {
    modal.classList.add("hidden");
    if (typeof onConfirm === "function") onConfirm();
  };

  newCancelBtn.onclick = () => {
    modal.classList.add("hidden");
    if (typeof onCancel === "function") onCancel();
  };

  modal.classList.remove("hidden");
}

/**
 * Hides ConfirmationModal.
 */
export function hideConfirmationModal() {
  const modal = document.getElementById("confirmation-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}
