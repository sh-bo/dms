import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { YEAR_API, CATEGORI_API, TYPE_API, DOCUMENTHEADER_API } from '../API/apiConfig';
import { ArrowLeftIcon, ArrowRightIcon, PencilIcon, TrashIcon, MagnifyingGlassIcon, PlusCircleIcon, CheckCircleIcon, EyeIcon } from '@heroicons/react/24/solid';

const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    category: '',
    year: '',
    type: '',
    file: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);

  useEffect(() => {
    fetchOptions();
    fetchDocuments();
  }, []);

  const fetchOptions = async () => {
    try {
      const [categoryRes, yearRes, typeRes] = await Promise.all([
        axios.get(`${CATEGORI_API}/findAll`),
        axios.get(`${YEAR_API}/findAll`),
        axios.get(`${TYPE_API}/findAll`)
      ]);
      setCategoryOptions(categoryRes.data);
      setYearOptions(yearRes.data);
      setTypeOptions(typeRes.data);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${DOCUMENTHEADER_API}/findAll`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const handleAddDocument = async () => {
    if (formData.title && formData.subject && formData.category && formData.year && formData.type) {
      const newDocument = {
        title: formData.title,
        fileNo: `DOC${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        subject: formData.subject,
        version: '1.0',
        createdOn: new Date().toISOString(),
        updatedOn: new Date().toISOString(),
        isApproved: false,
        category: formData.category ? { id: parseInt(formData.category, 10) } : null,
        year: formData.year ? { id: parseInt(formData.year, 10) } : null,
        type: formData.type ? { id: parseInt(formData.type, 10) } : null,
        employee: null,
        department: null,
        branch: null
      };

      try {
        await axios.post(`${DOCUMENTHEADER_API}/save`, newDocument, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        fetchDocuments(); // Refresh the document list
        setFormData({
          title: '',
          subject: '',
          category: '',
          year: '',
          type: '',
          file: null
        });
        setCurrentPage(1); // Optionally, reset pagination
      } catch (error) {
        console.error('Error adding document:', error.response ? error.response.data : error.message);
      }
    } else {
      console.error('Form data is incomplete:', formData);
    }
  };

  // const handleSaveEdit = async () => {
  //   if (formData.title && formData.subject && formData.category && formData.year && formData.type) {
  //     const updatedDocument = {
  //       ...documents[editingIndex],
  //       ...formData,
  //       updatedOn: new Date().toISOString(),
  //       category: formData.category ? { id: parseInt(formData.category, 10) } : null,
  //       year: formData.year ? { id: parseInt(formData.year, 10) } : null,
  //       type: formData.type ? { id: parseInt(formData.type, 10) } : null,
  //       employee: null,
  //       department: null,
  //       branch: null
  //     };
  
  //     try {
  //       await axios.put(`${DOCUMENTHEADER_API}/update/${updatedDocument.id}`, updatedDocument);
  //       fetchDocuments(); // Refresh the document list, keeping the current page
  //       setFormData({
  //         title: '',
  //         subject: '',
  //         category: '',
  //         year: '',
  //         type: '',
  //         file: null
  //       });
  //       setEditingIndex(null);
  //     } catch (error) {
  //       console.error('Error saving document:', error);
  //     }
  //   } else {
  //     console.error('Form data is incomplete:', formData);
  //   }
  // };
  
  const handleSaveEdit = async () => {
    console.log("Saving edited document with data:", formData); // Debugging statement
  
    if (formData.title && formData.subject && formData.category && formData.year && formData.type) {
      const updatedDocument = {
        ...documents[editingIndex],
        ...formData,
        updatedOn: new Date().toISOString(),
        category: formData.category ? { id: parseInt(formData.category, 10) } : null,
        year: formData.year ? { id: parseInt(formData.year, 10) } : null,
        type: formData.type ? { id: parseInt(formData.type, 10) } : null,
        employee: null,
        department: null,
        branch: null
      };
  
      try {
        await axios.put(`${DOCUMENTHEADER_API}/update/${updatedDocument.id}`, updatedDocument);
        console.log("Document updated successfully");
        // Refetch documents after updating
        fetchDocuments();
        setFormData({
          title: '',
          subject: '',
          category: '',
          year: '',
          type: '',
          file: null
        });
        setEditingIndex(null);
      } catch (error) {
        console.error('Error saving document:', error);
      }
    } else {
      console.error('Form data is incomplete:', formData);
    }
  };
  

  const handleEditDocument = (index) => {
    setEditingIndex(index);
    const doc = documents[index];
    setFormData({
      title: doc.title || '',
      subject: doc.subject || '',
      category: doc.category ? doc.category.id : '',
      year: doc.year ? doc.year.id : '',
      type: doc.type ? doc.type.id : '',
      file: null
    });
  };

  const handleDeleteDocument = async (id) => {
    try {
      await axios.delete(`${DOCUMENTHEADER_API}/delete/${id}`);
      fetchDocuments(); // Refresh the document list
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const filteredDocuments = documents.filter(doc =>
    Object.values(doc).some(value =>
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
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
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>{category.name || 'N/A'}</option>
              ))}
            </select>
            <select
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select Year</option>
              {yearOptions.map((year) => (
                <option key={year.id} value={year.id}>{year.name || 'N/A'}</option>
              ))}
            </select>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select Type</option>
              {typeOptions.map((type) => (
                <option key={type.id} value={type.id}>{type.name || 'N/A'}</option>
              ))}
            </select>
            <input
              type="file"
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
                <CheckCircleIcon className="h-5 w-5 mr-1" /> Save Changes
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
              placeholder="Search"
              className="p-2 border rounded-l-lg outline-none"
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
                  <td className="border p-2">{new Date(doc.createdOn).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(doc.updatedOn).toLocaleDateString()}</td>
                  <td className="border p-2">{doc.category ? doc.category.name : 'N/A'}</td>
                  <td className="border p-2">{doc.year ? doc.year.name : 'N/A'}</td>
                  <td className="border p-2">{doc.type ? doc.type.name : 'N/A'}</td>
                  <td className="border p-2">{doc.employee ? doc.employee.id : 'N/A'}</td>
                  <td className="border p-2">{doc.department ? doc.department.name : 'N/A'}</td>
                  <td className="border p-2">{doc.branch ? doc.branch.name : 'N/A'}</td>
                  <td className="border p-2">{doc.isApproved ? 'Approved' : 'Not Approved'}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEditDocument(documents.findIndex(d => d.id === doc.id))}>
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
                      <EyeIcon className="h-6 w-6 bg-green-400 rounded-xl p-1 text-white" />
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
