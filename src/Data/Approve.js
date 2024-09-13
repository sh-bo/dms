import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassIcon, CheckCircleIcon, XMarkIcon, EyeIcon } from '@heroicons/react/24/solid';
import { DOCUMENTHEADER_API } from '../API/apiConfig';

const Approve = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [documentToApprove, setDocumentToApprove] = useState(null);

  const tokenKey = 'tokenKey'; // Key used to retrieve the token from local storage

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem(tokenKey);
      const response = await axios.get(`${DOCUMENTHEADER_API}/getAllPendingStatus`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleUpdateDocumentStatus = async (id, approved) => {
    try {
      const token = localStorage.getItem(tokenKey);
      await axios.put(`${DOCUMENTHEADER_API}/updatestatus/${id}`, { approved }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDocuments(); // Refresh the document list
      setIsConfirmModalOpen(false); // Close the confirmation modal
      alert('Document Approved successfully!');
    } catch (error) {
      console.error('Error updating document status:', error);
      alert('Failed to approve the document. Please try again.');
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

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4 font-semibold">Document Approval</h1>
      <div className="bg-white p-3 rounded-lg shadow-sm">
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
                <th className="border p-2 text-left">Approve</th>
                <th className="border p-2 text-left">View</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDocuments.map((doc, index) => (
                <tr key={doc.id} className="even:bg-gray-50">
                  <td className="border p-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="border p-2">{doc.title}</td>
                  <td className="border p-2">{doc.fileNo}</td>
                  <td className="border p-2">{doc.subject}</td>
                  <td className="border p-2">{doc.version}</td>
                  <td className="border p-2">{new Date(doc.createdOn).toLocaleDateString()}</td>
                  <td className="border p-2">{new Date(doc.updatedOn).toLocaleDateString()}</td>
                  <td className="border p-2">{doc.category ? doc.category.name : ''}</td>
                  <td className="border p-2">{doc.year ? doc.year.name : ''}</td>
                  <td className="border p-2">{doc.type ? doc.type.name : ''}</td>
                  <td className="border p-2">{doc.employee ? doc.employee.id : 'N/A'}</td>
                  <td className="border p-2">{doc.department ? doc.department.name : ''}</td>
                  <td className="border p-2">{doc.branch ? doc.branch.name : ''}</td>
                  <td className="border p-2">{doc.approved ? 'Approved' : 'Not Approved'}</td>
                  <td className="border p-2">
                    <button onClick={() => { setDocumentToApprove(doc); setIsConfirmModalOpen(true); }}>
                      <CheckCircleIcon className="h-6 w-6 text-white bg-green-500 rounded-full p-1" />
                    </button>
                  </td>
                  <td className="border p-2">
                    <button onClick={() => { setSelectedDocument(doc); setIsModalOpen(true); }}>
                      <EyeIcon className="h-6 w-6 text-white bg-yellow-500 rounded-full p-1" />
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

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Confirm Approval</h2>
            <p>Are you sure you want to approve the document titled <strong>{documentToApprove.title}</strong>?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                onClick={() => handleUpdateDocumentStatus(documentToApprove.id, true)}
              >
                Confirm
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document View Modal */}
      {isModalOpen && selectedDocument && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
            <h2 className="text-xl font-semibold mb-4">Document Details</h2>
            <div>
              <p><strong>Title:</strong> {selectedDocument.title}</p>
              <p><strong>File No:</strong> {selectedDocument.fileNo}</p>
              <p><strong>Subject:</strong> {selectedDocument.subject}</p>
              <p><strong>Version:</strong> {selectedDocument.version}</p>
              <p><strong>Created On:</strong> {new Date(selectedDocument.createdOn).toLocaleDateString()}</p>
              <p><strong>Updated On:</strong> {new Date(selectedDocument.updatedOn).toLocaleDateString()}</p>
              <p><strong>Category:</strong> {selectedDocument.category ? selectedDocument.category.name : ''}</p>
              <p><strong>Year:</strong> {selectedDocument.year ? selectedDocument.year.name : ''}</p>
              <p><strong>Type:</strong> {selectedDocument.type ? selectedDocument.type.name : ''}</p>
              <p><strong>EID:</strong> {selectedDocument.employee ? selectedDocument.employee.id : 'N/A'}</p>
              <p><strong>Department:</strong> {selectedDocument.department ? selectedDocument.department.name : ''}</p>
              <p><strong>Branch:</strong> {selectedDocument.branch ? selectedDocument.branch.name : ''}</p>
              <p><strong>Approval:</strong> {selectedDocument.approved ? 'Approved' : 'Not Approved'}</p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Approve;
