import { login } from "../../api/auth/login.js";
import { hideLoader, showLoader, showAlert } from "../../../app.js";

export async function onLogin(event) {
  event.preventDefault();
  console.log("🟢 onLogin triggered!");

  const form = event.target;
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  if (!email || !password) {
    showAlert("Please fill out both email and password fields.", "error");
    return;
  }

  try {
    showLoader();

    //Call login() functuin that returns user data (token and name)
    const user = await login({ email, password });
    if (!user) return;

    const token = user.accessToken;
    const name = user.name;

    if (token && name) {
      // Store used data and email to get credits 
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);
      localStorage.setItem("email", email);

      //Get users credits from localstorage with a key based on email
      const creditsKey = `credits_${email}`;
      let userCredits = localStorage.getItem(creditsKey);
      if (!userCredits) {
        userCredits = 1000;
        localStorage.setItem(creditsKey, userCredits);
      }

      showAlert("Login successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } else {
      showAlert("Login failed: Missing token or name in user object.", "error");
    }
  } catch (error) {
    showAlert(`Login failed: ${error.message}`, "error");
  } finally {
    hideLoader();
  }
}
