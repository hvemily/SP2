import { API_AUTH_LOGIN } from "../constants.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";
import { showAlert } from "../../../app.js";

export async function login({ email, password }) {
  try {
    const { data } = await apiRequest(API_AUTH_LOGIN, "POST", { email, password });

    if (!data?.accessToken || !data?.name) {
      throw new Error("Missing token or name.");
    }

    // ✅ Lagre brukerdata
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("name", data.name);
    localStorage.setItem("email", data.email);

    showAlert("Login successful! Redirecting...", "success");

    setTimeout(() => (window.location.href = "/"), 500);
    return data;
  } catch (error) {
    console.error("❌ Login error:", error);
    showAlert(`Login failed: ${error.message}`, "error");
    return null;
  }
}

