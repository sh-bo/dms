import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, LockClosedIcon, LockOpenIcon, MagnifyingGlassIcon, PencilIcon, PlusCircleIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

const Document = () => {
    const [branches, setBranches] = useState([
      { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', branch: 'Main Branch', department: 'IT', role: 'Developer', isActive: true, createdOn: '2024-01-01', updatedOn: '2024-01-15' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '234-567-8901', branch: 'Secondary Branch', department: 'HR', role: 'Manager', isActive: false, createdOn: '2024-01-02', updatedOn: '2024-01-16' },
      { id: 3, name: 'Alice Johnson', email: 'alice@example.com', phone: '345-678-9012', branch: 'East Branch', department: 'Finance', role: 'Accountant', isActive: true, createdOn: '2024-01-03', updatedOn: '2024-01-17' },
      { id: 4, name: 'Bob Wilson', email: 'bob@example.com', phone: '456-789-0123', branch: 'West Branch', department: 'Sales', role: 'Sales Representative', isActive: true, createdOn: '2024-01-04', updatedOn: '2024-01-18' },
      { id: 5, name: 'Carol Martinez', email: 'carol@example.com', phone: '567-890-1234', branch: 'North Branch', department: 'Marketing', role: 'Marketing Specialist', isActive: false, createdOn: '2024-01-05', updatedOn: '2024-01-19' },
      { id: 6, name: 'David Lee', email: 'david@example.com', phone: '678-901-2345', branch: 'South Branch', department: 'Operations', role: 'Operations Manager', isActive: true, createdOn: '2024-01-06', updatedOn: '2024-01-20' },
      { id: 7, name: 'Eva Brown', email: 'eva@example.com', phone: '789-012-3456', branch: 'Main Branch', department: 'Customer Service', role: 'Support Specialist', isActive: true, createdOn: '2024-01-07', updatedOn: '2024-01-21' },
      { id: 8, name: 'Frank Garcia', email: 'frank@example.com', phone: '890-123-4567', branch: 'Secondary Branch', department: 'IT', role: 'System Administrator', isActive: false, createdOn: '2024-01-08', updatedOn: '2024-01-22' },
      { id: 9, name: 'Grace Taylor', email: 'grace@example.com', phone: '901-234-5678', branch: 'East Branch', department: 'HR', role: 'Recruiter', isActive: true, createdOn: '2024-01-09', updatedOn: '2024-01-23' },
      { id: 10, name: 'Henry Wilson', email: 'henry@example.com', phone: '012-345-6789', branch: 'West Branch', department: 'Legal', role: 'Legal Counsel', isActive: true, createdOn: '2024-01-10', updatedOn: '2024-01-24' }
    ]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: '',
    department: '',
    role: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalVisible, setModalVisible] = useState(false);
  const [branchToToggle, setBranchToToggle] = useState(null);

  const [branchOptions] = useState(['Main Branch', 'Secondary Branch', 'East Branch', 'West Branch', 'North Branch', 'South Branch']);
  const [departmentOptions] = useState(['IT', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations', 'Customer Service', 'Legal']);
  const [roleOptions] = useState(['Developer', 'Manager', 'Accountant', 'Sales Representative', 'Marketing Specialist', 'Operations Manager', 'Support Specialist', 'System Administrator', 'Recruiter', 'Legal Counsel']);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleAddBranch = () => {
    if (Object.values(formData).every(value => value)) {
      const newBranch = {
        id: Date.now(),
        ...formData,
        isActive: true,
        createdOn: new Date().toISOString().split('T')[0],
        updatedOn: new Date().toISOString().split('T')[0],
      };
      setBranches([...branches, newBranch]);
      setFormData({
        name: '',
        email: '',
        phone: '',
        branch: '',
        department: '',
        role: '',
      });
    }
  };

  const handleEditBranch = (index) => {
    setEditingIndex(index);
    setFormData(branches[index]);
  };

  const handleSaveEdit = () => {
    if (Object.values(formData).every(value => value)) {
      const updatedBranches = branches.map((branch, index) =>
        index === editingIndex ? { ...branch, ...formData, updatedOn: new Date().toISOString().split('T')[0] } : branch
      );
      setBranches(updatedBranches);
      setFormData({
        name: '',
        email: '',
        phone: '',
        branch: '',
        department: '',
        role: '',
      });
      setEditingIndex(null);
    }
  };

  const handleToggleActive = (branch) => {
    setBranchToToggle(branch);
    setModalVisible(true);
  };

  const confirmToggleActive = () => {
    const updatedBranches = branches.map(branch =>
      branch.id === branchToToggle.id ? { ...branch, isActive: !branch.isActive, updatedOn: new Date().toISOString().split('T')[0] } : branch
    );
    setBranches(updatedBranches);
    setModalVisible(false);
    setBranchToToggle(null);
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
      <h1 className="text-xl mb-4 font-semibold">USERS</h1>
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
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            />
            <input
              type="tel"
              placeholder="Phone"
              name="phone"
              value={formData.phone}
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
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select Department</option>
              {departmentOptions.map((department, index) => (
                <option key={index} value={department}>{department}</option>
              ))}
            </select>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select Role</option>
              {roleOptions.map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>
             
            
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="p-2 border rounded-md"
            />

          </div>
          <div className="mt-3 flex justify-start">
            {editingIndex === null ? (
              <button onClick={handleAddBranch} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Add User
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
                <th className="border p-2 text-left">Email</th>
                <th className="border p-2 text-left">Mobile</th>
                <th className="border p-2 text-left">Branch</th>
                <th className="border p-2 text-left">Department</th>
                <th className="border p-2 text-left">Role</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Created On</th>
                <th className="border p-2 text-left">Updated On</th>
                <th className="border p-2 text-left">File</th>
                <th className="border p-2 text-left">Edit</th>
                <th className="border p-2 text-left">Access</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBranches.map((branch, index) => (
                <tr key={branch.id}>
                  <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border p-2">{branch.name}</td>
                  <td className="border p-2">{branch.email}</td>
                  <td className="border p-2">{branch.phone}</td>
                  <td className="border p-2">{branch.branch}</td>
                  <td className="border p-2">{branch.department}</td>
                  <td className="border p-2">{branch.role}</td>
                  <td className="border p-2">{branch.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="border p-2">{branch.createdOn}</td>
                  <td className="border p-2">{branch.updatedOn}</td>
                  <td className="border p-2">
                    {branch.file ? (
                      <a href={URL.createObjectURL(branch.file)} target="_blank" rel="noopener noreferrer">
                        View File
                      </a>
                    ) : (
                      'No File'
                    )}
                  </td>
                  <td className="border p-2">
                      <button onClick={() => handleEditBranch(index)}>
                        <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <h3 className="text-xl mb-4">Confirm Toggle Status</h3>
            <p>Are you sure you want to {branchToToggle?.isActive ? 'deactivate' : 'activate'} the status of the user "{branchToToggle?.name}"?</p>
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

export default Document;