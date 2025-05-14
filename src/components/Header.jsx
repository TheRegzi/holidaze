import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Nav from "./Nav";

/**
 * React component for displaying the header.
 * If on mobile view, it displays a hamburger menu icon, that opens the menu when clicked.
 *
 * @param {Object} props
 * @param {function} props.toggleMenu - Function to toggle the mobile menu open/closed.
 * @param {boolean} props.isOpen - Whether the mobile menu is open.
 * @param {function} props.closeMenu - Function to close the mobile menu.
 * @returns {JSX.Element} The rendered header component.
 */
function Header({ toggleMenu, isOpen, closeMenu }) {
  return (
    <>
      <header className="flex items-center justify-between bg-primary p-4 md:gap-20">
        <Link to="/" onClick={() => (window.location.href = "/")}>
          <img className="ml-2 md:ml-5" src="/assets/logo.png" alt="Logo" />
        </Link>
        <button
          onClick={toggleMenu}
          className="mr-4 text-3xl md:hidden"
          aria-label="Toggle menu"
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="hidden md:block">
          <Nav isOpen={true} closeMenu={closeMenu} />
        </div>
      </header>
      {isOpen && (
        <div className="md:hidden">
          <Nav isOpen={isOpen} closeMenu={closeMenu} />
        </div>
      )}
    </>
  );
}

export default Header;
