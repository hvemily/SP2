export const API_KEY = "5c74e067-290f-41f1-a0a0-1cf1aa03f588";

export const API_BASE = "https://v2.api.noroff.dev";

// Auth
export const API_AUTH = `${API_BASE}/auth`;
export const API_AUTH_LOGIN = `${API_AUTH}/login`;  // ✅ Riktig nå!
export const API_AUTH_REGISTER = `${API_AUTH}/register`;
export const API_AUTH_KEY = `${API_AUTH}/create-api-key`;

// Social
export const API_SOCIAL = `${API_BASE}/social`;
export const API_SOCIAL_POSTS = `${API_SOCIAL}/posts`;
export const API_SOCIAL_PROFILES = `${API_SOCIAL}/profiles`;
export const API_COMMENTS = `${API_SOCIAL_POSTS}/comment`;

// Listings (hvis du trenger det)
export const API_LISTINGS = `${API_BASE}/auction/listings`;
export const API_BIDS = `${API_LISTINGS}/bids`;
export const API_PROFILES = `${API_BASE}/auction/profiles`;
export const API_MEDIA = `${API_BASE}/auction/media`;
export const API_CATEGORIES = `${API_LISTINGS}/categories`;
