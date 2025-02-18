import { API_AUTH_REGISTER } from "../constants";

/**
 * Registrerer en ny bruker.
 */
export async function register({ name, email, password }) {
  const body = JSON.stringify({ name, email, password });
  try {
    const response = await fetch(API_AUTH_REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    const user = await response.json();
    // Lagre token og navn i localStorage hvis API-et returnerer det
    if (user.token) {
      localStorage.setItem("token", user.token);
    }
    localStorage.setItem("name", user.name);
    return user;
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}
