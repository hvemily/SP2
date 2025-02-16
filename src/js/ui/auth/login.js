import { login } from "../../api/auth/login.js";
import { showAlert, showLoader, hideLoader } from "../../../app.js"; // Importer spinnerkontroll

export async function onLogin(event) {
  event.preventDefault();

  const form = event.target;
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  // validate input
  if (!email || !password) {
    showAlert("Please fill out both email and password fields.", "error");
    return;
  }

  try {
    showLoader(); // show spinner

    const user = await login({ email, password });

    // handle login-respons
    const token = user.data?.accessToken;
    const name = user.data?.name;

    if (token && name) {
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);

      showAlert("Login successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "/"; // redirect to index
      }, 2000); // gives user time to see msg
    } else {
      showAlert("Login failed: Missing token or name.", "error");
    }
  } catch (error) {
    showAlert(`Login failed: ${error.message}`, "error");
  } finally {
    hideLoader(); // hide spinner
  }
}
