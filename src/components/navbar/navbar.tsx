import { useQuery } from "@tanstack/react-query";
import { Link, Outlet } from "react-router-dom";
import Conversations from "../conversations/conversation";
import ProfileButton from "../profile-button/profile-button";
import { fetchProfile } from "@/api/profile/profile";

export default function Navbar() {
  const query = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  return (
    <div className="flex flex-col min-h-screen">
      <div className="border-b border-r-border p-2">
        <div className="flex justify-between items-center mx-auto w-full">
          <nav className="flex space-x-4">
            <Link to="/" className="text-lg font-semibold">
              Home
            </Link>
            <Link to="/about" className="text-lg font-semibold">
              About
            </Link>
          </nav>
          {query.data && query.data.profile && (
            <ProfileButton firstName={query.data.profile.firstName} lastName={query.data.profile.lastName} />
          )}
        </div>
      </div>
      <div className="flex flex-1">
        <Conversations />
        <Outlet />
      </div>
    </div>
  );
}
