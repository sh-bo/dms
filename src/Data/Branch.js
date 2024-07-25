import { ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

const Branch = () => {
  const [branches, setBranches] = useState([
    { id: 1, branchName: 'Main Branch', address: '123 Main St', isActive: true },
    { id: 2, branchName: 'Secondary Branch', address: '456 Elm St', isActive: false },
    { id: 3, branchName: 'East Branch', address: '789 Oak St', isActive: true },
    { id: 4, branchName: 'West Branch', address: '101 Pine St', isActive: false },
    { id: 5, branchName: 'North Branch', address: '202 Maple St', isActive: true },
    { id: 6, branchName: 'Main Branch', address: '123 Main St', isActive: true },
    { id: 7, branchName: 'Secondary Branch', address: '456 Elm St', isActive: false },
    { id: 8, branchName: 'East Branch', address: '789 Oak St', isActive: true },
    { id: 9, branchName: 'West Branch', address: '101 Pine St', isActive: false },
    { id: 10, branchName: 'North Branch', address: '202 Maple St', isActive: true },
  ]);

  const [branchName, setBranchName] = useState('');
  const [address, setAddress] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [branchToToggle, setBranchToToggle] = useState(null);

  const handleAddBranch = () => {
    if (branchName && address) {
      const newBranch = { id: Date.now(), branchName, address, isActive: true };
      setBranches([...branches, newBranch]);
      setBranchName('');
      setAddress('');
    }
  };

  const handleEditBranch = (index) => {
    setEditingIndex(index);
    setBranchName(branches[index].branchName);
    setAddress(branches[index].address);
  };

  const handleSaveEdit = () => {
    if (branchName && address) {
      const updatedBranches = branches.map((branch, index) =>
        index === editingIndex ? { ...branch, branchName, address } : branch
      );
      setBranches(updatedBranches);
      setBranchName('');
      setAddress('');
      setEditingIndex(null);
    }
  };

  const handleToggleActive = (branch) => {
    setBranchToToggle(branch);
    setModalVisible(true);
  };

  const confirmToggleActive = () => {
    const updatedBranches = branches.map(branch =>
      branch.id === branchToToggle.id ? { ...branch, isActive: !branch.isActive } : branch
    );
    setBranches(updatedBranches);
    setModalVisible(false);
    setBranchToToggle(null);
  };

  const filteredBranches = branches.filter(branch =>
    branch.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = filteredBranches.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedBranches = filteredBranches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-1">
      <h1 className="text-xl mb-4 font-semibold">ADD BRANCHES</h1>
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <div className="mb-4 bg-slate-100 p-4 rounded-lg">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Branch Name"
              value={branchName}
              onChange={(e) => setBranchName(e.target.value)}
              className="p-2 border rounded-md outline-none flex-grow"
            />
            <input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="p-2 border rounded-md outline-none flex-grow"
            />
            {editingIndex === null ? (
              <button onClick={handleAddBranch} className="bg-blue-500 text-white rounded-md p-2 flex items-center justify-center">
                <PlusIcon className="h-5 w-5 mr-2" /> Add Branch
              </button>
            ) : (
              <button onClick={handleSaveEdit} className="bg-green-500 text-white rounded-md p-2 flex items-center justify-center">
                Save
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 bg-slate-100 p-4 rounded-lg">
          <div className="flex justify-between">
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
        </div>

        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-slate-100">
              <th className="border p-2 text-left">SR.</th>
              <th className="border p-2 text-left">Branch Name</th>
              <th className="border p-2 text-left">Address</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBranches.map((branch, index) => (
              <tr key={branch.id}>
                <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="border p-2">{branch.branchName}</td>
                <td className="border p-2">{branch.address}</td>
                <td className="border p-2">{branch.isActive ? 'Active' : 'Inactive'}</td>
                <td className="border p-2">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleEditBranch(index)}>
                      <PencilIcon className="h-5 w-5 text-blue-500" />
                    </button>
                    <button
                      onClick={() => handleToggleActive(branch)}
                      className={`px-2 py-1 rounded-md text-white ${branch.isActive ? 'bg-red-500' : 'bg-green-500'}`}
                    >
                      {branch.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-start items-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-slate-200 px-3 py-1 rounded mr-3"
          >
            <ArrowLeftIcon className="inline h-4 w-4 mr-2 mb-1" />
            Previous
          </button>
          <span className="text-blue-500 font-semibold">Page {currentPage}</span>
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

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h3 className="text-xl mb-4">Confirm Toggle Status</h3>
            <p>Are you sure you want to {branchToToggle?.isActive ? 'deactivate' : 'activate'} the status of the branch "{branchToToggle?.branchName}"?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={() => setModalVisible(false)}
                className="p-2 bg-gray-400 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleActive}
                className="p-2 bg-blue-500 text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Branch;