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

  titleEl.textContent = title;
  messageEl.textContent = message;

  // Oppdater knappetekster
  confirmBtn.textContent = confirmText;
  cancelBtn.textContent = cancelText;

  // Fjern eventuelle tidligere event listeners
  confirmBtn.replaceWith(confirmBtn.cloneNode(true));
  cancelBtn.replaceWith(cancelBtn.cloneNode(true));

  // Hent nye knapper etter utskifting
  const newConfirmBtn = document.getElementById("confirm-button");
  const newCancelBtn = document.getElementById("cancel-button");

  // Sett opp hendelser
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
 * Skjuler bekreftelsesmodalen.
 */
export function hideConfirmationModal() {
  const modal = document.getElementById("confirmation-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}
