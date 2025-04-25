/**
 * Generates headers for Noroff API requests.
 * Always includes the API key. Optionally includes the user access token.
 *
 * @param {string} apiKey - Your Noroff API Key
 * @param {string} [accessToken] - JWT token for logged-in user (optional for public endpoints)
 * @returns {object} Headers object
 */

export function getHeaders(apiKey, accessToken) {
  if (!apiKey) throw new Error("API key is required!");

  return {
    "Content-Type": "application/json",
    "X-Noroff-API-Key": apiKey,
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };
}
