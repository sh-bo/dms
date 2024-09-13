import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { YEAR_API, CATEGORI_API, TYPE_API, DOCUMENTHEADER_API, UPLOADFILE_API } from '../API/apiConfig';
import { ArrowLeftIcon, ArrowRightIcon, PencilIcon, LockClosedIcon, LockOpenIcon, MagnifyingGlassIcon, PlusCircleIcon, CheckCircleIcon, EyeIcon, XMarkIcon } from '@heroicons/react/24/solid';

const tokenKey = 'tokenKey';
const Document = () => {
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    category: null,
    year: null,
    type: null,
    file: null
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [filePaths, setFilePaths] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [documentToToggle, setDocumentToToggle] = useState(null);
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [isUploadEnabled, setIsUploadEnabled] = useState(false);



  const token = localStorage.getItem('tokenKey'); // Retrieve token from local storage

  useEffect(() => {
    const { title, subject, category, year, type } = formData;
    const isFormFilled = title && subject && category && year && type && selectedFiles.length > 0;
    setIsUploadEnabled(isFormFilled);
  }, [formData, selectedFiles]);

  useEffect(() => {
    fetchOptions();
    fetchDocuments();
  },);

  // All Fetching Functions
  const fetchOptions = async () => {
    try {
      const [categoryRes, yearRes, typeRes] = await Promise.all([
        axios.get(`${CATEGORI_API}/findAll`, {
          headers: {
            'Authorization': `Bearer ${token}` // Add token to the headers
          }
        }),
        axios.get(`${YEAR_API}/findAll`, {
          headers: {
            'Authorization': `Bearer ${token}` // Add token to the headers
          }
        }),
        axios.get(`${TYPE_API}/findAll`, {
          headers: {
            'Authorization': `Bearer ${token}` // Add token to the headers
          }
        })
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
      const response = await axios.get(`${DOCUMENTHEADER_API}/find-all`, {
        headers: {
          'Authorization': `Bearer ${token}` // Add token to the headers
        }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  // Input Condition Functions
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Allow only letters and spaces
    const regex = /^[A-Za-z\s]*$/;

    if (regex.test(value) || value === "") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // All Upload PDF Functions
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.type === 'application/pdf');
    if (validFiles.length !== files.length) {
      alert('Only PDF files are allowed.');
    }
    setSelectedFiles(validFiles);
    setFilePaths(validFiles.map(file => file.name)); // Track file names
  };

  const handleDiscard = () => {
    setUploadedFileNames([]);// Re-enable the fields when all files are discarded
  };

  const handleDiscardAll = () => {
    setUploadedFileNames([]);
    setFieldsDisabled(false);
  };

  const handleDiscardFile = (index) => {
    const updatedFileNames = [...uploadedFileNames];
    updatedFileNames.splice(index, 1);
    setUploadedFileNames(updatedFileNames);

    if (updatedFileNames.length === 0) {
      setFieldsDisabled(false); // Re-enable fields if no files are left
    }
  };

  const handleUpload = async () => {
    if (!isUploadEnabled) return;

    const formDataToUpload = new FormData();
    Array.from(selectedFiles).forEach(file => {
      formDataToUpload.append('images', file);
    });

    try {
      const response = await fetch(`${UPLOADFILE_API}/File`, {
        method: 'POST',
        body: formDataToUpload,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.text();
        alert(`Files uploaded successfully: ${result}`);
        setUploadedFileNames([...uploadedFileNames, ...Array.from(selectedFiles).map(file => file.name)]);
        setSelectedFiles([]);
        setFieldsDisabled(true);
      } else {
        const errorText = await response.text();
        alert(`Failed to upload files: ${errorText}`);
        console.error(`Failed to upload files: ${errorText}`);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Error uploading files');
    }
  };


  const getFileStyle = (fileName) => {
    if (fileName.endsWith('.pdf')) {
      return { color: '#4a5568', backgroundColor: '#e2e8f0' }; // Blue-grey for PDFs
    } else if (fileName.endsWith('.docx')) {
      return { color: '#2d3748', backgroundColor: '#f7fafc' }; // Darker grey for DOCX
    }
    return { color: '#4a5568', backgroundColor: '#f1f5f9' }; // Default style
  };

  const handleViewClick = (file) => {
    const fileUrl = URL.createObjectURL(file);
    window.open(fileUrl, '_blank');
  };


  const handleSelectChange = (e, type) => {
    const selectedValue = e.target.value;
    let selected;

    switch (type) {
      case 'category':
        selected = categoryOptions.find(category => category.id === parseInt(selectedValue));
        setFormData({ ...formData, category: selected });
        break;
      case 'year':
        selected = yearOptions.find(year => year.id === parseInt(selectedValue));
        setFormData({ ...formData, year: selected });
        break;
      case 'type':
        selected = typeOptions.find(type => type.id === parseInt(selectedValue));
        setFormData({ ...formData, type: selected });
        break;
      default:
        break;
    }
  };

  // All Document Oprations Functions
  //ADD
  // const handleAddDocument = async () => {
  //   if (formData.title && formData.subject && formData.category && formData.year && formData.type) {
  //     const newDocument = {
  //       title: formData.title,
  //       fileNo: `DOC${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
  //       subject: formData.subject,
  //       version: '1.0',
  //       createdOn: new Date().toISOString(),
  //       updatedOn: '',
  //       isApproved: false,
  //       category: formData.category ? { id: parseInt(formData.category, 10) } : null,
  //       year: formData.year ? { id: parseInt(formData.year, 10) } : null,
  //       type: formData.type ? { id: parseInt(formData.type, 10) } : null,
  //       employee: null,
  //       department: null,
  //       branch: null
  //     };

  //     try {
  //       await axios.post(`${DOCUMENTHEADER_API}/save`, newDocument, {
  //         headers: {
  //           'Authorization': `Bearer ${token}`, // Add token to the headers
  //           'Content-Type': 'application/json'
  //         }
  //       });
  //       fetchDocuments(); // Refresh the document list
  //       setFormData({
  //         title: '',
  //         subject: '',
  //         category: '',
  //         year: '',
  //         type: '',
  //         file: null
  //       });
  //       setCurrentPage(1); // Optionally, reset pagination
  //       alert('Document added successfully!');
  //     } catch (error) {
  //       console.error('Error adding document:', error.response ? error.response.data : error.message);
  //       alert('Failed to adding the Document. Please try again.');
  //     }
  //   } else {
  //     console.error('Form data is incomplete:', formData); // Debugging statement
  //   }
  // };

  const handleAddDocument = async () => {
    if (formData.title && formData.subject && formData.category && formData.year && formData.type) {
      try {
        const newDocument = {
          title: formData.title,
          fileNo: `DOC${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          subject: formData.subject,
          version: '1.0',
          category: formData.category,
          year: formData.year,
          type: formData.type,
          createdOn: new Date().toISOString(),
          updatedOn: new Date().toISOString(),
          isActive: formData.isActive ? 1 : 0,
          isApproved: false,
          employee: null,
          department: null,
          branch: null
        };
        const response = await axios.post(`${DOCUMENTHEADER_API}/save`, newDocument, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setDocuments([...documents, response.data]);
        setFormData({ title: '', subject: '', type: null, year: null, category: null, file: null, isApproved: false, isActive: true });
        alert('Document added successfully!');
      } catch (error) {
        console.error('Error adding Document:', error);
        alert('Failed to adding the Document. Please try again.');
      }
    } else {
      alert('Form data is incomplete');
    }
  };

  //UPDATE
  // const handleEditDocument = (index) => {
  //   setEditingIndex(index);
  //   const doc = documents[index];
  //   setFormData({
  //     title: doc.title || '',
  //     subject: doc.subject || '',
  //     category: doc.category ? doc.category.id : '',
  //     year: doc.year ? doc.year.id : '',
  //     type: doc.type ? doc.type.id : '',
  //     file: null
  //   });
  // };
  const handleEditDocument = (index) => {
    setEditingIndex(index);
    setFormData(documents[index]);
  };
  
  // const handleSaveEdit = async () => {
  //   if (formData.title && formData.subject && formData.category && formData.year && formData.type) {
  //     try {
  //       const updatedDepartment = {
  //         ...formData,
  //         updatedOn: new Date().toISOString(),
  //         isActive: formData.isActive ? 1 : 0,
  //       };
  //       const response = await axios.put(`${DEPAETMENT_API}/update/${formData.id}`, updatedDepartment, {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });
  //       const updatedDepartments = departments.map((department, index) =>
  //         index === editingIndex ? response.data : department
  //       );
  //       setDepartments(updatedDepartments);
  //       setFormData({ name: '', branch: null, isActive: true });
  //       setEditingIndex(null);
  //       alert('Department updated successfully!');
  //     } catch (error) {
  //       console.error('Error updating department:', error);
  //       alert('Failed to updating the Department. Please try again.');
  //     }
  //   } else {
  //     console.error('Form data is incomplete');
  //   }
  // };
  const handleSaveEdit = async () => {
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
        await axios.put(`${DOCUMENTHEADER_API}/update/${updatedDocument.id}`, updatedDocument, {
          headers: {
            'Authorization': `Bearer ${token}` // Add token to the headers
          }
        });
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
        alert('Document updated successfully!');
      } catch (error) {
        console.error('Error saving document:', error);
        alert('Failed to updating the Document. Please try again.');
      }
    } else {
      console.error('Form data is incomplete:', formData);
    }
  };

  //SOFT DELETE
  const handleToggleActiveStatus = (document) => {
    setDocumentToToggle(document);
    setModalVisible(true);
  };

  const confirmToggleActiveStatus = async () => {
    if (documentToToggle) {
      try {
        const updatedDocument = {
          ...documentToToggle,
          isActive: documentToToggle.isActive === 1 ? 0 : 1, // Toggle between 1 and 0
          updatedOn: new Date().toISOString(),
        };

        const token = localStorage.getItem(tokenKey); // Retrieve token from local storage
        const response = await axios.put(
          `${DOCUMENTHEADER_API}/update/status/active/${updatedDocument.id}`, // Update API endpoint
          updatedDocument,
          {
            headers: {
              'Content-Document': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const updatedDocuments = documents.map(document =>
          document.id === updatedDocument.id ? response.data : document
        );
        setDocuments(updatedDocuments);
        setModalVisible(false);
        setDocumentToToggle(null);
        alert('Status Changed successfully!');
      } catch (error) {
        console.error('Error toggling Document status:', error.response ? error.response.data : error.message);
        alert('Failed to changing the status. Please try again.');
      }
    } else {
      console.error('No Document selected for status toggle');
    }
  };

  // DATE FOMATE
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      // hour12: true 
    };
    return date.toLocaleString('en-GB', options).replace(',', '');
  };

  // All FIlTERS
  const filteredDocuments = documents.filter(document => {
    const statusText = document.isActive === 1 ? 'active' : 'inactive';
    const createdOnText = formatDate(document.createdOn);
    const updatedOnText = formatDate(document.updatedOn);

    const search = searchTerm.toLowerCase();

    return (
      (typeof document.title === 'string' && document.title.toLowerCase().includes(search)) ||
      (typeof document.type === 'string' && document.type.toLowerCase().includes(search)) ||
      (typeof document.category === 'string' && document.category.toLowerCase().includes(search)) ||
      (typeof document.subject === 'string' && document.subject.toLowerCase().includes(search)) ||
      statusText.includes(search) ||
      createdOnText.includes(search) ||
      updatedOnText.includes(search)
    );
  });
  const sortedDocuments = filteredDocuments.sort((a, b) => b.isActive - a.isActive);

  const totalItems = sortedDocuments.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedDocuments = sortedDocuments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
              disabled={fieldsDisabled}
              className="p-2 border rounded-md outline-none"
            />
            <input
              type="text"
              placeholder="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              disabled={fieldsDisabled}
              className="p-2 border rounded-md outline-none"
            />
            <select
              name="category"
              value={formData.category?.id || ""}
              onChange={(e) => handleSelectChange(e, 'category')}
              disabled={fieldsDisabled}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select Category</option>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              name="year"
              value={formData.year?.id || ""}
              onChange={(e) => handleSelectChange(e, 'year')}
              disabled={fieldsDisabled}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select Year</option>
              {yearOptions.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>

            <select
              name="type"
              value={formData.type?.id || ""}
              onChange={(e) => handleSelectChange(e, 'type')}
              disabled={fieldsDisabled}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select Type</option>
              {typeOptions.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>

            <div>
              <div className='flex'>

                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="p-2 border rounded-md outline-none w-full"
                />
                <button
                  onClick={handleUpload}
                  disabled={!isUploadEnabled}
                  className={`ml-2 text-white rounded-xl p-2 ${isUploadEnabled ? 'bg-rose-900' : 'bg-gray-400'}`}
                >
                  Upload
                </button>

              </div>
            </div>
          </div>
          <div className="mt-3 flex justify-start">
            {editingIndex === null ? (
              <button onClick={handleAddDocument} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Add Document
              </button>
            ) : (
              <button onClick={handleSaveEdit} className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center">
                <CheckCircleIcon className="h-5 w-5 mr-1" /> Update
              </button>
            )}
          </div>
        </div>

        <>
          {uploadedFileNames.length > 0 && (
            <div className="p-4 bg-slate-100 rounded-lg">
              <div className="flex flex-wrap gap-4">
                {uploadedFileNames.map((fileName, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      border: '1px solid #e2e8f0',
                      ...getFileStyle(fileName), // Apply the style based on filename
                    }}
                  >
                    <span className="mr-4">{fileName}</span>
                    <button
                      style={{ color: '#ef4444', cursor: 'pointer', background: 'none', border: 'none' }}
                      onClick={() => handleDiscardFile(index)}
                    >
                      <XMarkIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="mt-4 text-red-500"
                onClick={handleDiscardAll}
              >
                Discard All
              </button>
            </div>
          )}
        </>

        <div className="my-4 bg-slate-100 p-4 rounded-lg flex justify-between items-center">
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
                {/* <th className="border p-2 text-left">Created On</th> */}
                <th className="border p-2 text-left">Updated On</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Year</th>
                {/* <th className="border p-2 text-left">Type</th> */}
                {/* <th className="border p-2 text-left">EID</th> */}
                {/* <th className="border p-2 text-left">Department</th> */}
                {/* <th className="border p-2 text-left">Branch</th> */}
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Approval</th>
                <th className="border p-2 text-left">Edit</th>
                <th className="border p-2 text-left">Access</th>
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
                  {/* <td className="border px-4 py-2">{formatDate(doc.createdOn)}</td> */}
                  <td className="border px-4 py-2">{formatDate(doc.updatedOn)}</td>
                  <td className="border p-2">{doc.category ? doc.category.name : ''}</td>
                  <td className="border p-2">{doc.year ? doc.year.name : ''}</td>
                  {/* <td className="border p-2">{doc.type ? doc.type.name : ''}</td> */}
                  {/* <td className="border p-2">{doc.employee ? doc.employee.id : 'N/A'}</td> */}
                  {/* <td className="border p-2">{doc.department ? doc.department.name : ''}</td> */}
                  {/* <td className="border p-2">{doc.branch ? doc.branch.name : ''}</td> */}
                  <td className="border p-2">{doc.isActive === 1 ? 'Active' : 'Inactive'}</td>
                  <td className="border p-2">{doc.approved ? 'Approved' : 'Not Approved'}</td>
                  <td className="border p-2">
                    <button onClick={() => handleEditDocument(documents.findIndex(d => d.id === doc.id))}>
                      <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleToggleActiveStatus(doc)}
                      className={`p-1 rounded-full ${doc.isActive === 1 ? 'bg-green-500' : 'bg-red-500'}`}
                    >
                      {doc.isActive === 1 ? (
                        <LockOpenIcon className="h-5 w-5 text-white p-0.5" />
                      ) : (
                        <LockClosedIcon className="h-5 w-5 text-white p-0.5" />
                      )}
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
        {isModalOpen && selectedDocument && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 p-4">
            <div className="bg-white p-6 rounded-lg max-w-3xl w-full mx-auto relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 p-1 rounded-full text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <h2 className="text-xl font-semibold mb-4">File Preview</h2>
              <div className="mb-4">
                <p className="font-medium">Title: {selectedDocument.title}</p>
                <p className="font-medium">File No: {selectedDocument.fileNo}</p>
                <p className="font-medium">Subject: {selectedDocument.subject}</p>
                <p className="font-medium">Version: {selectedDocument.version}</p>
                <div className="mt-4">
                  {selectedDocument.file && selectedDocument.file.length > 0 ? (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Uploaded Files:</h3>
                      <ul className="space-y-2">
                        {selectedDocument.file.map((file, index) => (
                          <li key={index} className="flex justify-between items-center border-b pb-2">
                            <span className="truncate">{file.name}</span>
                            <button
                              className="bg-blue-500 text-white px-3 py-1 rounded flex items-center space-x-1"
                              onClick={() => handleViewClick(file)}
                            >
                              <EyeIcon className="h-5 w-5" />
                              <span>View</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>No files uploaded.</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
      {modalVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Confirm Status Change</h2>
            <p>Are you sure you want to {documentToToggle?.isActive === 1 ? 'deactivate' : 'activate'} the Document <strong>{documentToToggle.title}</strong>?</p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setModalVisible(false)}
                className="bg-gray-300 text-gray-800 rounded-lg px-4 py-2 mr-2"
              >
                Cancel
              </button>
              <button
                onClick={confirmToggleActiveStatus}
                className="bg-blue-500 text-white rounded-lg px-4 py-2"
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
