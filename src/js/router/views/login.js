import { onLogin } from "../../ui/auth/login.js";

export default function loginInit() {
  console.log("🔑 Running loginInit()...");
  
  // Bruk en liten timeout for å sikre at innholdet er ferdig lastet
  setTimeout(() => {
    const form = document.getElementById("login-form");

    if (form) {
      form.addEventListener("submit", onLogin);
      console.log("✅ Login form event listener added.");
    } else {
      console.error("❌ Login form not found in the DOM.");
    }
  }, 100);
}
