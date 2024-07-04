import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  Cog6ToothIcon,
  InboxIcon
} from "@heroicons/react/24/solid";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/auth");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-slate-800 text-white"
      : "text-gray-200 hover:bg-slate-700 hover:text-white";

  return (
    <div className="h-screen flex flex-col justify-between bg-slate-900 text-white w-64 p-6">
      <div>
        <div className="flex items-center justify-center mb-10">
          <img
            className="h-7 w-auto filter invert"
            src="https://data.gov.in/_nuxt/img/logo.f9fcba1.svg"
            alt="Intek"
          />
          <h2 className="ml-4 mt-1 font-light">DMS Portal</h2>
        </div>
        <nav className="flex flex-col space-y-2">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-lg flex items-center ${isActive(
              "/"
            )}`}
          >
            <InboxIcon className="h-6 w-6 mr-3" />
            Upload Document
          </Link>
        </nav>
      </div>
      <div>
        <nav className="flex flex-col space-y-2">
          <Link
            to="/portal/admin/settings"
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${isActive(
              "/portal/admin/settings"
            )}`}
          >
            <Cog6ToothIcon className="h-6 w-6 mr-3" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-300 bg-rose-700 border border-gray-600 hover:bg-rose-600 hover:text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
          >
            <ArrowLeftIcon className="h-6 w-6 mr-2" />
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar;
