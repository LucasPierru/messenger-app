import { Link, Outlet } from "react-router-dom";
import Conversations from "../conversations/conversation";

export default function Navbar() {
  return (
    <div className="flex flex-col min-h-screen">
      <nav className="border-b border-r-[rgba(255,255,255,0.5)] p-2">
        <Link to="/" className="text-lg">
          Home
        </Link>
        <Link to="/about" className="text-lg">
          About
        </Link>
      </nav>
      <div className="flex flex-1">
        <Conversations />
        <Outlet />
      </div>
    </div>
  );
}
