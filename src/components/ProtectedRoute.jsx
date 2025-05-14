import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Function to make sure to protect routes that require authentication.
 * If not logged in, the user is redirected to login.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components to render if access is granted.
 * @returns {JSX.Element} The protected route (either children or a redirect).
 */
export default function ProtectedRoute({ children }) {
  const { user, token } = useAuth();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
