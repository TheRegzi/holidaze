export const API_URL = "https://v2.api.noroff.dev";

// Venues
export const API_VENUES = `${API_URL}/holidaze/venues`;
export const API_VENUE = (id) => `${API_URL}/holidaze/venues/${id}`;

// Bookings
export const API_BOOKINGS = `${API_URL}/holidaze/bookings`;
export const API_BOOKING = (id) => `${API_URL}/holidaze/bookings/${id}`;

// Profile
export const API_PROFILES = `${API_URL}/holidaze/profiles`;
export const API_PROFILE = (name) => `${API_URL}/holidaze/profiles/${name}`;
export const API_PROFILE_BOOKINGS = (name) =>
  `${API_URL}/holidaze/profiles/${name}/bookings`;
export const API_PROFILE_VENUES = (name) =>
  `${API_URL}/holidaze/profiles/${name}/venues`;

// Auth
export const API_LOGIN = `${API_URL}/auth/login`;
export const API_REGISTER = `${API_URL}/auth/register`;
