import { getHeaders } from "../../utils/headers";
import { API_LOGIN } from "../../utils/constants";

/**
 * Logs in a user with the Noroff API.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} The user data.
 * @throws {Error} If the login fails or the response is not ok.
 */
export async function loginUser({ email, password }) {
  const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

  const response = await fetch(`${API_LOGIN}?_holidaze=true`, {
    method: "POST",
    headers: getHeaders(API_KEY),
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(
      data.errors?.[0]?.message || data.message || "Login failed"
    );
  }
  return data;
}
