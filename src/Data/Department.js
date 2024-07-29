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
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    branch: '',
    isActive: true,
    createdOn: '',
    updatedOn: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [departmentToToggle, setDepartmentToToggle] = useState(null);

  const branchOptions = ['Main Branch', 'Secondary Branch', 'East Branch', 'West Branch', 'North Branch', 'South Branch'];

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/DepartmentMaster/findAll');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchDepartmentById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/DepartmentMaster/findById/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching department by ID:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDepartment = async () => {
    if (Object.values(formData).every(value => value)) {
      try {
        const newDepartment = {
          ...formData,
          createdOn: new Date().toISOString().split('T')[0],
          updatedOn: new Date().toISOString().split('T')[0],
        };
        const response = await axios.post('http://localhost:8080/DepartmentMaster/save', newDepartment);
        setDepartments([...departments, response.data]);
        setFormData({
          id: null,
          name: '',
          branch: '',
          isActive: true,
          createdOn: '',
          updatedOn: ''
        });
      } catch (error) {
        console.error('Error adding department:', error);
      }
    }
  };

  const handleEditDepartment = async (index) => {
    setEditingIndex(index);
    const departmentId = departments[index].id;
    await fetchDepartmentById(departmentId);
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
        setFormData({
          id: null,
          name: '',
          branch: '',
          isActive: true,
          createdOn: '',
          updatedOn: ''
        });
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

  const handleToggleActive = (department) => {
    setDepartmentToToggle(department);
    setModalVisible(true);
  };

  const confirmToggleActive = async () => {
    try {
      const updatedDepartment = {
        ...departmentToToggle,
        isActive: !departmentToToggle.isActive,
        updatedOn: new Date().toISOString().split('T')[0],
      };
      await axios.put(`http://localhost:8080/DepartmentMaster/update/${updatedDepartment.id}`, updatedDepartment);
      const updatedDepartments = departments.map(department =>
        department.id === departmentToToggle.id ? updatedDepartment : department
      );
      setDepartments(updatedDepartments);
      setModalVisible(false);
      setDepartmentToToggle(null);
    } catch (error) {
      console.error('Error toggling active status:', error);
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
    <div className="p-1">
      <h1 className="text-xl mb-4 font-semibold">DEPARTMENT</h1>
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
              {paginatedDepartments.map((department, index) => (
                <tr key={department.id}>
                  <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border p-2">{department.name}</td>
                  <td className="border p-2">{department.branch}</td>
                  <td className="border p-2">{department.createdOn}</td>
                  <td className="border p-2">{department.updatedOn}</td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleEditDepartment(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDeleteDepartment(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleToggleActive(department)}
                      className={`text-${department.isActive ? 'green' : 'gray'}-500 hover:text-${department.isActive ? 'green' : 'gray'}-700`}
                    >
                      {department.isActive ? (
                        <LockOpenIcon className="h-5 w-5" />
                      ) : (
                        <LockClosedIcon className="h-5 w-5" />
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

        {modalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg mb-4">Confirm Status Change</h2>
              <p>Are you sure you want to {departmentToToggle.isActive ? 'deactivate' : 'activate'} this department?</p>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setModalVisible(false)}
                  className="bg-gray-500 text-white p-2 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmToggleActive}
                  className="bg-blue-500 text-white p-2 rounded-lg"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Department;
