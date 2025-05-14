import { useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

/**
 * React component to organize the layout of the pages. It makes sure that header is on top, the main content (React Router's Outlet) is in the middle, and the footer is
 * at the bottom.
 * It manages mobile menu state and passes it to Header.
 *
 * @returns {JSX.Element} The rendered layout component.
 */
function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <Header
        toggleMenu={() => setIsOpen(!isOpen)}
        isOpen={isOpen}
        closeMenu={() => setIsOpen(false)}
      />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
