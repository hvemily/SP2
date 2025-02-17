import { API_AUTH_LOGIN, API_KEY } from "../constants";

import { apiRequest } from "../../ui/utilities/apiRequest";

export async function login({ email, password }) {
  return apiRequest(API_AUTH_LOGIN, "POST", { email, password });
}

