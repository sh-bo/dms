import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon,
  LockClosedIcon, LockOpenIcon, MagnifyingGlassIcon,
  PencilIcon, PlusCircleIcon, TrashIcon
} from '@heroicons/react/24/solid';
import axios from 'axios';

const API_URL = 'http://localhost:8081/RoleMaster';

const Role = () => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({ role: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [roleToToggle, setRoleToToggle] = useState(null);

  useEffect(() => {
    // Fetch roles from the server
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${API_URL}/findAll`);
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    fetchRoles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleAddRole = async () => {
    if (Object.values(formData).every(value => value)) {
      const newRole = {
        role: formData.role,
        isActive: 1 // Use 1 to represent true
      };

      try {
        const response = await axios.post(`${API_URL}/save`, newRole);
        setRoles([...roles, response.data]);
        setFormData({ role: '' });
      } catch (error) {
        console.error('Error adding role:', error);
      }
    }
  };



  const handleEditRole = (index) => {
    setEditingIndex(index);
    setFormData({ role: roles[index].role });
  };

  const handleSaveEdit = async () => {
    if (formData.role) {
      try {
        const updatedRole = {
          ...roles[editingIndex],
          role: formData.role,
          updatedOn: new Date().toISOString(),
        };
        const response = await axios.put(`${API_URL}/update/${updatedRole.id}`, updatedRole);
        const updatedRoles = roles.map((role, index) =>
          index === editingIndex ? response.data : role
        );
        setRoles(updatedRoles);
        setFormData({ role: '' });
        setEditingIndex(null);
      } catch (error) {
        console.error('Error updating role:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleDeleteRole = async (index) => {
    try {
      await axios.delete(`${API_URL}/delete/${roles[index].id}`);
      const updatedRoles = roles.filter((_, i) => i !== index);
      setRoles(updatedRoles);
    } catch (error) {
      console.error('Error deleting role:', error.response ? error.response.data : error.message);
    }
  };

  const handleToggleActiveStatus = (role) => {
    setRoleToToggle(role);
    setModalVisible(true);
  };

  const confirmToggleActiveStatus = async () => {
    try {
      const updatedRole = {
        ...roleToToggle,
        isActive: !roleToToggle.isActive,
        updatedOn: new Date().toISOString(),
      };
      const response = await axios.put(`${API_URL}/update/${updatedRole.id}`, updatedRole);
      const updatedRoles = roles.map(role =>
        role.id === updatedRole.id ? response.data : role
      );
      setRoles(updatedRoles);
      setModalVisible(false);
      setRoleToToggle(null);
    } catch (error) {
      console.error('Error toggling role status:', error.response ? error.response.data : error.message);
    }
  };

  const filteredRoles = roles.filter(role =>
    Object.values(role).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalItems = filteredRoles.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedRoles = filteredRoles.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-1">
      <h1 className="text-xl mb-4 font-semibold">ROLES</h1>
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <div className="mb-4 bg-slate-100 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            />
          </div>
          <div className="mt-3 flex justify-start">
            {editingIndex === null ? (
              <button onClick={handleAddRole} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Add Role
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
                <th className="border p-2 text-left">Role</th>
                <th className="border p-2 text-left">Created On</th>
                <th className="border p-2 text-left">Updated On</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Edit</th>
                <th className="border p-2 text-left">Delete</th>
                <th className="border p-2 text-left">Access</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRoles.map((role, index) => (
                <tr key={role.id}>
                  <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border p-2">{role.role}</td>
                  <td className="border p-2">{role.createdOn}</td>
                  <td className="border p-2">{role.updatedOn}</td>
                  <td className="border p-2">{role.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEditRole(index)}>
                      <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleDeleteRole(index)}>
                      <TrashIcon className="h-6 w-6 text-white bg-red-500 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
                      <button
                        onClick={() => handleToggleActiveStatus(index)}
                        className={`p-1 rounded-full ${role.isActive ? 'bg-green-500' : 'bg-red-500'}`}
                      >
                        {role.isActive ? (
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
            <p>Are you sure you want to change the status of this role?</p>
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

export default Role;
