export function logoutUser() {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
}
