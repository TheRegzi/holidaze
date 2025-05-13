import { Link } from "react-router-dom";
import { logoutUser } from "../api/auth/logoutUser";
import { useNavigate } from "react-router-dom";

/**
 * Navigation component that displays app links.
 * It renders conditionally based on the user is logged in or not, so that certain links are shown and hidden wherever necessary.
 * Accepts props to control whether the nav is visible (for mobile menus) and to handle menu close actions.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the menu is currently open (for toggling visibility, especially on mobile).
 * @param {function} props.closeMenu - Function that closes the menu (called when a link is clicked).
 * @returns {JSX.Element} The rendered nav component.
 */

function Nav({ isOpen, closeMenu }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  const isLoggedIn = localStorage.getItem("user") !== null;

  return (
    <ul
      className={`${
        isOpen ? "flex bg-primary" : "hidden"
      } flex-col py-4 pb-6 pl-6 text-lg md:mr-8 md:flex md:flex-row md:items-center md:gap-10 md:pb-0`}
    >
      <li className="pb-4 font-montserrat text-lg font-semibold">
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>
      </li>
      {isLoggedIn ? null : (
        <li className="pb-4 font-montserrat text-lg font-semibold">
          <Link to="/login" onClick={closeMenu}>
            Login
          </Link>
        </li>
      )}
      {isLoggedIn ? null : (
        <li className="pb-4 font-montserrat text-lg font-semibold">
          <Link to="/register" onClick={closeMenu}>
            Register
          </Link>
        </li>
      )}
      {isLoggedIn ? (
        <li className="pb-4 font-montserrat text-lg font-semibold">
          <Link to="/profile" onClick={closeMenu}>
            Profile
          </Link>
        </li>
      ) : null}
      {isLoggedIn ? (
        <li className="pb-4 font-montserrat text-lg font-semibold">
          <button
            className="rounded-lg bg-accent px-6 py-2 shadow-lg transition-transform text-shadow-lg hover:scale-105"
            onClick={handleLogout}
          >
            Logout
          </button>
        </li>
      ) : null}
    </ul>
  );
}

export default Nav;
