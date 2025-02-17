import { API_KEY } from "../../api/constants";

export async function apiRequest(endpoint, method = "GET", body = null, requiresAuth = false) {
  const headers = {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
  };

  if (requiresAuth) {
      const token = localStorage.getItem("token");
      if (token) {
          headers["Authorization"] = `Bearer ${token}`;
      }
  }

  const config = { method, headers };
  if (body) {
      config.body = JSON.stringify(body);
  }

  try {
      console.log(`🚀 Sending request to: ${endpoint} with method: ${method}`);
      console.log("📦 Request body:", body);

      const response = await fetch(endpoint, config);
      console.log("🔄 Response received:", response);

      const responseData = await response.json();
      console.log("📦 Full API response:", responseData);

      if (!response.ok) {
          console.error(`❌ API Request Error (${response.status}):`, responseData);
          throw new Error(responseData.errors?.[0]?.message || "Unknown API error");
      }

      return responseData;
  } catch (error) {
      console.error("❌ API Request Catch Error:", error);
      throw error;
  }
}

console.log("🔑 API_KEY:", API_KEY);
