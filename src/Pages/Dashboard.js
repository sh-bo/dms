import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../Components/Sidebar';
import Header from '../Components/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { CalendarDaysIcon, ComputerDesktopIcon, DocumentArrowDownIcon, DocumentChartBarIcon, DocumentMagnifyingGlassIcon, KeyIcon, ServerStackIcon, ShoppingCartIcon, UserCircleIcon, UsersIcon } from '@heroicons/react/24/solid';

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
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
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8080/Dashboard/GetAllCountsForDashBoard');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    fetchStats();
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const barChartData = [
    { name: 'Jan', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Feb', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Mar', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Apr', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'May', uv: 1890, pv: 4800, amt: 2181 },
  ];

  const lineChartData = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  ];

  function StatBlock({ title, value, Icon }) {
    return (
      <div className="bg-white p-3 rounded-r-lg shadow flex items-center justify-between border-l-4 border-rose-800">
        <div>
          <h3 className="text-md font-semibold text-gray-700">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className="w-8 h-8 text-rose-900" />
      </div>
    );
  }

  return (
    <div className='flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden'>
      {sidebarOpen && <Sidebar />}
      <div className='flex flex-col flex-1'>
        <Header toggleSidebar={toggleSidebar} />
        <div className='flex-1 p-4 min-h-0 overflow-auto'>
          <h2 className="text-xl mb-4 font-semibold">DASHBOARD</h2>

          <div className="grid grid-cols-5 gap-4 mb-6">
            <StatBlock title="Total Users" value={stats.totalUser} Icon={UsersIcon} />
            <StatBlock title="Total Documents" value={stats.totalDocument} Icon={DocumentArrowDownIcon} />
            <StatBlock title="Pending Documents" value={stats.pendingDocument} Icon={DocumentMagnifyingGlassIcon} />
            <StatBlock title="Storage Used" value={`150 GB`} Icon={ServerStackIcon} />
            <StatBlock title="Total Branches" value={stats.totalBranches} Icon={KeyIcon} />
            <StatBlock title="Total Departments" value={stats.totalDepartment} Icon={ComputerDesktopIcon} />
            <StatBlock title="Total Roles" value={stats.totalRoles} Icon={UserCircleIcon} />
            <StatBlock title="Document Types" value={stats.documentType} Icon={DocumentChartBarIcon} />
            <StatBlock title="Annual Years" value={stats.annualYear} Icon={CalendarDaysIcon} />
            <StatBlock title="Total Categories" value={stats.totalCategories} Icon={ShoppingCartIcon} />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2 bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Monthly Document Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="pv" fill="#8884d8" />
                  <Bar dataKey="uv" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-2">Document Traffic Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
