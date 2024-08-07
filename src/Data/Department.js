import { DEPAETMENT_API, BRANCH_API } from '../API/apiConfig';
import React, { useState, useEffect } from 'react';
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
import axios from 'axios';

const Department = () => {
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    branch: null,
    isActive: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [toggleIndex, setToggleIndex] = useState(null);

  useEffect(() => {
    fetchBranches();
    fetchDepartments();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get(`${BRANCH_API}/findAll`);
      setBranches(response.data);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${DEPAETMENT_API}/findAll`);
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBranchChange = (e) => {
    const selectedBranch = branches.find(branch => branch.id === parseInt(e.target.value));
    setFormData({ ...formData, branch: selectedBranch });
  };

  const handleAddDepartment = async () => {
    if (formData.name && formData.branch) {
      try {
        const newDepartment = {
          name: formData.name,
          branch: formData.branch,
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
          isActive: formData.isActive ? 1 : 0,
        };
        console.log('Add Department Payload:', newDepartment);
        const response = await axios.post(`${DEPAETMENT_API}/save`, newDepartment, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setDepartments([...departments, response.data]);
        setFormData({ name: '', branch: null, isActive: true });
      } catch (error) {
        console.error('Error adding department:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        if (error.request) {
          console.error('Error request:', error.request);
        }
      }
    } else {
      console.error('Form data is incomplete');
    }
  };

  const handleEditDepartment = (index) => {
    setEditingIndex(index);
    setFormData(departments[index]);
  };

  const handleSaveEdit = async () => {
    if (formData.name && formData.branch) {
      try {
        const updatedDepartment = {
          ...formData,
          updatedOn: new Date().toISOString(),
          isActive: formData.isActive ? 1 : 0,
        };
        console.log('Update Department Payload:', updatedDepartment);
        const response = await axios.put(`${DEPAETMENT_API}/update/${formData.id}`, updatedDepartment);
        const updatedDepartments = departments.map((department, index) =>
          index === editingIndex ? response.data : department
        );
        setDepartments(updatedDepartments);
        setFormData({ name: '', branch: null, isActive: true });
        setEditingIndex(null);
      } catch (error) {
        console.error('Error updating department:', error);
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        if (error.request) {
          console.error('Error request:', error.request);
        }
      }
    } else {
      console.error('Form data is incomplete');
    }
  };

  const handleDeleteDepartment = async (index) => {
    try {
      await axios.delete(`${DEPAETMENT_API}/delete/${departments[index].id}`);
      const updatedDepartments = departments.filter((_, i) => i !== index);
      setDepartments(updatedDepartments);
    } catch (error) {
      console.error('Error deleting department:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      if (error.request) {
        console.error('Error request:', error.request);
      }
    }
  };

  const handleToggleActive = (department) => {
    setToggleIndex(department); // Set the department to toggle
    setModalVisible(true); // Show the modal
  };
  
  const confirmToggleActiveStatus = async () => {
    if (toggleIndex) { // Check if department is set
      try {
        const updatedDepartment = {
          ...toggleIndex,
          isActive: toggleIndex.isActive === 1 ? 0 : 1, // Toggle between 1 and 0
          updatedOn: new Date().toISOString(),
        };
  
        console.log('Sending payload:', updatedDepartment); // Debug log
  
        const response = await axios.put(
          `${DEPAETMENT_API}/update/${updatedDepartment.id}`, 
          updatedDepartment,
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
  
        const updatedDepartments = departments.map(dept =>
          dept.id === updatedDepartment.id ? response.data : dept
        );
        setDepartments(updatedDepartments);
        setModalVisible(false);
        setToggleIndex(null);
      } catch (error) {
        console.error('Error toggling department status:', error.response ? error.response.data : error.message);
      }
    } else {
      console.error('Department to toggle is not defined or null');
    }
  };
  
  const filteredDepartments = departments.filter(department =>
    Object.values(department).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalItems = filteredDepartments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedDepartments = filteredDepartments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4 font-semibold">DEPARTMENTS</h1>
      <div className="bg-white p-4 rounded-lg shadow-sm">
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
              value={formData.branch?.id || ''}
              onChange={handleBranchChange}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select Branch</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 flex justify-start">
            {editingIndex === null ? (
              <button onClick={handleAddDepartment} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
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
                <th className="border p-2 text-left">Department</th>
                <th className="border p-2 text-left">Branch</th>
                <th className="border p-2 text-left">Created On</th>
                <th className="border p-2 text-left">Updated On</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Edit</th>
                <th className="border p-2 text-left">Delete</th>
                <th className="border p-2 text-left">Access</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDepartments.map((department, index) => (
                <tr key={department.id}>
                  <td className="border p-2">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                  <td className="border p-2">{department.name}</td>
                  <td className="border p-2">{department.branch?.name || ''}</td>
                  <td className="border p-2">{new Date(department.createdOn).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(department.updatedOn).toLocaleDateString()}</td>
                  <td className="border p-2">{department.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEditDepartment(index)}>
                      <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleDeleteDepartment(index)}>
                      <TrashIcon className="h-6 w-6 text-white bg-red-500 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleToggleActive(department)}
                      className={`p-1 rounded-full ${department.isActive === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      {department.isActive === 1 ? (
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

      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>Are you sure you want to change the status of this department?</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={confirmToggleActiveStatus}
                className="bg-green-500 text-white rounded-lg p-2"
              >
                Confirm
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="bg-red-500 text-white rounded-lg p-2 ml-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Department;
