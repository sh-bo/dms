import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PencilIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  EyeIcon,
  XMarkIcon,
  PrinterIcon,
} from "@heroicons/react/24/solid";

const DocumentManagement = ({fieldsDisabled}) => {
  const [formData, setFormData] = useState({
    fileNo: "",
    title: "",
    subject: "",
    version: "",
    category: null,
    uploadedFilePaths: [], // To store paths of uploaded files
  });
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState({ paths: [] });
  const [isUploadEnabled, setIsUploadEnabled] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [editingDoc, setEditingDoc] = useState(null); // To hold the document being edited
  const [updatedDoc, setUpdatedDoc] = useState(null);

  const token = localStorage.getItem("tokenKey");
  const UserId = localStorage.getItem("userId");

  // Run this effect only when component mounts
  useEffect(() => {
    fetchCategory();
    fetchDocuments();
    fetchPaths();
  }, []); // Add an empty dependency array to avoid infinite re-renders

  const handleCategoryChange = (e) => {
    const selectedCategory = categoryOptions.find(
      (category) => category.id === parseInt(e.target.value)
    );
    setFormData({ ...formData, category: selectedCategory });
  };

  // Update upload button enable status based on form data
  useEffect(() => {
    const { fileNo, title, subject, version, category } = formData;
    const isFormFilled =
      fileNo &&
      title &&
      subject &&
      version &&
      category &&
      selectedFiles.length > 0;
    setIsUploadEnabled(isFormFilled);
  }, [formData, selectedFiles]);

  // Fetch categories
  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/CategoryMaster/findActiveCategory",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategoryOptions(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Function to fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/documents/pending/employee/${UserId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDocuments(response.data);
      setTotalItems(response.data.length);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const fetchPaths = async (doc) => {
    try {
      const token = localStorage.getItem("tokenKey");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const response = await axios.get(
        `http://localhost:8080/api/documents/byDocumentHeader/${doc.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("paths", response.data);

      setSelectedDoc((prevDoc) => ({
        ...prevDoc,
        paths: response.data || [], // Ensure paths is an array
      }));
    } catch (error) {
      console.error("Error fetching documents:", error.message || error);
    }
  };

  const openFile = async (file) => {
    const token = localStorage.getItem("tokenKey"); // Get the token from localStorage
    const createdOnDate = new Date(file.createdOn); // Convert timestamp to Date object
    const year = createdOnDate.getFullYear(); // Extract year
    const month = String(createdOnDate.getMonth() + 1).padStart(2, "0"); // Extract month and pad with zero
    const category = file.documentHeader.categoryMaster.name; // Assuming categoryMaster has categoryName field
    const fileName = file.docName; // The file name
  
    // Construct the URL based on the Spring Boot @GetMapping pattern
    const fileUrl = `http://localhost:8080/api/documents/${year}/${month}/${category}/${fileName}`;
  
    try {
      // Fetch the file using axios and pass the token in the headers
      const response = await axios.get(fileUrl, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' // Important to get the response as a blob (binary large object)
      });
  
      // Create a blob from the response and specify it as a PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const blobUrl = window.URL.createObjectURL(blob);
  
      // Open the blob in a new tab
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Error fetching file:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return date.toLocaleString("en-GB", options).replace(",", "");
  };

  // Handle file uploads but do not save paths to the DB yet
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setSelectedFiles(files);
      setIsUploadEnabled(true);
    } else {
      setIsUploadEnabled(false);
    }
  };

  // Handle the file upload when the "Upload" button is clicked
  const handleUploadDocument = async () => {
    if (selectedFiles.length === 0) {
      alert("Please select at least one file to upload.");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("category", formData.category.name); // Update to send the category name, if needed
    selectedFiles.forEach((file) => {
      uploadData.append("files", file); // Append files to FormData
    });

    try {
      const response = await fetch(
        "http://localhost:8080/api/documents/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("File uploaded successfully:", result);

      const filePaths = result; // This should directly match your expected response format

      if (
        Array.isArray(filePaths) &&
        filePaths.every((path) => typeof path === "string")
      ) {
        setFormData((prevData) => ({
          ...prevData,
          uploadedFilePaths: filePaths,
        }));

        setUploadedFileNames(selectedFiles.map((file) => file.name));

        alert("Files uploaded successfully!");

        setSelectedFiles([]);
        setIsUploadEnabled(false);
      } else {
        throw new Error("Invalid file paths returned from upload.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("There was an error uploading the file. Please try again.");
    }
  };

  // Handle adding the document
  const handleAddDocument = async () => {
    if (
      !formData.fileNo ||
      !formData.title ||
      !formData.subject ||
      !formData.version ||
      !formData.category ||
      formData.uploadedFilePaths.length === 0
    ) {
      alert("Please fill in all the required fields and upload a file.");
      return;
    }

    const payload = {
      documentHeader: {
        fileNo: formData.fileNo,
        title: formData.title,
        subject: formData.subject,
        version: formData.version,
        categoryMaster: { id: formData.category.id },
        employee: { id: parseInt(UserId, 10) },
      },
      filePaths: formData.uploadedFilePaths,
    };

    try {
      const response = await fetch("http://localhost:8080/api/documents/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      alert("Document saved successfully!");

      setFormData({
        fileNo: "",
        title: "",
        subject: "",
        version: "",
        category: null,
        uploadedFilePaths: [],
      });

      setUploadedFileNames([]);
      fetchDocuments();
    } catch (error) {
      console.error("Error saving document:", error);
      alert("There was an error saving the document. Please try again.");
    }
  };

  const handleEditDocument = (doc) => {
    console.log("Editing document:", doc);
    setEditingDoc(doc); 
    setFormData({
      fileNo: doc.fileNo,
      title: doc.title,
      subject: doc.subject,
      version: doc.version,
      category: doc.categoryMaster || null, 
      uploadedFilePaths: doc.filePaths || [], 
    });
  };

const handleSaveEdit = () => {
  const payload = {
    documentHeader: formData, // formData contains fields like fileNo, title, subject, etc.
    filePaths: uploadedFileNames, // List of uploaded file names
  };

  // Make an API call to update the document
  fetch('http://localhost:8080/api/documents/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  })
    .then((response) => {
      if (response.ok) {
        return response.json(); // Or handle the response message
      } else {
        throw new Error('Error updating document');
      }
    })
    .then((data) => {
      console.log('Document updated successfully:', data);
      // Reset the form and state
      setFormData({
        fileNo: '',
        title: '',
        subject: '',
        version: '',
        category: { id: '' },
      });
      setUploadedFileNames([]);
      setEditingDoc(null); // Reset editing state
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('An error occurred while updating the document');
    });
};

  

  const handleDiscardFile = (index) => {
    if (index < 0 || index >= uploadedFileNames.length) {
      console.error("Invalid index:", index);
      return;
    }

    const updatedFiles = uploadedFileNames.filter((_, i) => i !== index);
    const updatedPaths = formData.uploadedFilePaths.filter(
      (_, i) => i !== index
    );

    setUploadedFileNames(updatedFiles);
    setFormData({ ...formData, uploadedFilePaths: updatedPaths });
  };

  // Handle discard all files
  const handleDiscardAll = () => {
    setUploadedFileNames([]);
    setFormData({ ...formData, uploadedFilePaths: [] });
  };

  const openModal = (doc) => {
    setSelectedDoc(doc); // Set the selected document without paths first
    fetchPaths(doc); // Fetch paths and update the selected document with paths
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedDoc(null);
  };

  const printPage = () => {
    window.print(); // Simple print functionality
  };

  const paginatedDocuments = documents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-1">
      <h1 className="text-xl mb-4 font-semibold">DOCUMENT MANAGEMENT</h1>
      <div className="bg-white p-3 rounded-lg shadow-sm">
        <div className="mb-4 bg-slate-100 p-4 rounded-lg">
          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="File No."
              name="fileNo"
              value={formData.fileNo}
              onChange={(e) =>
                setFormData({ ...formData, fileNo: e.target.value })
              }
              disabled={fieldsDisabled}
              className="p-2 border rounded-md outline-none"
            />
            <input
              type="text"
              placeholder="Title"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              disabled={fieldsDisabled}
              className="p-2 border rounded-md outline-none"
            />
            <input
              type="text"
              placeholder="Subject"
              name="subject"
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              disabled={fieldsDisabled}
              className="p-2 border rounded-md outline-none"
            />
            <input
              type="text"
              placeholder="Version"
              name="version"
              value={formData.version}
              onChange={(e) =>
                setFormData({ ...formData, version: e.target.value })
              }
              disabled={fieldsDisabled}
              className="p-2 border rounded-md outline-none"
            />

            <select
              name="category"
              value={formData.category?.id || ""}
              onChange={handleCategoryChange}
              className="p-2 border rounded-md outline-none"
            >
              <option value="">Select category</option>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div>
              <div className="flex">
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileChange}
                  className="p-2 border rounded-md outline-none w-full"
                />
                <button
                  onClick={handleUploadDocument} // Upload files when clicked
                  disabled={!isUploadEnabled} // Disable button if no files are selected
                  className={`ml-2 text-white rounded-xl p-2 ${
                    isUploadEnabled ? "bg-rose-900" : "bg-gray-400"
                  }`}
                >
                  Upload
                </button>
              </div>
            </div>
          </div>

          {/* Add Document Button */}
          <div className="mt-3 flex justify-start">
            {editingDoc === null ? (
              <button
                onClick={handleAddDocument}
                className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Add Document
              </button>
            ) : (
              <button
                onClick={handleSaveEdit}
                className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center"
              >
                <CheckCircleIcon className="h-5 w-5 mr-1" /> Update
              </button>
            )}
          </div>

          {/* Display Uploaded File Names */}
          {uploadedFileNames.length > 0 && (
            <div className="p-4 bg-slate-100 rounded-lg">
              <div className="flex flex-wrap gap-4">
                {uploadedFileNames.map((fileName, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <span>{fileName}</span>
                    <button
                      onClick={() => handleDiscardFile(index)}
                      className="text-red-500"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-red-500" onClick={handleDiscardAll}>
                Discard All
              </button>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-2 text-left">SR.</th>
                <th className="border p-2 text-left">File No</th>
                <th className="border p-2 text-left">Title</th>
                <th className="border p-2 text-left">Subject</th>
                <th className="border p-2 text-left">Version</th>
                <th className="border p-2 text-left">Category</th>
                <th className="border p-2 text-left">Approval Status</th>
                <th className="border p-2 text-left">Uploaded Date</th>
                <th className="border p-2 text-left">Edit</th>
                <th className="border p-2 text-left">View</th>
              </tr>
            </thead>
            <tbody>
              {paginatedDocuments.map((doc, index) => (
                <tr key={doc.id}>
                  <td className="border p-2">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="border p-2">{doc.fileNo}</td>
                  <td className="border p-2">{doc.title}</td>
                  <td className="border p-2">{doc.subject}</td>
                  <td className="border p-2">{doc.version}</td>
                  <td className="border p-2">
                    {doc.categoryMaster
                      ? doc.categoryMaster.name
                      : "No Category"}
                  </td>
                  <td className="border p-2">{doc.approvalStatus}</td>
                  <td className="border p-2">{formatDate(doc.createdOn)}</td>
                  <td className="border p-2">
                  <button onClick={() => handleEditDocument(doc)}>
                  <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
                </button>
                  </td>
                  <td className="border p-2">
                    <button onClick={() => openModal(doc)}>
                      <EyeIcon className="h-6 w-6 bg-green-400 rounded-xl p-1 text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <>
            {isOpen && selectedDoc && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
              <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
                {/* Print Button */}
                <button
                  className="absolute top-2 right-10 text-gray-500 hover:text-gray-700 no-print"
                  onClick={printPage}
                >
                  <PrinterIcon className="h-6 w-6" />
                </button>

                {/* Close Button */}
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 no-print"
                  onClick={closeModal}
                >
                  <XMarkIcon className="h-6 w-6 text-black hover:text-white hover:bg-red-800" />
                </button>


                  {/* Modal Content Divided into Two Halves */}
                  <div className="h-1/2 flex flex-col justify-between">
                    {/* Top Half */}
                    <div className="flex justify-between items-center mb-4 mt-4">
                      <div className="flex items-start space-x-1">
                        <p className="text-sm text-black font-bold border-b-4 border-black">
                          D
                        </p>
                        <p className="text-sm text-black font-bold border-t-4 border-black">
                          MS
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          <strong>Uploaded Date:</strong>{" "}
                          {formatDate(selectedDoc?.createdOn)}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Half */}
                    <div className="text-left">
                      <p className="text-sm text-gray-600">
                        <strong>File No.:</strong>{" "}
                        {selectedDoc?.fileNo || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Title:</strong> {selectedDoc?.title || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Subject:</strong>{" "}
                        {selectedDoc?.subject || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Version:</strong>{" "}
                        {selectedDoc?.version || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Category:</strong>{" "}
                        {selectedDoc?.categoryMaster?.name || "No Category"}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="h-1/2 flex flex-col items-center justify-center mt-4">
                    <h1 className="text-sm text-center font-bold mb-2">
                      Attached Files
                    </h1>

                    {Array.isArray(selectedDoc.paths) &&
                    selectedDoc.paths.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {selectedDoc.paths.map((file, index) => (
                          <li key={index} className="mb-2">
                            <span className="mr-4">{file.docName}</span>
                            <button
                              onClick={() => openFile(file)} // Pass the file object to openFile function
                              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                            >
                              Open
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500">
                        No attached files available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;
