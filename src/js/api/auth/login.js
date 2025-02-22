import { API_AUTH_LOGIN } from "../constants.js";
import { apiRequest } from "../../ui/utilities/apiRequest.js";
import { showAlert } from "../../../app.js";

export async function login({ email, password }) {
  try {
    const response = await apiRequest(API_AUTH_LOGIN, "POST", { email, password });

    const data = response.data || response;

    if (!data || !data.accessToken || !data.name) {
      throw new Error("Invalid login response from server.");
    }

    // store user data
    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("name", data.name);
    localStorage.setItem("email", data.email);

    showAlert("Login successful! Redirecting...", "success");

    setTimeout(() => (window.location.href = "/"), 500);
    return data;
  } catch (error) {
    let errorMessage = "Login failed. Please try again.";

    if (error.errors && Array.isArray(error.errors)) {
      errorMessage = error.errors[0]?.message || errorMessage;
    }

    showAlert(errorMessage, "error");
    return null;
  }
}
