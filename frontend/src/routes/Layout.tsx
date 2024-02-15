import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";

export default function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}
