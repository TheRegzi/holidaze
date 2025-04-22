import { Outlet } from "react-router-dom";
import Header from "./Header";

function Layout() {
  return (
    <div>
      <div>
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
