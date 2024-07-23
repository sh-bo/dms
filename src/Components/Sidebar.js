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
  DocumentChartBarIcon,
  LockClosedIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/solid";
import logo from '../Assets/Logo.png';

function Sidebar({ messageCount = 762, userCount = 1872, branchCount = 180, departmentCount = 1692, documentCount = 10540, roleCount = 10, yearCount = 12, categoryCount = 268, typeCount  = 128 }) {
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
      ? "bg-pink-950 text-white"
      : "text-white hover:bg-pink-950 hover:text-white";

  const SidebarLink = ({ to, icon: Icon, text, count }) => (
    <Link
      to={to}
      className={`px-3 py-1 rounded-lg text-xs font-lg flex items-center justify-between ${isActive(to)}`}
    >
      <div className="flex items-center">
        <Icon className="h-5 w-5 mr-3" />
        <span>{text}</span>
      </div>
      {count > 0 && (
        <span className="bg-red-600 text-white rounded-2xl px-2 py-1 text-xs font-semibold">
          {count}
        </span>
      )}
    </Link>
  );

  return (
    <div className="h-screen flex flex-col justify-between bg-rose-900 text-white w-52 p-1 transition-all duration-300">
      <div>
        <div className="flex items-center justify-center mb-2">
          <img
            className="flex w-32 h-32"
            src={logo}
            alt="DMS"
          />
        </div>
        <nav className="flex flex-col space-y-1">
          <hr className='border-t border-pink-800' />
          <SidebarLink to="/" icon={InboxIcon} text="Dashboard" />
          <hr className='border-t border-pink-800' />
          <SidebarLink to="/inbox" icon={ArchiveBoxArrowDownIcon} text="Inbox" count={messageCount} />
          <hr className='border-t border-pink-800' />
          <SidebarLink to="/users" icon={UserGroupIcon} text="Users" count={userCount} />
          <hr className='border-t border-pink-800' />
          <div>
            <button
              onClick={() => setCreateOpen(!isCreateOpen)}
              className="w-full px-3 py-1 rounded-lg text-xs flex items-center justify-between text-white hover:bg-pink-950 hover:text-white"
            >
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-3" />
                Organisation
              </div>
              {isCreateOpen ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
            </button>
            {isCreateOpen && (
              <div className="ml-2 flex flex-col space-y-1">
                <hr className='border-t border-pink-800 mt-1' />
                <SidebarLink to="/create-branch" icon={KeyIcon} text="Branch" count={branchCount} />
                <hr className='border-t border-pink-800' />
                <SidebarLink to="/create-department" icon={ComputerDesktopIcon} text="Department" count={departmentCount} />
                <hr className='border-t border-pink-800' />
                <SidebarLink to="/create-role" icon={UserCircleIcon} text="Role" count={roleCount} />
                <hr className='border-t border-pink-800' />
                <SidebarLink to="/create-type" icon={ClipboardDocumentListIcon} text="Type" count={typeCount} />
                <hr className='border-t border-pink-800' />
                <SidebarLink to="/create-year" icon={CalendarDaysIcon} text="Year" count={yearCount} />
                <hr className='border-t border-pink-800' />
                <SidebarLink to="/create-category" icon={ShoppingCartIcon} text="Category" count={categoryCount} />
              </div>
            )}
          </div>
          <hr className='border-t border-pink-800' />
          <div>
            <button
              onClick={() => setDocumentOpen(!isDocumentOpen)}
              className="w-full px-3 py-1 rounded-lg text-xs font-lg flex items-center justify-between text-white hover:bg-pink-950 hover:text-white"
            >
              <div className="flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-3" />
                Document
              </div>
              {isDocumentOpen ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRightIcon className="h-4 w-4" />}
            </button>
            {isDocumentOpen && (
              <div className="ml-2 flex flex-col space-y-1">
                <hr className='border-t border-pink-800 mt-1' />
                <SidebarLink to="/all-documents" icon={DocumentChartBarIcon} text="All Documents" count={documentCount} />
                <hr className='border-t border-pink-800' />
                <SidebarLink to="/approve-documents" icon={LockClosedIcon} text="Approve Documents" />
              </div>
            )}
          </div>
          <hr className='border-t border-pink-800' />
        </nav>
      </div>
      <div>
        <hr className='border-t border-pink-800 mb-1' />
        <button
          onClick={handleLogout}
          className="w-full px-3 py-1 rounded-lg text-xs font-lg flex items-center text-white hover:bg-pink-950 hover:text-white"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-3" />
          Logout
        </button>
        <hr className='border-t border-pink-800 mb-0.5 my-1' />
      </div>
    </div>
  );
}

export default Sidebar;