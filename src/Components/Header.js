import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Cog6ToothIcon, PowerIcon } from '@heroicons/react/24/solid';

function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('Token');
    navigate('/auth');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <header className="bg-slate-900 text-white p-4 flex justify-between items-center">
      <div className='flex'>
        <h2 className='font-light'>In Development : v1.0.0</h2>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleSettings}
          className="text-gray-300 hover:text-white p-2 rounded-lg flex items-center transition duration-200"
        >
          <Cog6ToothIcon className="h-6 w-6" />
        </button>
        <button
          onClick={handleLogout}
          className="text-gray-300 bg-rose-700 border border-gray-600 hover:bg-rose-600 hover:text-white px-2 py-2 rounded-lg text-sm font-medium flex items-center shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
        >
          <PowerIcon className="h-6 w-6"/>
        </button>
      </div>
    </header>
  );
}

export default Header;
