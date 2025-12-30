import { pb } from "@/api/apiClient";
import { Link } from "@tanstack/react-router";
import SearchBar from "./SearchBar";
import { Menu } from "lucide-react";

export default function PageHeader() {
  return (
    <div className="h-16 border-b fade ">
      <nav className="container mx-auto px-4 flex h-full items-center gap-2">
        <div>
          <span className="md:hidden">SRU</span>
          <span className="hidden md:inline">StuffsAreUs</span>
        </div>
        <div className="ml-auto space-x-2 hidden md:block">
          <Link to="/auth/login" className="btn btn-primary">
            Login
          </Link>
          <button className="btn btn-accent btn-soft ring fade">Signup</button>
        </div>
        <label
          htmlFor="my-drawer-3"
          className="btn btn-square btn-ghost ring  fade ml-auto md:hidden drawer-button lg:hidden"
        >
          <Menu />
        </label>
      </nav>
    </div>
  );
}
