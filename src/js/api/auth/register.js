import { API_AUTH_REGISTER } from "../constants";
import { apiRequest } from "../../ui/utilities/apiRequest";

export async function register({ name, email, password }) {
  try {
    const { data } = await apiRequest(API_AUTH_REGISTER, "POST", { name, email, password });

    if (!data?.name) throw new Error("Registration failed: No name returned.");

    localStorage.setItem("name", data.name);
    if (data.accessToken) localStorage.setItem("token", data.accessToken);

    return data;
  } catch (error) {
    console.error("❌ Registration error:", error);
    throw error;
  }
}
