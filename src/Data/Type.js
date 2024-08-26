import { TYPE_API } from '../API/apiConfig';
import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, PencilIcon, PlusCircleIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const tokenKey = 'tokenKey'; // Correct token key name

const Type = () => {
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState(null);

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get(`${TYPE_API}/findAll`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
          },
        });
        setTypes(response.data);
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };
    fetchTypes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Allow only letters and spaces
    const regex = /^[A-Za-z\s]*$/;
  
    if (regex.test(value) || value === "") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleAddType = async () => {
    if (formData.name.trim()) {
      try {
        const response = await axios.post(`${TYPE_API}/save`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
          },
        });
        setTypes([...types, response.data]);
        setFormData({ name: '' });
        alert('Type added successfully!');
      } catch (error) {
        console.error('Error adding type:', error.response ? error.response.data : error.message);
        alert('Failed to adding the type. Please try again.'); 
      }
    }
  };

  const handleEditType = (index) => {
    setEditingIndex(index);
    setFormData({ name: types[index].name });
  };

  const handleSaveEdit = async () => {
    if (formData.name.trim()) {
      try {
        const updatedType = {
          ...types[editingIndex],
          name: formData.name,
          updatedOn: new Date().toISOString(),
        };
        const response = await axios.put(`${TYPE_API}/update/${updatedType.id}`, updatedType, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
          },
        });
        const updatedTypes = types.map((type, index) =>
          index === editingIndex ? response.data : type
        );
        setTypes(updatedTypes);
        setFormData({ name: '' });
        setEditingIndex(null);
        alert('Type updated successfully!');
      } catch (error) {
        console.error('Error updating type:', error.response ? error.response.data : error.message);
        alert('Failed to updating the type. Please try again.'); 
      }
    }
  };

  const handleDeleteType = (index) => {
    setTypeToDelete(types[index]); // Set the type to delete
    setDeleteModalVisible(true); // Show the delete modal
  };

  const handleDeleteConfirmed = async () => {
    if (typeToDelete) {
      try {
        const token = localStorage.getItem(tokenKey); // Retrieve token from local storage
        await axios.delete(`${TYPE_API}/delete/${typeToDelete.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const updatedTypes = types.filter(type => type.id !== typeToDelete.id);
        setTypes(updatedTypes);
        setDeleteModalVisible(false); // Close the delete modal
        setTypeToDelete(null); // Clear the type to delete
        alert('Type Deleted successfully!');
      } catch (error) {
        console.error('Error deleting type:', error.response ? error.response.data : error.message);
        alert('Failed to deleting the type. Please try again.'); 
      }
    } else {
      console.error('No type selected for deletion');
    }
  };
  
  const filteredTypes = types.filter(type =>
    Object.values(type).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalItems = filteredTypes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedTypes = filteredTypes.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-1">
      <h1 className="text-xl mb-4 font-semibold">TYPES</h1>
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <div className="mb-4 bg-slate-100 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            />
          </div>
          <div className="mt-3 flex justify-start">
            {editingIndex === null ? (
              <button onClick={handleAddType} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Add Type
              </button>
            ) : (
              <button onClick={handleSaveEdit} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
                <CheckCircleIcon className="h-5 w-5 mr-1" /> Update
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
                <th className="border p-2 text-left">Sr</th>
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-left">Created On</th>
                <th className="border p-2 text-left">Updated On</th>
                <th className="border p-2 text-left">Edit</th>
                <th className="border p-2 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTypes.map((type, index) => (
                <tr key={type.id}>
                  <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border p-2">{type.name}</td>
                  <td className="border p-2">{type.createdOn}</td>
                  <td className="border p-2">{type.updatedOn}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEditType(index)}>
                      <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleDeleteType(index)}>
                      <TrashIcon className="h-6 w-6 text-white bg-red-500 rounded-xl p-1" />
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
      {deleteModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p>Are you sure you want to delete the type <strong>{typeToDelete?.name}</strong>?</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setDeleteModalVisible(false)}
                className="bg-gray-300 text-gray-800 rounded-lg px-4 py-2 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed} // Call the function to delete the type
                className="bg-red-500 text-white rounded-lg px-4 py-2"
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

export default Type;
