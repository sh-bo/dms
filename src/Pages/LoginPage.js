import React, { useState } from 'react';
import CandidateLogin from '../Components/CandidateLogin';
import AdminLogin from '../Components/AdminLogin';

const LoginPage = () => {
  const [selectedTab, setSelectedTab] = useState('Candidate');

  const handleLogin = (event) => {
    event.preventDefault();
    // Add your API login function here
    console.log('Logging in...');
  };

  return (
    <div className="relative min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-rose-800 shadow-lg rounded-xl p-5 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4 text-center text-rose-900">Log in to your account</h2>
        <div className="flex mb-4">
          <button
            className={`flex-1 py-2 text-sm text-center ${selectedTab === 'Candidate' ? 'border-b-4 border-rose-900' : 'text-rose-900'}`}
            onClick={() => setSelectedTab('Candidate')}
          >
            Candidate
          </button>
          <button
            className={`flex-1 py-2 text-sm text-center ${selectedTab === 'Admin' ? 'border-b-4 border-rose-900' : 'text-rose-900'}`}
            onClick={() => setSelectedTab('Admin')}
          >
            Admin
          </button>
        </div>
        <div>
          {selectedTab === 'Candidate' ? <CandidateLogin handleLogin={handleLogin} /> : <AdminLogin handleLogin={handleLogin} />}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
