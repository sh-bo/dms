import { ROLE_API } from '../API/apiConfig';
import React, { useState, useEffect } from 'react';
import {
  ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon,
  LockClosedIcon, LockOpenIcon, MagnifyingGlassIcon,
  PencilIcon, PlusCircleIcon, TrashIcon
} from '@heroicons/react/24/solid';
import axios from 'axios';

const tokenKey = 'tokenKey'; // Updated token key

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
    const fetchRoles = async () => {
      try {
        const token = localStorage.getItem(tokenKey); // Retrieve token from local storage
        const response = await axios.get(`${ROLE_API}/findAll`, {
          headers: { Authorization: `Bearer ${token}` }
        });
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
    if (formData.role) {
      const newRole = {
        role: formData.role,
        isActive: 1 // Use 1 to represent true
      };

      try {
        const token = localStorage.getItem(tokenKey); // Retrieve token from local storage
        const response = await axios.post(`${ROLE_API}/save`, newRole, {
          headers: { Authorization: `Bearer ${token}` }
        });
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
        const token = localStorage.getItem(tokenKey); // Retrieve token from local storage
        const response = await axios.put(`${ROLE_API}/update/${updatedRole.id}`, updatedRole, {
          headers: { Authorization: `Bearer ${token}` }
        });
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
      const token = localStorage.getItem(tokenKey); // Retrieve token from local storage
      await axios.delete(`${ROLE_API}/delete/${roles[index].id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
    if (roleToToggle) {
      try {
        const updatedRole = {
          ...roleToToggle,
          isActive: roleToToggle.isActive === 1 ? 0 : 1, // Toggle between 1 and 0
          updatedOn: new Date().toISOString(),
        };

        const token = localStorage.getItem(tokenKey); // Retrieve token from local storage
        const response = await axios.put(
          `${ROLE_API}/updatestatus/${updatedRole.id}`,
          updatedRole,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        );

        const updatedRoles = roles.map(role =>
          role.id === updatedRole.id ? response.data : role
        );
        setRoles(updatedRoles);
        setModalVisible(false);
        setRoleToToggle(null);
      } catch (error) {
        console.error('Error toggling role status:', error.response ? error.response.data : error.message);
      }
    } else {
      console.error('roleToToggle is not defined or null');
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
                  <td className="border p-2">{new Date(role.createdOn).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(role.updatedOn).toLocaleDateString()}</td>
                  <td className="border p-2">{role.isActive === 1 ? 'Active' : 'Inactive'}</td>
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
                      onClick={() => handleToggleActiveStatus(role)}
                      className={`p-1 rounded-full ${role.isActive === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      {role.isActive === 1 ? (
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
            {totalPages > 1 && (
              <>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg disabled:opacity-50"
                >
                  <ArrowLeftIcon className="h-6 w-6" />
                </button>
                <span className="mx-3">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg disabled:opacity-50"
                >
                  <ArrowRightIcon className="h-6 w-6" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg mb-4">
              Are you sure you want to {roleToToggle?.isActive === 1 ? 'deactivate' : 'activate'} this role?
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setModalVisible(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleActiveStatus}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg"
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

export default Role;
