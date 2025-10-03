// src/js/ui/utilities/apiRequest.js
import { API_KEY } from "../../api/constants.js";

export async function apiRequest(url, method = "GET", body = null, extraHeaders = {}) {
  const headers = {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": API_KEY, // ✅ kritisk for å ikke bli blokkert
    ...extraHeaders,
  };

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
    credentials: "omit",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} – ${text || res.statusText}`);
  }

  // mange endepunkt svarer { data: [...] }
  let json = {};
  try {
    json = await res.json();
  } catch {
    json = {};
  }
  return json;
}
