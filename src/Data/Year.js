import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon, PencilIcon, PlusCircleIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

const Year = () => {
  const [years, setYears] = useState([
    { id: 1, year: '2020', createdOn: '2024-01-01', updatedOn: '2024-01-15' },
    { id: 2, year: '2021', createdOn: '2024-01-02', updatedOn: '2024-01-16' },
    { id: 3, year: '2022', createdOn: '2024-01-03', updatedOn: '2024-01-17' },
    { id: 4, year: '2023', createdOn: '2024-01-04', updatedOn: '2024-01-18' },
    { id: 5, year: '2024', createdOn: '2024-01-05', updatedOn: '2024-01-19' }
  ]);

  const [formData, setFormData] = useState({
    year: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddYear = () => {
    if (Object.values(formData).every(value => value)) {
      const newYear = {
        id: Date.now(),
        ...formData,
        createdOn: new Date().toISOString().split('T')[0],
        updatedOn: new Date().toISOString().split('T')[0],
      };
      setYears([...years, newYear]);
      setFormData({
        year: '',
      });
    }
  };

  const handleEditYear = (index) => {
    setEditingIndex(index);
    setFormData(years[index]);
  };

  const handleDeleteYear = (index) => {
    const updatedYears = years.filter((_, i) => i !== index);
    setYears(updatedYears);
  };

  const handleSaveEdit = () => {
    if (Object.values(formData).every(value => value)) {
      const updatedYears = years.map((year, index) =>
        index === editingIndex ? { ...year, ...formData, updatedOn: new Date().toISOString().split('T')[0] } : year
      );
      setYears(updatedYears);
      setFormData({
        year: '',
      });
      setEditingIndex(null);
    }
  };

  const filteredYears = years.filter(year =>
    Object.values(year).some(value =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalItems = filteredYears.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedYears = filteredYears.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-1">
      <h1 className="text-xl mb-4 font-semibold">YEARS</h1>
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <div className="mb-4 bg-slate-100 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            />
          </div>
          <div className="mt-3 flex justify-start">
            {editingIndex === null ? (
              <button onClick={handleAddYear} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Add Year
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
                <th className="border p-2 text-left">Year</th>
                <th className="border p-2 text-left">Created On</th>
                <th className="border p-2 text-left">Updated On</th>
                <th className="border p-2 text-left">Edit</th>
                <th className="border p-2 text-left">Delete</th>
              </tr>
            </thead>
            <tbody>
              {paginatedYears.map((year, index) => (
                <tr key={year.id}>
                  <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border p-2">{year.year}</td>
                  <td className="border p-2">{year.createdOn}</td>
                  <td className="border p-2">{year.updatedOn}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEditYear(index)}>
                      <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleDeleteYear(index)}>
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

export default Year;
