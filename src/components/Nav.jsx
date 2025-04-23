import { Link } from "react-router-dom";

function Nav({ isOpen, closeMenu }) {
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
      <li className="pb-4 font-montserrat text-lg font-semibold">
        <Link to="/login" onClick={closeMenu}>
          Login
        </Link>
      </li>
      <li className="pb-4 font-montserrat text-lg font-semibold">
        <Link to="/register" onClick={closeMenu}>
          Register
        </Link>
      </li>
      <li className="pb-4 font-montserrat text-lg font-semibold">
        <Link to="/profile" onClick={closeMenu}>
          Profile
        </Link>
      </li>
    </ul>
  );
}

export default Nav;
