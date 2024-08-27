import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { BRANCH_API } from '../API/apiConfig';

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    isActive: true, // Default to true for active
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [toggleBranch, setToggleBranch] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [branchToDelete, setBranchToDelete] = useState(null);

  // Retrieve token from localStorage
  const token = localStorage.getItem('tokenKey');

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${BRANCH_API}/findAll`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddBranch = async () => {
    if (formData.name && formData.address) {
      try {
        const newBranch = {
          ...formData,
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
          isActive: formData.isActive ? 1 : 0,
        };
        const response = await axios.post(`${BRANCH_API}/save`, newBranch, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setBranches([...branches, response.data]);
        setFormData({ name: '', address: '', isActive: true }); // Reset with default isActive true
        alert('Branch added successfully!');
      } catch (error) {
        console.error('Error adding branch:', error);
        alert('Failed to add the Branch. Please try again.');
      }
    } else {
      console.error('Form data is incomplete');
    }
  };

  const handleEditBranch = (index) => {
    setEditingIndex(index);
    setFormData(branches[index]);
  };

  const handleSaveEdit = async () => {
    if (formData.name && formData.address) {
      try {
        const updatedBranch = {
          ...formData,
          updatedOn: new Date().toISOString(),
          isActive: formData.isActive ? 1 : 0,
        };
        const response = await axios.put(`${BRANCH_API}/update/${formData.id}`, updatedBranch, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        const updatedBranches = branches.map((branch, index) =>
          index === editingIndex ? response.data : branch
        );
        setBranches(updatedBranches);
        setFormData({ name: '', address: '', isActive: true }); // Reset with default isActive true
        setEditingIndex(null);
        alert('Branch updated successfully!');
      } catch (error) {
        console.error('Error updating branch:', error);
        alert('Failed to update the Branch. Please try again.');
      }
    } else {
      console.error('Form data is incomplete');
    }
  };

  const handleDeleteBranch = (index) => {
    setBranchToDelete(branches[index]);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirmed = async (id) => {
    try {
      await axios.delete(`${BRANCH_API}/delete/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const updatedBranches = branches.filter(branch => branch.id !== id);
      setBranches(updatedBranches);
      setDeleteModalVisible(false);
      setBranchToDelete(null);
      alert('Branch deleted successfully!');
    } catch (error) {
      console.error('Error deleting branch:', error);
      alert('Failed to delete the Branch. Please try again.');
    }
  };

  const handleToggleActive = (branch) => {
    setToggleBranch(branch);
    setModalVisible(true);
  };

  const confirmToggleActiveStatus = async () => {
    if (toggleBranch) {
      try {
        const updatedBranch = {
          ...toggleBranch,
          isActive: toggleBranch.isActive === 1 ? 0 : 1,
          updatedOn: new Date().toISOString(),
        };
        const response = await axios.put(
          `${BRANCH_API}/updateStatus/${updatedBranch.id}?isActive=${updatedBranch.isActive}`,
          null,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        const updatedBranches = branches.map(branch =>
          branch.id === updatedBranch.id ? response.data : branch
        );
        setBranches(updatedBranches);
        setModalVisible(false);
        setToggleBranch(null);
        alert('Status changed successfully!');
      } catch (error) {
        console.error('Error toggling branch status:', error);
        alert('Failed to change the Status. Please try again.');
      }
    } else {
      console.error('No branch selected for status toggle');
    }
  };

  const filteredBranches = branches.filter(branch =>
    Object.values(branch).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalItems = filteredBranches.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedBranches = filteredBranches.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Function to format date and time in Indian format
  const formatDateTime = (dateTime) => {
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata'
    };
    return new Date(dateTime).toLocaleString('en-IN', options);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4 font-semibold">Branches</h1>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        {/* Form Section */}
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
            <input
              type="text"
              placeholder="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            />
          </div>
          <div className="mt-3 flex justify-start">
            {editingIndex === null ? (
              <button onClick={handleAddBranch} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Add Branch
              </button>
            ) : (
              <button onClick={handleSaveEdit} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
                <CheckCircleIcon className="h-5 w-5 mr-1" /> Update
              </button>
            )}
          </div>
        </div>

        {/* Search and Items Per Page Section */}
        <div className="mb-4 bg-slate-100 p-4 rounded-lg flex justify-between items-center">
          <div className="flex items-center bg-blue-500 rounded-lg">
            <label htmlFor="itemsPerPage" className="mr-2 ml-2 text-white text-sm">Show:</label>
            <select
              id="itemsPerPage"
              className="border rounded-r-lg p-1.5 outline-none"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {[5, 10, 15, 20].map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Branch"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border rounded-lg pl-10 outline-none"
            />
            <MagnifyingGlassIcon className="absolute top-2 left-2 h-5 w-5 text-gray-500" />
          </div>
        </div>

        {/* Branches Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-2 text-left">SR.</th>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-left">Address</th>
                <th className="border p-2 text-left">Created On</th>
                <th className="border p-2 text-left">Updated On</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Edit</th>
                <th className="border p-2 text-left">Access</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBranches.map((branch, index) => (
                <tr key={branch.id}>
                  <td className="border p-2">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td className="border p-2">{branch.name}</td>
                  <td className="border p-2">{branch.address}</td>
                  <td className="border p-2">{formatDateTime(branch.createdOn)}</td>
                  <td className="border p-2">{formatDateTime(branch.updatedOn)}</td>
                  <td className="border p-2">{branch.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="border p-2 text-center">
                    <button onClick={() => handleEditBranch((currentPage - 1) * itemsPerPage + index)}>
                      <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleToggleActive(branch)}
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

        {/* Pagination */}
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
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
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

      {/* Toggle Active Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Status Change</h2>
            <p className="mb-4">Are you sure you want to {toggleBranch.isActive ? 'deactivate' : 'activate'} this branch?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setModalVisible(false)} className="bg-gray-300 p-2 rounded-lg">Cancel</button>
              <button onClick={confirmToggleActiveStatus} className="bg-blue-500 text-white p-2 rounded-lg">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal
      {deleteModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this branch?</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setDeleteModalVisible(false)} className="bg-gray-300 p-2 rounded-lg">Cancel</button>
              <button onClick={() => handleDeleteConfirmed(branchToDelete.id)} className="bg-red-500 text-white p-2 rounded-lg">Confirm</button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Branch;
