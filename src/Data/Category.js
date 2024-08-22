import { CATEGORI_API } from '../API/apiConfig';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  PencilIcon,
  PlusCircleIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/solid';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const tokenKey = 'tokenKey'; // Correct token key name

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${CATEGORI_API}/findAll`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
        },
      });
      setCategories(response.data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddCategory = async () => {
    if (formData.name.trim()) {
      try {
        const response = await axios.post(`${CATEGORI_API}/save`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
          },
        });
        setCategories([...categories, response.data]);
        setFormData({ name: '' }); // Reset form data
      } catch (error) {
        console.error('Error adding category:', error);
      }
    } else {
      console.error('Name field is required.');
    }
  };

  const handleEditCategory = (index) => {
    setEditingIndex(index);
    setFormData({ name: categories[index].name || '' }); // Handle null values
  };

  const handleSaveEdit = async () => {
    if (formData.name.trim()) {
      try {
        const response = await axios.put(
          `${CATEGORI_API}/update/${categories[editingIndex].id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
            },
          }
        );
        const updatedCategories = categories.map((category, index) =>
          index === editingIndex ? response.data : category
        );
        setCategories(updatedCategories);
        setFormData({ name: '' }); // Reset form data
        setEditingIndex(null);
      } catch (error) {
        console.error('Error updating category:', error);
      }
    } else {
      console.error('Name field is required.');
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${CATEGORI_API}/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem(tokenKey)}`,
        },
      });
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const filteredCategories = categories.filter((category) =>
    Object.values(category).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalItems = filteredCategories.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
          </div>
          <div className="mt-3 flex justify-start">
            {editingIndex === null ? (
              <button
                onClick={handleAddCategory}
                className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Add Category
              </button>
            ) : (
              <button
                onClick={handleSaveEdit}
                className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center"
              >
                <CheckCircleIcon className="h-5 w-5 mr-1" /> Save
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 bg-slate-100 p-4 rounded-lg flex justify-between items-center">
          <div className="flex items-center bg-blue-500 rounded-lg">
            <label htmlFor="itemsPerPage" className="mr-2 ml-2 text-white text-sm">
              Show:
            </label>
            <select
              id="itemsPerPage"
              className="border rounded-r-lg p-1.5 outline-none"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              {[5, 10, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
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
                <th className="border p-2 text-left">Created On</th>
                <th className="border p-2 text-left">Updated On</th>
                <th className="border p-2 text-left">Edit</th>
                <th className="border p-2 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((category, index) => (
                <tr key={category.id}>
                  <td className="border p-2">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border p-2">{category.name}</td>
                  <td className="border p-2">{category.createdOn}</td>
                  <td className="border p-2">{category.updatedOn}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEditCategory(index)}>
                      <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleDeleteCategory(category.id)}>
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

export default Category;
