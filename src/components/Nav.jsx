import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <button onClick={toggleMenu}>
        <FontAwesomeIcon icon={faBars} />
      </button>

      <ul style={{ display: isOpen ? "block" : "none" }}>
        <li>
          <Link to="/" onClick={() => setIsOpen(false)}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/login" onClick={() => setIsOpen(false)}>
            Login
          </Link>
        </li>
        <li>
          <Link to="/register" onClick={() => setIsOpen(false)}>
            Register
          </Link>
        </li>
        <li>
          <Link to="/profile" onClick={() => setIsOpen(false)}>
            Profile
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
