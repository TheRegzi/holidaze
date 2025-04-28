import { Link } from "react-router-dom";
import { logoutUser } from "../api/auth/logoutUser";
import { useNavigate } from "react-router-dom";

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
            className="rounded-lg bg-accent px-5 py-2 shadow-lg text-shadow-lg"
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
