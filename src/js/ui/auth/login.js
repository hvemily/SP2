import { login } from "../../api/auth/login.js";


export async function onLogin(event) {
  event.preventDefault();
  console.log("🟢 Login form submitted!");

  const form = event.target;
  const email = form.email.value.trim();
  const password = form.password.value.trim();

  if (!email || !password) {
    showAlert("Please fill out both email and password fields.", "error");
    return;
  }

  try {
    showLoader();
    console.log("🔄 Sending login request...");

    const user = await login({ email, password });
    console.log("✅ Login request successful:", user);

    const token = user.data?.accessToken;
    const name = user.data?.name;

    if (token && name) {
      console.log("🔑 Storing user credentials...");
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);

      showAlert("Login successful! Redirecting...", "success");

      setTimeout(() => {
        console.log("🚀 Redirecting to homepage...");
        window.history.pushState({}, "", "/");
        router();
      }, 500);      
    } else {
      showAlert("Login failed: Missing token or name.", "error");
      console.error("❌ Login response missing token or name:", user);
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    showAlert(`Login failed: ${error.message}`, "error");
  } finally {
    hideLoader();
  }
}
