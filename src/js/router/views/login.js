// src/js/router/views/login.js
import { onLogin } from "../../ui/auth/login.js";

const form = document.getElementById("login-form");
console.log("Fant login-form:", form); // 1) Viser om vi faktisk fant skjemaet

if (form) {
  form.addEventListener("submit", onLogin);
  console.log("✅ Login form event listener added."); // 2) Bekreft at listeneren ble satt
} else {
  console.error("❌ Login form not found in the DOM.");
}
