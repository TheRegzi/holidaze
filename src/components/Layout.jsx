import { useState } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

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
