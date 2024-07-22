import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  InboxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ArchiveBoxArrowDownIcon,
  KeyIcon,
  ComputerDesktopIcon,
  ArrowUpCircleIcon,
  DocumentChartBarIcon,
  LockClosedIcon
} from "@heroicons/react/24/solid";
import logo from '../Assets/Logo.png';

function Sidebar({messageCount = 762, userCount = 1872}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isDocumentOpen, setDocumentOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("Token");
    navigate("/auth");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "bg-pink-800 text-white"
      : "text-white hover:bg-pink-800 hover:text-white";

  return (
    <div className="h-screen flex flex-col justify-between bg-rose-900 text-white w-64 p-6">
      <div>
        <div className="flex items-center justify-center mb-4">
          <img
            className="flex w-40 h-40"
            src={logo}
            alt="DMS"
          />
        </div>
        <nav className="flex flex-col space-y-2">
          <Link
            to="/dashboard"
            className={`px-3 py-2 rounded-lg text-sm font-lg flex items-center border ${isActive(
              "/dashboard"
            )}`}
          >
            <InboxIcon className="h-6 w-6 mr-3" />
            Dashboard
          </Link>
          <Link
            to="/inbox"
            className={`px-3 py-2 rounded-lg text-sm font-lg flex items-center border ${isActive(
              "/inbox"
            )}`}
          >
            <ArchiveBoxArrowDownIcon className="h-6 w-6 mr-3" />
            Inbox
            {messageCount > 0 && (
              <span className=" ml-14 bg-red-600 text-white rounded-lg px-3 py-1 text-sm font-semibold">
                {messageCount}
              </span>
            )}
          </Link>
          <Link
            to="/users"
            className={`px-3 py-2 rounded-lg text-sm font-lg flex items-center border ${isActive(
              "/users"
            )}`}
          >
            <UserGroupIcon className="h-6 w-6 mr-3" />
            Users
            {userCount > 0 && (
              <span className=" ml-14 bg-red-600 text-white rounded-lg px-3 py-1 text-sm font-semibold">
                {userCount}
              </span>
            )}
          </Link>
          <div>
            <button
              onClick={() => setCreateOpen(!isCreateOpen)}
              className="w-full px-3 py-2 rounded-lg text-sm font-lg flex items-center justify-between border border-b text-white hover:bg-pink-800 hover:text-white"
            >
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-6 w-6 mr-3" />
                Create
              </div>
              {isCreateOpen ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
            </button>
            {isCreateOpen && (
              <div className="ml-6 flex flex-col space-y-2">
                <Link
                  to="/create-branch"
                  className={`px-3 py-2 rounded-lg text-sm font-lg flex items-center mt-2 border border${isActive(
                    "/create-branch"
                  )}`}
                >
                  <KeyIcon className="h-6 w-6 mr-3" />
                  Branch
                </Link>
                <Link
                  to="/create-department"
                  className={`px-3 py-2 rounded-lg text-sm font-lg flex mb-2 items-center border border${isActive(
                    "/create-department"
                  )}`}
                >
                  <ComputerDesktopIcon className="h-6 w-6 mr-3" />
                  Department
                </Link>
              </div>
            )}
          </div>
          <div>
            <button
              onClick={() => setDocumentOpen(!isDocumentOpen)}
              className="w-full px-3 py-2 rounded-lg text-sm font-lg flex items-center justify-between border border-b text-white hover:bg-pink-800 hover:text-white"
            >
              <div className="flex items-center">
                <DocumentTextIcon className="h-6 w-6 mr-3" />
                Document
              </div>
              {isDocumentOpen ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
            </button>
            {isDocumentOpen && (
              <div className="ml-6 flex flex-col space-y-2">
                <Link
                  to="/create-document"
                  className={`px-3 py-2 rounded-lg text-sm font-lg flex items-center mt-2 border border${isActive(
                    "/create-document"
                  )}`}
                >
                  <ArrowUpCircleIcon className="h-6 w-6 mr-3" />
                  Create
                </Link>
                <Link
                  to="/approve-documents"
                  className={`px-3 py-2 rounded-lg text-sm font-lg flex items-center border border${isActive(
                    "/approve-documents"
                  )}`}
                >
                  <LockClosedIcon className="h-6 w-6 mr-3" />
                  Approve Docs
                </Link>
                <Link
                  to="/all-documents"
                  className={`px-3 py-2 rounded-lg text-sm font-lg flex items-center border border${isActive(
                    "/all-documents"
                  )}`}
                >
                  <DocumentChartBarIcon className="h-6 w-6 mr-3" />
                  All Documents
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 rounded-lg text-sm font-lg flex items-center border border-b text-white hover:bg-pink-800 hover:text-white"
        >
          <ArrowLeftIcon className="h-6 w-6 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
