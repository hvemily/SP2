import { onRegister } from "../../ui/auth/register.js";

const form = document.getElementById("register-form");
if (form) {
  form.addEventListener("submit", onRegister);
  console.log("✅ Register form event listener added.");
} else {
  console.error("Register form not found");
}
