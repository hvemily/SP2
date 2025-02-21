import { showConfirmationModal } from "../global/confirmationModal.js";

/**
 * Setting up event listener for logout btn with modal
 *
 * @param {string} logoutButtonId - ID-en til logout-knappen.
 */
export function setLogoutListener(logoutButtonId) {
  const logoutBtn = document.getElementById(logoutButtonId);
  if (!logoutBtn) {
    console.error("⚠️ Logout button not found!");
    return;
  }
  
  logoutBtn.addEventListener("click", () => {
    showConfirmationModal({
      title: "Log Out?",
      message: "Are you sure you want to log out?",
      confirmText: "Yes, log out",
      cancelText: "No, stay",
      onConfirm: () => {
        console.log("👋 Logging out... Clearing localStorage.");
        localStorage.clear();
        window.location.href = "/";
      },
      onCancel: () => {
        console.log("User canceled logout.");
      },
    });
  });
}
