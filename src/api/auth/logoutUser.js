/**
 * Logs out a user by removing 'user' and 'accessToken' stored in localStorage.
 * @function
 * @returns {void}
 */
export function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
}
