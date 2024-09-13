import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import {
  ArrowLeftIcon,
  InboxIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  KeyIcon,
  ComputerDesktopIcon,
  LockClosedIcon,
  UserCircleIcon,
  CalendarDaysIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon
} from "@heroicons/react/24/solid";
import logo from '../Assets/Logo.png';

const tokenKey = 'tokenKey';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [counts, setCounts] = useState(() => {
    const savedCounts = sessionStorage.getItem('counts');
    return savedCounts ? JSON.parse(savedCounts) : {
      totalUser: 0,
      totalDocument: 0,
      pendingDocument: 0,
      storageUsed: 0,
      totalBranches: 0,
      totalDepartment: 0,
      totalRoles: 0,
      documentType: 0,
      annualYear: 0,
      totalCategories: 0
    };
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const token = localStorage.getItem(tokenKey); // Get token from local storage
        const response = await axios.get('http://localhost:8080/Dashboard/GetAllCountsForDashBoard', {
          headers: { Authorization: `Bearer ${token}` } // Attach token in headers
        });
        setCounts(response.data);
        sessionStorage.setItem('counts', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error fetching dashboard counts:', error);
      }
    };

    if (!sessionStorage.getItem('counts')) {
      fetchCounts();
    }
  }, []);

  const [isCreateOpen, setCreateOpen] = useState(() => {
    return localStorage.getItem("isCreateOpen") === "true";
  });

  const [isDocumentOpen, setDocumentOpen] = useState(() => {
    return localStorage.getItem("isDocumentOpen") === "true";
  });

  const handleLogout = () => {
    localStorage.removeItem(tokenKey);
    sessionStorage.removeItem('counts');
    navigate("/auth");
  };

  const handleCreateToggle = () => {
    const newCreateOpenState = !isCreateOpen;
    setCreateOpen(newCreateOpenState);
    localStorage.setItem("isCreateOpen", newCreateOpenState);
  };

  const handleDocumentToggle = () => {
    const newDocumentOpenState = !isDocumentOpen;
    setDocumentOpen(newDocumentOpenState);
    localStorage.setItem("isDocumentOpen", newDocumentOpenState);
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

  const employeeType = localStorage.getItem('employeeType'); // Retrieve employeeType from local storage

  return (
    <div className="h-screen flex flex-col justify-between bg-rose-900 text-white w-52 p-1 transition-all duration-300">
      <div>
        <div className="flex items-center justify-center mb-2">
          <img className="flex w-32 h-32" src={logo} alt="DMS" />
        </div>
        <nav className="flex flex-col space-y-1">
          <hr className='border-t border-pink-800' />
          
          {employeeType === 'USER' && (
            <>
              <SidebarLink to="/" icon={InboxIcon} text="Dashboard" />
              <SidebarLink to="/all-documents" icon={DocumentTextIcon} text="All Documents" count={counts.totalDocument} />
              <SidebarLink to="/users" icon={UserGroupIcon} text="Users" count={counts.totalUser} />
            </>
          )}

          {employeeType === 'ADMIN' && (
            <>
              <SidebarLink to="/" icon={InboxIcon} text="Dashboard" />
              <div>
                <button
                  onClick={handleCreateToggle}
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
                    <SidebarLink to="/create-branch" icon={KeyIcon} text="Branch" count={counts.totalBranches} />
                    <hr className='border-t border-pink-800' />
                    <SidebarLink to="/create-department" icon={ComputerDesktopIcon} text="Department" count={counts.totalDepartment} />
                    <hr className='border-t border-pink-800' />
                    <SidebarLink to="/create-role" icon={UserCircleIcon} text="Role" count={counts.totalRoles} />
                    <hr className='border-t border-pink-800' />
                    <SidebarLink to="/create-type" icon={ClipboardDocumentListIcon} text="Type" count={counts.documentType} />
                    <hr className='border-t border-pink-800' />
                    <SidebarLink to="/create-year" icon={CalendarDaysIcon} text="Year" count={counts.annualYear} />
                    <hr className='border-t border-pink-800' />
                    <SidebarLink to="/create-category" icon={ShoppingCartIcon} text="Category" count={counts.totalCategories} />
                  </div>
                )}
              </div>
              <div>
                <button
                  onClick={handleDocumentToggle}
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
                    <SidebarLink to="/approve-documents" icon={LockClosedIcon} text="Approve Documents" count={counts.pendingDocument} />
                  </div>
                )}
              </div>
            </>
          )}

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
