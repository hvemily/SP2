import "../src/css/style.css";
import router from "./js/router/index.js";
import { setLogoutListener } from "./js/ui/global/logout.js";
import { fetchProfile } from "./js/api/profile/read.js"; // ✅ Henter ekte credits fra API-et

// Når DOM-en er lastet, kjører vi router og oppdaterer navigasjonen
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 App loaded, running router...");
  router(window.location.pathname);
  await updateNavigation(); // ✅ Vent på oppdatering av navigasjonen
});

// Håndter tilbake/forover-knapper i nettleseren
window.addEventListener("popstate", () => {
  console.log("🔙 Navigating back/forward...");
  router();
});

/**
 * Oppdaterer navigasjonsmenyen basert på brukerens innloggingsstatus og credits fra API-et.
 */
async function updateNavigation() {
  const navContainer = document.querySelector("header .flex-grow nav");
  if (!navContainer) {
    console.error("⚠️ Navigation container not found!");
    return;
  }

  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  if (token && name) {
    try {
      const profile = await fetchProfile(); // ✅ Hent ekte credits fra API
      const credits = profile.data.credits ?? "Not available"; // Fallback om credits mangler

      navContainer.innerHTML = `
        <span class="text-customGray font-bold text-sm">Credits: ${credits}</span>
        <a href="/profile/index.html" class="text-customGray hover:text-white font-bold hover:scale-105">My Profile</a>
        <button id="logout" class="bg-customGray text-black px-4 py-2 rounded-full font-bold transition-all duration-200 hover:bg-black hover:text-customGray hover:scale-105">Logout</button>
      `;

      setLogoutListener("logout"); // ✅ Bind logout-knappen én gang
    } catch (error) {
      console.error("❌ Failed to fetch credits:", error);
    }
  } else {
    navContainer.innerHTML = `
      <a href="/auth/register/index.html" class="text-customGray hover:text-white font-bold hover:scale-105">Sell with us</a>
      <a href="/auth/login/index.html" id="login" data-no-spa class="bg-customGray text-black px-4 py-2 rounded-full font-bold transition-all duration-200 hover:bg-black hover:text-customGray hover:scale-105 hover:border">Login</a>
    `;
  }
}

// Globale funksjoner for loader og alert
export function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.remove("hidden");
}

export function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.add("hidden");
}

export function showAlert(message, type = "success") {
  const alertBox = document.getElementById("alert");
  const alertMessage = document.getElementById("alert-message");

  if (!alertBox || !alertMessage) {
    console.error("⚠️ Alert element not found in DOM.");
    return;
  }

  alertMessage.textContent = message;
  alertBox.className = `fixed top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded shadow-lg z-50 ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  } text-white`;

  alertBox.classList.remove("hidden");

  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 3000);
}
