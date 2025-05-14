import { NavLink } from "react-router-dom";
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
      className={` ${isOpen ? "top-98 fixed left-0 z-50 flex bg-primary" : "hidden"} h-md w-full flex-col p-6 text-lg text-black transition-all duration-300 md:relative md:flex md:h-auto md:w-auto md:flex-row md:items-center md:gap-14 md:p-0 md:pb-0`}
    >
      <li className="pb-6 font-montserrat text-xl font-semibold hover:text-red md:pb-0">
        <NavLink
          to="/"
          onClick={closeMenu}
          className={({ isActive }) =>
            isActive ? "border-b-2 border-black hover:border-red" : ""
          }
        >
          Home
        </NavLink>
      </li>
      {isLoggedIn ? null : (
        <li className="pb-6 font-montserrat text-xl font-semibold hover:text-red md:pb-0">
          <NavLink
            to="/login"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "border-b-2 border-black hover:border-red" : ""
            }
          >
            Login
          </NavLink>
        </li>
      )}
      {isLoggedIn ? null : (
        <li className="pb-6 font-montserrat text-xl font-semibold hover:text-red md:mr-10 md:pb-0">
          <NavLink
            to="/register"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "border-b-2 border-black hover:border-red" : ""
            }
          >
            Register
          </NavLink>
        </li>
      )}
      {isLoggedIn ? (
        <li className="pb-6 font-montserrat text-xl font-semibold hover:text-red md:pb-0">
          <NavLink
            to="/profile"
            onClick={closeMenu}
            className={({ isActive }) =>
              isActive ? "border-b-2 border-black hover:border-red" : ""
            }
          >
            My profile
          </NavLink>
        </li>
      ) : null}
      {isLoggedIn ? (
        <li className="font-montserrat text-xl font-semibold">
          <button
            className="rounded-lg bg-accent px-6 py-2 shadow-lg transition-transform text-shadow-lg hover:scale-105 md:mr-10"
            onClick={handleLogout}
          >
            Log out
          </button>
        </li>
      ) : null}
    </ul>
  );
}

export default Nav;
