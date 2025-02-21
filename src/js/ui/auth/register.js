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

  // Checking if passwords match
  if (password !== confirmPassword) {
    showAlert("Passwords do not match.", "error");
    return;
  }

  try {
    showLoader(); // spinner
    const response = await register({ name, email, password });

    //By successful registration, set user credits if not already set
    const creditsKey = `credits_${email}`;
    if (!localStorage.getItem(creditsKey)) {
      localStorage.setItem(creditsKey, 1000);
    }

    hideLoader(); //Hide spinner
    showAlert("Registration successful!", "success");

    // 3 sekunder before redirect
    setTimeout(() => {
      window.location.href = "/auth/login/index.html";
    }, 3000);

  } catch (error) {
    hideLoader(); // Hide spinner on errors too
    if (error.message.includes("already exists")) {
      showAlert("This email is already registered. Please use another email.", "error");
    } else {
      showAlert(`Registration failed: ${error.message}`, "error");
    }
  }
}
