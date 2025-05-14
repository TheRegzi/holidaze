import { Link } from "react-router-dom";

/**
 * React component that displays the footer.
 * Displays copyright information for Holidaze Inc.
 * Shows "Login" and "Register" links when the user is not logged in.
 *
 * @returns {JSX.Element} The rendered footer component.
 */
function Footer() {
  const isLoggedIn = localStorage.getItem("accessToken") !== null;

  return (
    <footer className="bg-primary px-6 py-16 text-center md:py-20">
      {!isLoggedIn && (
        <nav aria-label="Footer navigation" className="mb-3">
          <Link
            className="mx-2 font-openSans font-semibold hover:underline focus:outline-none focus:ring-2"
            to="/login"
          >
            Login
          </Link>
          <span className="mx-1 font-openSans font-semibold">|</span>
          <Link
            className="mx-2 font-openSans font-semibold hover:underline focus:outline-none focus:ring-2"
            to="/register"
          >
            Register
          </Link>
        </nav>
      )}
      <p className="text-md block font-openSans opacity-80">
        © 2025 Holidaze Inc.
      </p>
    </footer>
  );
}

export default Footer;
