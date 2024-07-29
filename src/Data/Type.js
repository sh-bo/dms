import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, PencilIcon, PlusCircleIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

const Type = () => {
  const [types, setTypes] = useState([
    { id: 1, name: 'Type A', createdOn: '2024-01-01', updatedOn: '2024-01-15' },
    { id: 2, name: 'Type B', createdOn: '2024-01-02', updatedOn: '2024-01-16' },
    { id: 3, name: 'Type C', createdOn: '2024-01-03', updatedOn: '2024-01-17' },
    { id: 4, name: 'Type D', createdOn: '2024-01-04', updatedOn: '2024-01-18' },
    { id: 5, name: 'Type E', createdOn: '2024-01-05', updatedOn: '2024-01-19' },
    { id: 6, name: 'Type F', createdOn: '2024-01-06', updatedOn: '2024-01-20' },
    { id: 7, name: 'Type G', createdOn: '2024-01-07', updatedOn: '2024-01-21' },
    { id: 8, name: 'Type H', createdOn: '2024-01-08', updatedOn: '2024-01-22' },
    { id: 9, name: 'Type I', createdOn: '2024-01-09', updatedOn: '2024-01-23' },
    { id: 10, name: 'Type J', createdOn: '2024-01-10', updatedOn: '2024-01-24' }
  ]);

  const [formData, setFormData] = useState({
    name: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddType = () => {
    if (Object.values(formData).every(value => value)) {
      const newType = {
        id: Date.now(),
        ...formData,
        createdOn: new Date().toISOString().split('T')[0],
        updatedOn: new Date().toISOString().split('T')[0],
      };
      setTypes([...types, newType]);
      setFormData({
        name: '',
      });
    }
  };

  const handleEditType = (index) => {
    setEditingIndex(index);
    setFormData(types[index]);
  };

  const handleDeleteType = (index) => {
    const updatedTypes = types.filter((_, i) => i !== index);
    setTypes(updatedTypes);
  };

  const handleSaveEdit = () => {
    if (Object.values(formData).every(value => value)) {
      const updatedTypes = types.map((type, index) =>
        index === editingIndex ? { ...type, ...formData, updatedOn: new Date().toISOString().split('T')[0] } : type
      );
      setTypes(updatedTypes);
      setFormData({
        name: '',
      });
      setEditingIndex(null);
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
                <th className="border p-2 text-left">Sr</th>
                <th className="border p-2 text-left">Name</th>
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

export default Type;
