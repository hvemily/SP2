import { register } from "../../api/auth/register.js";
import { showLoader, hideLoader, showAlert } from "../../../app.js";

export async function onRegister(event) {
  event.preventDefault();
  console.log("🟢 onRegister triggered!");

  const form = event.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value.trim();
  const confirmPassword = form.confirmPassword.value.trim();

  // Sjekk at passordene stemmer overens
  if (password !== confirmPassword) {
    showAlert("Passwords do not match.", "error");
    return;
  }

  try {
    showLoader(); // Vis spinner
    const response = await register({ name, email, password });

    // Ved vellykket registrering, sett brukerens credits (hvis ikke allerede satt)
    const creditsKey = `credits_${email}`;
    if (!localStorage.getItem(creditsKey)) {
      localStorage.setItem(creditsKey, 1000);
    }

    hideLoader(); // Skjul spinner før meldingen vises
    showAlert("Registration successful!", "success");

    // Vent 3 sekunder før redirect
    setTimeout(() => {
      window.location.href = "/auth/login/index.html";
    }, 3000);

  } catch (error) {
    hideLoader(); // Skjul spinner på feil også
    if (error.message.includes("already exists")) {
      showAlert("This email is already registered. Please use another email.", "error");
    } else {
      showAlert(`Registration failed: ${error.message}`, "error");
    }
  }
}
