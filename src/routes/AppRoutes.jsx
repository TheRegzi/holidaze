import { Routes, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import SpecificVenue from "../pages/SpecificVenue";
import Profile from "../pages/Profile";
import ErrorPage from "../pages/ErrorPage";
import ProtectedRoute from "../components/ProtectedRoute";

/**
 * AppRoutes component that defines the main routing structure for the application, including all core routes with their corresponding pages.
 * Uses nested <Routes> and <Route> from react-router-dom.
 * It protects the profile route with ProtectedRoute, so only authenticated users can access the page.
 *
 * @returns {JSX.Element} The rendered route structure.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="specific-venue/:id" element={<SpecificVenue />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
