import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-primary">
      <div className="justif m-0 p-0 text-center">
        <Link to="/login">Login | </Link>
        <Link to="/register">Register</Link>
      </div>
      <div className="justif m-0 p-0 text-center">
        <p>© 2025 Holidaze Inc.</p>
      </div>
    </footer>
  );
}

export default Footer;
