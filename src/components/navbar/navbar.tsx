import { Outlet } from "react-router-dom";
import Conversations from "../conversations/conversation";

export default function Navbar() {
  return (
    <div className="flex flex-1 min-h-screen">
      <Conversations />
      <Outlet />
    </div>
  );
}
