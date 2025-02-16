import { API_AUTH_LOGIN, API_KEY } from "../constants";

/**
 * Logs in a user with the provided email and password.
 * 
 * @param {Object} data - The login data.
 * @param {string} data.email - The user's email address.
 * @param {string} data.password - The user's password.
 * @returns {Promise<Object>} A promise that resolves to the user's login response.
 * @throws {Error} Throws an error if the login request fails or the response is not OK.
 */
export async function login({ email, password }) {
  try {
    const response = await fetch(API_AUTH_LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`Login error: ${error.message}`);
  }
}
