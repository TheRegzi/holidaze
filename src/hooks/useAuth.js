export function useAuth() {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("accessToken");
  return { user, token };
}
