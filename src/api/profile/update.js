import { API_PROFILES } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";

/**
 * Updates a user profile by sending a PUT request to the profile API endpoint.
 *
 * @param {Object} params - The parameters for updating the user profile.
 * @param {string} params.userName - The username of the profile to update.
 * @param {Object} params.body - The data to update on the profile (will be JSON.stringify'ed).
 * @param {string} params.token - Authentication token for the API request.
 * @param {string} params.apiKey - API key for the API request.
 * @returns {Promise<Object>} The updated profile data as returned by the API.
 * @throws {Error} If the API request fails.
 *
 */

export async function updateProfileApi({ userName, body, token, apiKey }) {
  const res = await fetch(`${API_PROFILES}/${userName}`, {
    method: "PUT",
    headers: getHeaders(apiKey, token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to update profile");
  return await res.json();
}
