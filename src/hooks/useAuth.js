/**
 * Custom React hook to get the logged-in user and their accesstoken from localStorage.
 *
 * @returns {Object} An object with:
 *   - user {Object | null}: The logged-in user object, or null if not found.
 *   - token {string | null}: The access token, or null if not found.
 */
export function useAuth() {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("accessToken");
  return { user, token };
}
