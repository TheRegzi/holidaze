import { API_VENUES } from "../../utils/constants";
import { getHeaders } from "../../utils/headers";

/**
 * Sends a POST request to the venues API to create a new venue.
 * Requires authentication and valid venue data.
 *
 * @param {Object} params
 * @param {Object} params.body - The venue data to send (name, description, media, price, maxGuests, rating, meta, location).
 * @param {string} params.token - API access token.
 * @param {string} params.apiKey - API key for authentication.
 * @returns {Promise<Object>} The server response as JSON.
 * @throws {Error} If the server responds with an error status.
 *
 * @example
 * await addVenue({ body: { name, ... }, token, apiKey });
 */
export async function addVenue({ body, token, apiKey }) {
  const res = await fetch(`${API_VENUES}`, {
    method: "POST",
    headers: getHeaders(apiKey, token),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to add venue");
  return await res.json();
}
