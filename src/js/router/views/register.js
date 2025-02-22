import { onRegister } from "../../ui/auth/register.js";

const form = document.getElementById("register-form");
if (form) {
  form.addEventListener("submit", onRegister);
  
} else {
  console.error("Register form not found");
}
