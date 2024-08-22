import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon
} from '@heroicons/react/24/solid';
import axios from 'axios';

const tokenKey = 'tokenKey'; // Your token key in localStorage
const API_URL = 'http://localhost:8080/branchmaster';

const Branch = () => {
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    address: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const token = localStorage.getItem(tokenKey);
      const response = await axios.get(`${API_URL}/findAll`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
      setError('Failed to fetch branches. Please check your authorization.');
    }
  };

  const fetchBranchById = async (id) => {
    try {
      const token = localStorage.getItem(tokenKey);
      const response = await axios.get(`${API_URL}/findById/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching branch by ID:', error);
      setError('Failed to fetch branch. Please check your authorization.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddBranch = async () => {
    if (formData.name && formData.address) {
      try {
        const token = localStorage.getItem(tokenKey);
        const newBranch = {
          ...formData,
          createdOn: new Date().toISOString().split('T')[0],
          updatedOn: new Date().toISOString().split('T')[0],
        };

        const response = await axios.post(`${API_URL}/save`, newBranch, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBranches([...branches, response.data]);
        setFormData({ name: '', address: '' });
        setError('');
      } catch (error) {
        console.error('Error adding branch:', error);
        setError('Failed to add branch. Please check your authorization.');
      }
    } else {
      setError('All fields are required.');
    }
  };

  const handleEditBranch = async (index) => {
    setEditingIndex(index);
    const branchId = branches[index].id;
    await fetchBranchById(branchId);
  };

  const handleSaveEdit = async () => {
    if (Object.values(formData).every(value => value)) {
      try {
        const token = localStorage.getItem(tokenKey);
        const updatedBranch = {
          ...formData,
          updatedOn: new Date().toISOString().split('T')[0],
        };
        const response = await axios.put(`${API_URL}/update/${formData.id}`, updatedBranch, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedBranches = branches.map((branch, index) =>
          index === editingIndex ? response.data : branch
        );
        setBranches(updatedBranches);
        setFormData({ id: null, name: '', address: '' });
        setEditingIndex(null);
      } catch (error) {
        console.error('Error updating branch:', error);
        setError('Failed to update branch. Please check your authorization.');
      }
    }
  };

  const handleDeleteBranch = async (index) => {
    try {
      const token = localStorage.getItem(tokenKey);
      await axios.delete(`${API_URL}/delete/${branches[index].id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedBranches = branches.filter((_, i) => i !== index);
      setBranches(updatedBranches);
    } catch (error) {
      console.error('Error deleting branch:', error);
      setError('Failed to delete branch. Please check your authorization.');
    }
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
      <h1 className="text-xl mb-4 font-semibold">BRANCH</h1>
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
                <th className="border p-2 text-left">BRANCH</th>
                <th className="border p-2 text-left">Address</th>
                <th className="border p-2 text-left">Created On</th>
                <th className="border p-2 text-left">Updated On</th>
                <th className="border p-2 text-left">Edit</th>
                <th className="border p-2 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBranches.map((branch, index) => (
                <tr key={branch.id}>
                  <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border p-2">{branch.name}</td>
                  <td className="border p-2">{branch.address}</td>
                  <td className="border p-2">{branch.createdOn}</td>
                  <td className="border p-2">{branch.updatedOn}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEditBranch((currentPage - 1) * itemsPerPage + index)} className="text-blue-500">
                      <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleDeleteBranch((currentPage - 1) * itemsPerPage + index)} className="text-red-500">
                      <TrashIcon className="h-6 w-6 text-white bg-red-400 rounded-xl p-1" />
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
      {error && <div className="text-red-500 mt-4">{error}</div>}
    </div>
  );
};

export default Branch;
