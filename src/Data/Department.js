import {
    ArrowLeftIcon,
    ArrowRightIcon,
    CheckCircleIcon,
    LockClosedIcon,
    LockOpenIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    PlusCircleIcon,
    TrashIcon
  } from '@heroicons/react/24/solid';
  import React, { useState } from 'react';
  
  const Department = () => {
    const [branches, setBranches] = useState([
      { id: 1, name: 'John Doe', branch: 'Main Branch', createdOn: '2024-01-01', updatedOn: '2024-01-15', isActive: true },
      { id: 2, name: 'Jane Smith', branch: 'Secondary Branch', createdOn: '2024-01-02', updatedOn: '2024-01-16', isActive: true },
      { id: 3, name: 'Alice Johnson', branch: 'East Branch', createdOn: '2024-01-03', updatedOn: '2024-01-17', isActive: false },
      { id: 4, name: 'Bob Wilson', branch: 'West Branch', createdOn: '2024-01-04', updatedOn: '2024-01-18', isActive: true },
      { id: 5, name: 'Carol Martinez', branch: 'North Branch', createdOn: '2024-01-05', updatedOn: '2024-01-19', isActive: false }
    ]);
  
    const [formData, setFormData] = useState({
      name: '',
      branch: '',
    });
  
    const [searchTerm, setSearchTerm] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
  
    const branchOptions = ['Main Branch', 'Secondary Branch', 'East Branch', 'West Branch', 'North Branch', 'South Branch'];
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleAddBranch = () => {
      if (Object.values(formData).every(value => value)) {
        const newBranch = {
          id: Date.now(),
          ...formData,
          createdOn: new Date().toISOString().split('T')[0],
          updatedOn: new Date().toISOString().split('T')[0],
          isActive: true,
        };
        setBranches([...branches, newBranch]);
        setFormData({
          name: '',
          branch: '',
        });
      }
    };
  
    const handleEditBranch = (index) => {
      setEditingIndex(index);
      setFormData(branches[index]);
    };
  
    const handleSaveEdit = () => {
      if (Object.values(formData).every(value => value)) {
        const updatedBranches = branches.map((branch, index) =>
          index === editingIndex ? { ...branch, ...formData, updatedOn: new Date().toISOString().split('T')[0] } : branch
        );
        setBranches(updatedBranches);
        setFormData({
          name: '',
          branch: '',
        });
        setEditingIndex(null);
      }
    };
  
    const handleDeleteBranch = (index) => {
      const updatedBranches = branches.filter((_, i) => i !== index);
      setBranches(updatedBranches);
    };
  
    const handleToggleActive = (index) => {
      const updatedBranches = branches.map((branch, i) =>
        i === index ? { ...branch, isActive: !branch.isActive, updatedOn: new Date().toISOString().split('T')[0] } : branch
      );
      setBranches(updatedBranches);
    };
  
    const filteredBranches = branches.filter(branch =>
      Object.values(branch).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  
    const totalItems = filteredBranches.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedBranches = filteredBranches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
    return (
      <div className="p-1">
        <h1 className="text-xl mb-4 font-semibold">DEPARTMENTS</h1>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <div className="mb-4 bg-slate-100 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="p-2 border rounded-md outline-none"
              />
              <select
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                className="p-2 border rounded-md outline-none"
              >
                <option value="">Select Branch</option>
                {branchOptions.map((branch, index) => (
                  <option key={index} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
            <div className="mt-3 flex justify-start">
              {editingIndex === null ? (
                <button onClick={handleAddBranch} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
                  <PlusCircleIcon className="h-5 w-5 mr-1" /> Add Department
                </button>
              ) : (
                <button onClick={handleSaveEdit} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
                  <CheckCircleIcon className="h-5 w-5 mr-1" /> Save
                </button>
              )}
            </div>
          </div>
  
          <div className="mb-4 bg-slate-100 p-4 rounded-lg flex justify-between items-center">
            <div className="flex items-center bg-blue-500 rounded-lg">
              <label htmlFor="itemsPerPage" className="mr-2 ml-2 text-white text-sm">Show:</label>
              <select
                id="itemsPerPage"
                className="border rounded-r-lg p-1.5 outline-none"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                {[5, 10, 15, 20].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Search..."
                className="border rounded-l-md p-1 outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="text-white bg-blue-500 rounded-r-lg h-8 w-8 border p-1.5" />
            </div>
          </div>
  
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-slate-100">
                  <th className="border p-2 text-left">SR.</th>
                  <th className="border p-2 text-left">Name</th>
                  <th className="border p-2 text-left">Branch</th>
                  <th className="border p-2 text-left">Created On</th>
                  <th className="border p-2 text-left">Updated On</th>
                  <th className="border p-2 text-left">Edit</th>
                  <th className="border p-2 text-left">Delete</th>
                  <th className="border p-2 text-left">Access</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBranches.map((branch, index) => (
                  <tr key={branch.id}>
                    <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td className="border p-2">{branch.name}</td>
                    <td className="border p-2">{branch.branch}</td>
                    <td className="border p-2">{branch.createdOn}</td>
                    <td className="border p-2">{branch.updatedOn}</td>
                    <td className="border p-2">
                      <button onClick={() => handleEditBranch(index)}>
                        <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
                      </button>
                    </td>
                    <td className="border p-2">
                      <button onClick={() => handleDeleteBranch(index)}>
                        <TrashIcon className="h-6 w-6 text-white bg-red-500 rounded-xl p-1" />
                      </button>
                    </td>
                    <td className="border p-2">
                      <button
                        onClick={() => handleToggleActive(index)}
                        className={`p-1 rounded-full ${branch.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                      >
                        {branch.isActive ? (
                          <LockOpenIcon className="h-5 w-5 text-white p-0.5" />
                        ) : (
                          <LockClosedIcon className="h-5 w-5 text-white p-0.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
  
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} entries
              </span>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="bg-slate-200 px-3 py-1 rounded mr-3"
              >
                <ArrowLeftIcon className="inline h-4 w-4 mr-2 mb-1" />
                Previous
              </button>
              <span className="text-blue-500 font-semibold">Page {currentPage} of {totalPages}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="bg-slate-200 px-3 py-1 rounded ml-3"
              >
                Next
                <ArrowRightIcon className="inline h-4 w-4 ml-2 mb-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Department;
  