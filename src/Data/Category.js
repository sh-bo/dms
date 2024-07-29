import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  LockClosedIcon,
  LockOpenIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  PlusCircleIcon
} from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Category = () => {
  const [categories, setCategories] = useState([]);
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
  const [categoryToToggle, setCategoryToToggle] = useState(null);

  const [branchOptions] = useState(['Main Branch', 'Secondary Branch', 'East Branch', 'West Branch', 'North Branch', 'South Branch']);
  const [departmentOptions] = useState(['IT', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations', 'Customer Service', 'Legal']);
  const [roleOptions] = useState(['Developer', 'Manager', 'Accountant', 'Sales Representative', 'Marketing Specialist', 'Operations Manager', 'Support Specialist', 'System Administrator', 'Recruiter', 'Legal Counsel']);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8080/categorymaster/findAll');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchCategoryById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/categorymaster/findById/${id}`);
      setFormData(response.data);
    } catch (error) {
      console.error('Error fetching category by ID:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddCategory = async () => {
    if (Object.values(formData).every(value => value)) {
      try {
        const newCategory = {
          ...formData,
          isActive: true,
          createdOn: new Date().toISOString().split('T')[0],
          updatedOn: new Date().toISOString().split('T')[0],
        };
        const response = await axios.post('http://localhost:8080/categorymaster/save', newCategory);
        setCategories([...categories, response.data]);
        setFormData({
          name: '',
          email: '',
          phone: '',
          branch: '',
          department: '',
          role: '',
        });
      } catch (error) {
        console.error('Error adding category:', error);
      }
    }
  };

  const handleEditCategory = async (index) => {
    setEditingIndex(index);
    const categoryId = categories[index].id;
    await fetchCategoryById(categoryId);
  };

  const handleSaveEdit = async () => {
    if (Object.values(formData).every(value => value)) {
      try {
        const updatedCategory = {
          ...formData,
          updatedOn: new Date().toISOString().split('T')[0],
        };
        const response = await axios.put(`http://localhost:8080/categorymaster/update/${formData.id}`, updatedCategory);
        const updatedCategories = categories.map((category, index) =>
          index === editingIndex ? response.data : category
        );
        setCategories(updatedCategories);
        setFormData({
          name: '',
          email: '',
          phone: '',
          branch: '',
          department: '',
          role: '',
        });
        setEditingIndex(null);
      } catch (error) {
        console.error('Error updating category:', error);
      }
    }
  };

  // const handleDeleteCategory = async (index) => {
  //   try {
  //     await axios.delete(`http://localhost:8080/categorymaster/delete/${categories[index].id}`);
  //     const updatedCategories = categories.filter((_, i) => i !== index);
  //     setCategories(updatedCategories);
  //   } catch (error) {
  //     console.error('Error deleting category:', error);
  //   }
  // };

  const handleToggleActive = (category) => {
    setCategoryToToggle(category);
    setModalVisible(true);
  };

  const confirmToggleActive = async () => {
    try {
      const updatedCategory = {
        ...categoryToToggle,
        isActive: !categoryToToggle.isActive,
        updatedOn: new Date().toISOString().split('T')[0],
      };
      await axios.put(`http://localhost:8080/categorymaster/update/${updatedCategory.id}`, updatedCategory);
      const updatedCategories = categories.map(category =>
        category.id === categoryToToggle.id ? updatedCategory : category
      );
      setCategories(updatedCategories);
      setModalVisible(false);
      setCategoryToToggle(null);
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const filteredCategories = categories.filter(category =>
    Object.values(category).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedCategories = filteredCategories.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-1">
      <h1 className="text-xl mb-4 font-semibold">CATEGORIES</h1>
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
              type="text"
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
              {branchOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select Department</option>
              {departmentOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select Role</option>
              {roleOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="mt-3 flex justify-start">
            {editingIndex === null ? (
              <button onClick={handleAddCategory} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Add Category
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
              <th className="border p-2 text-left">Phone</th>
              <th className="border p-2 text-left">Branch</th>
              <th className="border p-2 text-left">Department</th>
              <th className="border p-2 text-left">Role</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Created On</th>
              <th className="border p-2 text-left">Updated On</th>
              <th className="border p-2 text-left">Edit</th>
              <th className="border p-2 text-left">Access</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((category, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="py-2 px-4 border-b">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                <td className="py-2 px-4 border-b">{category.name}</td>
                <td className="py-2 px-4 border-b">{category.email}</td>
                <td className="py-2 px-4 border-b">{category.phone}</td>
                <td className="py-2 px-4 border-b">{category.branch}</td>
                <td className="py-2 px-4 border-b">{category.department}</td>
                <td className="py-2 px-4 border-b">{category.role}</td>
                <td className="py-2 px-4 border-b">{category.isActive ? 'Active' : 'Inactive'}</td>
                <td className="py-2 px-4 border-b">{category.createdOn}</td>
                <td className="py-2 px-4 border-b">{category.updatedOn}</td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleEditCategory(index)} className="bg-rose-900 text-white rounded-full p-2 flex items-center text-sm justify-center">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                </td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleToggleActive(category)} className="bg-rose-900 text-white rounded-full p-2 flex items-center text-sm justify-center">
                    {category.isActive ? <LockClosedIcon className="h-5 w-5" /> : <LockOpenIcon className="h-5 w-5" />}
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

      {modalVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <p>Are you sure you want to toggle the status of this category?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setModalVisible(false)} className="mr-2 bg-gray-300 p-2 rounded-lg">
                Cancel
              </button>
              <button onClick={confirmToggleActive} className="bg-rose-900 text-white p-2 rounded-lg">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
