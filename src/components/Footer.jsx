import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-primary p-12 md:p-16">
      <div className="justif m-0 p-0 text-center font-semibold">
        <Link className="font-openSans" to="/login">
          Login |{" "}
        </Link>
        <Link className="font-openSans" to="/register">
          Register
        </Link>
      </div>
      <div className="mt-3 p-0 text-center">
        <p className="font-openSans">© 2025 Holidaze Inc.</p>
      </div>
    </footer>
  );
}

export default Footer;
