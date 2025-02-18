// src/js/api/auth/login.js
import { API_AUTH_LOGIN } from "../constants";
import { apiRequest } from "../../ui/utilities/apiRequest";
import { showAlert } from "../../../app.js";

export async function login({ email, password }) {
  try {
    const response = await apiRequest(API_AUTH_LOGIN, "POST", { email, password });
    console.log("Login response:", response);

    if (!response) {
      showAlert("Login failed: No response from server.", "error");
      console.error("❌ Response is undefined");
      return null;
    }

    const data = response.data || response;
    if (!data) {
      showAlert("Login failed: Response data is undefined.", "error");
      console.error("❌ Response data is undefined:", response);
      return null;
    }

    const token = data.accessToken;
    const name = data.name;

    if (token && name) {
      console.log("🔑 Storing user credentials...");
      localStorage.setItem("token", token);
      localStorage.setItem("name", name);

      showAlert("Login successful! Redirecting...", "success");

      setTimeout(() => {
        console.log("🚀 Redirecting to homepage...");
        window.location.href = "/";
      }, 500);

      return data;
    } else {
      showAlert("Login failed: Missing token or name.", "error");
      console.error("❌ Login response missing token or name:", data);
      return null;
    }
  } catch (error) {
    console.error("❌ Login error:", error);
    showAlert("Login failed: " + error.message, "error");
    return null;
  }
}
