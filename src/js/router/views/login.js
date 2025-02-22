// src/js/router/views/login.js
import { onLogin } from "../../ui/auth/login.js";

const form = document.getElementById("login-form");
// 1) Viser om vi faktisk fant skjemaet

if (form) {
  form.addEventListener("submit", onLogin);
  // 2) Bekreft at listeneren ble satt
} else {
  console.error("❌ Login form not found in the DOM.");
}
