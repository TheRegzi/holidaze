import { getHeaders } from "../../utils/headers";
import { API_REGISTER } from "../../utils/constants";

/**
 * Registers a new user with the Noroff API.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The user data.
 * @throws {Error} If the register fails or the response is not ok.
 */

export async function registerUser({ username, email, password, role }) {
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

  const response = await fetch(API_REGISTER, {
    method: "POST",
    headers: getHeaders(API_KEY),
    body: JSON.stringify({
      name: username,
      email,
      password,
      venueManager: role === "venueManager" ? true : false,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.errors?.[0]?.message || data.message || "Registration failed"
    );
  }
  return data;
}
