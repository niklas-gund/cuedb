import { NavLink } from "react-router-dom";
import LogoSVG from "../../assets/logo.svg";

export default function Navbar() {
  const navLinkActiveClass = (r: { isActive: boolean }) =>
    r.isActive ? "text-amber" : "";
  return (
    <nav className="w-full  bg-gradient-to-r from-navy-950 to-navy-900 p-4 text-white font-bold uppercase text-lg">
      <div className="flex gap-6 container mx-auto items-center">
        <NavLink to="/">
          <img className="w-24" src={LogoSVG} alt="logo" />
        </NavLink>
        <div className="mx-auto" />
        <NavLink className={navLinkActiveClass} to="/about">
          About
        </NavLink>
        <NavLink className={navLinkActiveClass} to="/login">
          Login
        </NavLink>
      </div>
    </nav>
  );
}
