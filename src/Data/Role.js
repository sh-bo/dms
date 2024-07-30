import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, LockClosedIcon, LockOpenIcon, MagnifyingGlassIcon, PencilIcon, PlusCircleIcon, TrashIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

const Role = () => {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Admin', isActive: true, createdOn: '2024-01-01', updatedOn: '2024-01-15' },
    { id: 2, name: 'User', isActive: false, createdOn: '2024-01-02', updatedOn: '2024-01-16' },
    { id: 3, name: 'Manager', isActive: true, createdOn: '2024-01-03', updatedOn: '2024-01-17' },
    { id: 4, name: 'Developer', isActive: true, createdOn: '2024-01-04', updatedOn: '2024-01-18' },
    { id: 5, name: 'Support', isActive: false, createdOn: '2024-01-05', updatedOn: '2024-01-19' },
    { id: 6, name: 'Sales', isActive: true, createdOn: '2024-01-06', updatedOn: '2024-01-20' },
    { id: 7, name: 'HR', isActive: true, createdOn: '2024-01-07', updatedOn: '2024-01-21' },
    { id: 8, name: 'Finance', isActive: false, createdOn: '2024-01-08', updatedOn: '2024-01-22' },
    { id: 9, name: 'Marketing', isActive: true, createdOn: '2024-01-09', updatedOn: '2024-01-23' },
    { id: 10, name: 'Legal', isActive: true, createdOn: '2024-01-10', updatedOn: '2024-01-24' }
  ]);

  const [formData, setFormData] = useState({
    name: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [roleToToggle, setRoleToToggle] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddRole = () => {
    if (Object.values(formData).every(value => value)) {
      const newRole = {
        id: Date.now(),
        ...formData,
        isActive: true,
        createdOn: new Date().toISOString().split('T')[0],
        updatedOn: new Date().toISOString().split('T')[0],
      };
      setRoles([...roles, newRole]);
      setFormData({
        name: '',
      });
    }
  };

  const handleEditRole = (index) => {
    setEditingIndex(index);
    setFormData(roles[index]);
  };

  const handleDeleteRole = (index) => {
    const updatedRoles = roles.filter((_, i) => i !== index);
    setRoles(updatedRoles);
  };

  const handleSaveEdit = () => {
    if (Object.values(formData).every(value => value)) {
      const updatedRoles = roles.map((role, index) =>
        index === editingIndex ? { ...role, ...formData, updatedOn: new Date().toISOString().split('T')[0] } : role
      );
      setRoles(updatedRoles);
      setFormData({
        name: '',
      });
      setEditingIndex(null);
    }
  };

  const handleToggleActiveStatus = (role) => {
    setRoleToToggle(role);
    setModalVisible(true);
  };

  const confirmToggleActiveStatus = () => {
    const updatedRoles = roles.map(role =>
      role.id === roleToToggle.id ? { ...role, isActive: !role.isActive, updatedOn: new Date().toISOString().split('T')[0] } : role
    );
    setRoles(updatedRoles);
    setModalVisible(false);
    setRoleToToggle(null);
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
              placeholder="Name"
              name="name"
              value={formData.name}
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
                  <td className="border p-2">{role.name}</td>
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
                      onClick={() => handleToggleActiveStatus(role)}
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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-md shadow-lg">
            <h2 className="text-lg mb-4">Confirmation</h2>
            <p>Are you sure you want to {roleToToggle.isActive ? 'deactivate' : 'activate'} this role?</p>
            <div className="mt-4 flex justify-end space-x-4">
              <button onClick={() => setModalVisible(false)} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
              <button onClick={confirmToggleActiveStatus} className="px-4 py-2 bg-rose-900 text-white rounded-md">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Role;
