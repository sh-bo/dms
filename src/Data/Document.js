import { ArrowLeftIcon, ArrowRightIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, PlusCircleIcon, CheckCircleIcon, EyeIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react';

const Document = () => {
    const [documents, setDocuments] = useState([
      { id: 1, title: 'Annual Report', fileNo: 'DOC001', subject: 'Finance', version: '1.0', createdOn: '2024-01-01', updatedOn: '2024-01-15', category: 'Report', year: '2024', type: 'PDF', employeeID: 'EMP001', employeeDepartment: 'Finance', employeeBranch: 'Main Branch', approvalStatus: 'Approved' },
      { id: 2, title: 'Marketing Plan', fileNo: 'DOC002', subject: 'Marketing', version: '2.1', createdOn: '2024-01-02', updatedOn: '2024-01-16', category: 'Plan', year: '2024', type: 'DOCX', employeeID: 'EMP002', employeeDepartment: 'Marketing', employeeBranch: 'East Branch', approvalStatus: 'Pending' },
      // Add more dummy data as needed
    ]);

  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    category: '',
    year: '',
    type: '',
    files: [],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [categoryOptions] = useState(['Report', 'Plan', 'Policy', 'Procedure', 'Template']);
  const [yearOptions] = useState(['2022', '2023', '2024', '2025']);
  const [typeOptions] = useState(['PDF', 'DOCX', 'XLSX', 'PPT']);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, files: Array.from(e.target.files) });
  };

  const handleAddDocument = () => {
    if (Object.values(formData).every(value => value)) {
      const newDocument = {
        id: Date.now(),
        ...formData,
        fileNo: `DOC${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        version: '1.0',
        createdOn: new Date().toISOString().split('T')[0],
        updatedOn: new Date().toISOString().split('T')[0],
        employeeID: 'EMP001', // This would typically come from the logged-in user
        employeeDepartment: 'IT', // This would typically come from the logged-in user
        employeeBranch: 'Main Branch', // This would typically come from the logged-in user
        approvalStatus: 'Pending',
      };
      setDocuments([...documents, newDocument]);
      setFormData({
        title: '',
        subject: '',
        category: '',
        year: '',
        type: '',
        files: [],
      });
    }
  };

  const handleEditDocument = (index) => {
    setEditingIndex(index);
    const doc = documents[index];
    setFormData({
      title: doc.title,
      subject: doc.subject,
      category: doc.category,
      year: doc.year,
      type: doc.type,
      files: [], // We can't populate this as we don't store the actual files
    });
  };

  const handleSaveEdit = () => {
    if (Object.values(formData).every(value => value)) {
      const updatedDocuments = documents.map((doc, index) =>
        index === editingIndex ? { ...doc, ...formData, updatedOn: new Date().toISOString().split('T')[0] } : doc
      );
      setDocuments(updatedDocuments);
      setFormData({
        title: '',
        subject: '',
        category: '',
        year: '',
        type: '',
        files: [],
      });
      setEditingIndex(null);
    }
  };

  const handleDeleteDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const filteredDocuments = documents.filter(doc =>
    Object.values(doc).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalItems = filteredDocuments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-1">
      <h1 className="text-xl mb-4 font-semibold">DOCUMENT MANAGEMENT</h1>
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <div className="mb-4 bg-slate-100 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            />
            <input
              type="text"
              placeholder="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select Category</option>
              {categoryOptions.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select Year</option>
              {yearOptions.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select Type</option>
              {typeOptions.map((type, index) => (
                <option key={index} value={type}>{type}</option>
              ))}
            </select>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="p-2 border rounded-md outline-none"
            />
          </div>
          <div className="mt-3 flex justify-start">
            {editingIndex === null ? (
              <button onClick={handleAddDocument} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Add Document
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
                <th className="border p-2 text-left">Title</th>
                <th className="border p-2 text-left">File No</th>
                <th className="border p-2 text-left">Subject</th>
                <th className="border p-2 text-left">Version</th>
                <th className="border p-2 text-left">Created On</th>
                <th className="border p-2 text-left">Updated On</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Year</th>
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-left">EID</th>
                <th className="border p-2 text-left">Department</th>
                <th className="border p-2 text-left">Branch</th>
                <th className="border p-2 text-left">Approval</th>
                <th className="border p-2 text-left">Edit</th>
                <th className="border p-2 text-left">Delete</th>
                <th className="border p-2 text-left">View</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDocuments.map((doc, index) => (
                <tr key={doc.id}>
                  <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border p-2">{doc.title}</td>
                  <td className="border p-2">{doc.fileNo}</td>
                  <td className="border p-2">{doc.subject}</td>
                  <td className="border p-2">{doc.version}</td>
                  <td className="border p-2">{doc.createdOn}</td>
                  <td className="border p-2">{doc.updatedOn}</td>
                  <td className="border p-2">{doc.category}</td>
                  <td className="border p-2">{doc.year}</td>
                  <td className="border p-2">{doc.type}</td>
                  <td className="border p-2">{doc.employeeID}</td>
                  <td className="border p-2">{doc.employeeDepartment}</td>
                  <td className="border p-2">{doc.employeeBranch}</td>
                  <td className="border p-2">{doc.approvalStatus}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEditDocument(index)}>
                      <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
                    <button onClick={() => handleDeleteDocument(doc.id)}>
                      <TrashIcon className="h-6 w-6 text-white bg-red-500 rounded-xl p-1 ml-2" />
                    </button>
                  </td>
                  <td className="border p-2">
                  <button>
                      <EyeIcon className="h-6 w-6 bg-green-400 rounded-xl p-1 text-white">
                      </EyeIcon>
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

export default Document;