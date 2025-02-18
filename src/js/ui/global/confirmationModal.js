/**
 * Viser en gjenbrukbar bekreftelsesmodal.
 *
 * @param {Object} options - Konfigurasjonsobjekt for modalen.
 * @param {string} options.title - Tittelen i modalen.
 * @param {string} options.message - Hovedmeldingen i modalen.
 * @param {string} [options.confirmText="Confirm"] - Tekst på bekreftelsesknappen.
 * @param {string} [options.cancelText="Cancel"] - Tekst på avbryt-knappen.
 * @param {function} [options.onConfirm] - Kalles når brukeren bekrefter handlingen.
 * @param {function} [options.onCancel] - Kalles når brukeren avbryter handlingen.
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

  if (!modal || !titleEl || !messageEl || !confirmBtn || !cancelBtn) {
    console.error("❌ Confirmation modal elements not found in DOM.");
    return;
  }

  // Sett innholdet
  titleEl.textContent = title;
  messageEl.textContent = message;
  confirmBtn.textContent = confirmText;
  cancelBtn.textContent = cancelText;

  // Vis modalen
  modal.classList.remove("hidden");

  // Event handlers
  const handleConfirm = () => {
    hideConfirmationModal();
    if (typeof onConfirm === "function") onConfirm();
  };

  const handleCancel = () => {
    hideConfirmationModal();
    if (typeof onCancel === "function") onCancel();
  };

  confirmBtn.addEventListener("click", handleConfirm, { once: true });
  cancelBtn.addEventListener("click", handleCancel, { once: true });
}

/**
 * Skjuler bekreftelsesmodalen.
 */
export function hideConfirmationModal() {
  const modal = document.getElementById("confirmation-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}
