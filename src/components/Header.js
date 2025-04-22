import Nav from "./Nav";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <Link to="/">
        <img src="assets/logo.png" alt="Logo" />
      </Link>
      <Nav />
    </header>
  );
}

export default Header;
