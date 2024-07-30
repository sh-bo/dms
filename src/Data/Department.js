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
  const [error, setErrorMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    branch: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBranches();
    fetchDepartments();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axios.get('http://localhost:8080/branchmaster/findAll');
      setBranches(response.data.map(branch => branch.id)); // Extracting only the branch names
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/DepartmentMaster/findAll');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDepartment = async () => {
    // Trim whitespace from form data
    const trimmedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value.trim()])
    );
  
    // Check if all form fields are filled
    if (Object.values(trimmedFormData).every(value => value !== '')) {
      try {
        const newDepartment = {
          ...trimmedFormData,
          createdOn: new Date().toISOString().split('T')[0],
          updatedOn: new Date().toISOString().split('T')[0],
          isActive: true,
        };
  
        console.log('Sending department data:', newDepartment);
  
        const response = await axios.post('http://localhost:8080/DepartmentMaster/save', newDepartment, {
          headers: {
            'Content-Type': 'application/json',
            // Add any necessary authentication headers here
          }
        });
  
        // Check if the response is successful
        if (response.status === 200 || response.status === 201) {
          setDepartments(prevDepartments => [...prevDepartments, response.data]);
          setFormData({ name: '', branch: '' });
          console.log('Department added successfully:', response.data);
          // Optionally, show a success message to the user
          // setSuccessMessage('Department added successfully');
        } else {
          throw new Error('Unexpected response status: ' + response.status);
        }
      } catch (error) {
        let errorMessage = 'An error occurred while adding the department.';
  
        if (error.response) {
          // The server responded with a status code outside the 2xx range
          console.error('Server error:', error.response.data);
          console.error('Status code:', error.response.status);
          
          if (error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
          } else if (error.response.status === 400) {
            errorMessage = 'Bad request. Please check your input data.';
          } else if (error.response.status === 401) {
            errorMessage = 'Unauthorized. Please check your authentication.';
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error('No response received:', error.request);
          errorMessage = 'No response received from server. Please try again.';
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error setting up request:', error.message);
          errorMessage = 'Error setting up request. Please try again.';
        }
        
        // Set error message to display to the user
        setErrorMessage(errorMessage);
      }
    } else {
      // Handle case where form is not completely filled
      setErrorMessage('Please fill all fields before submitting');
    }
  };

  const handleEditDepartment = (index) => {
    setEditingIndex(index);
    setFormData(departments[index]);
  };

  const handleSaveEdit = async () => {
    if (Object.values(formData).every(value => value)) {
      try {
        const updatedDepartment = {
          ...formData,
          updatedOn: new Date().toISOString().split('T')[0],
        };
        const response = await axios.put(`http://localhost:8080/DepartmentMaster/update/${formData.id}`, updatedDepartment);
        const updatedDepartments = departments.map((department, index) =>
          index === editingIndex ? response.data : department
        );
        setDepartments(updatedDepartments);
        setFormData({ name: '', branch: '' });
        setEditingIndex(null);
      } catch (error) {
        console.error('Error updating department:', error);
      }
    }
  };

  const handleDeleteDepartment = async (index) => {
    try {
      await axios.delete(`http://localhost:8080/DepartmentMaster/delete/${departments[index].id}`);
      const updatedDepartments = departments.filter((_, i) => i !== index);
      setDepartments(updatedDepartments);
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };

  const handleToggleActive = (index) => {
    const updatedDepartments = departments.map((department, i) =>
      i === index ? { ...department, isActive: !department.isActive, updatedOn: new Date().toISOString().split('T')[0] } : department
    );
    setDepartments(updatedDepartments);
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
              {branches.map((branch, index) => (
                <option key={index} value={branch}>{branch}</option>
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
                <th className="border p-2 text-left">Edit</th>
                <th className="border p-2 text-left">Delete</th>
                <th className="border p-2 text-left">Access</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDepartments.map((department, index) => (
                <tr key={department.id}>
                  <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border p-2">{department.name}</td>
                  <td className="border p-2">{department.branch}</td>
                  <td className="border p-2">{department.createdOn}</td>
                  <td className="border p-2">{department.updatedOn}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEditDepartment(index)}>
                      <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleDeleteDepartment(index)}>
                      <TrashIcon className="h-6 w-6 text-white bg-red-600 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleToggleActive(index)}>
                      {department.isActive ? (
                        <LockOpenIcon className="h-6 w-6 text-green-600" />
                      ) : (
                        <LockClosedIcon className="h-6 w-6 text-gray-600" />
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
