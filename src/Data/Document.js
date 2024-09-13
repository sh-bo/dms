import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  PencilIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

const DocumentManagement = ({ fieldsDisabled }) => {
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
  const [isUploadEnabled, setIsUploadEnabled] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const token = localStorage.getItem("tokenKey");
  const UserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchCategory();
    fetchDocuments();
  }, []);

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
    fileNo && title && subject && version && category && selectedFiles.length > 0;
    setIsUploadEnabled(isFormFilled);
  }, [formData, selectedFiles]);

  // Fetch categories
  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/CategoryMaster/findAll",
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
        const response = await fetch("http://localhost:8080/api/documents/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: uploadData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("File uploaded successfully:", result);

        // Assuming result contains file paths
        const filePaths = result; // This should directly match your expected response format

        // Validate the filePaths array
        if (Array.isArray(filePaths) && filePaths.every(path => typeof path === 'string')) {
            // Update uploaded file paths in state
            setFormData((prevData) => ({
                ...prevData,
                uploadedFilePaths: filePaths,
            }));

            // Store uploaded file names
            setUploadedFileNames(selectedFiles.map((file) => file.name));

            alert("Files uploaded successfully!");

            // Clear the selected files after upload
            setSelectedFiles([]);
            setIsUploadEnabled(false);
        } else {
            throw new Error("Invalid file paths returned from upload.");
        }
        console.log("Uploaded File Paths:", filePaths); // Log the uploaded paths for debugging
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("There was an error uploading the file. Please try again.");
    }
};


  // Handle adding the document
  const handleAddDocument = async () => {
    // Check for required fields
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
  
    // Prepare the payload for the API call
    const payload = {
      documentHeader: {
        fileNo: formData.fileNo,
        title: formData.title,
        subject: formData.subject,
        version: formData.version,
        categoryMaster: { id: formData.category.id },
        employee: { id: parseInt(UserId, 10) },
      },
      filePaths: formData.uploadedFilePaths, // Always use the current uploaded file paths
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
  
      // Check for a successful response
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      alert("Document saved successfully!");
  
      // Reset form data after successful save
      setFormData({
        fileNo: "",
        title: "",
        subject: "",
        version: "",
        category: null,
        uploadedFilePaths: [], // Resetting uploaded file paths
      });
  
      setUploadedFileNames([]); // Clear the uploaded file names
  
      fetchDocuments(); // Refresh the documents list after save
    } catch (error) {
      console.error("Error saving document:", error);
      alert("There was an error saving the document. Please try again.");
    }
  };
  
  const handleDiscardFile = (index) => {
    console.log("Before discarding:");
    console.log("Uploaded File Names:", uploadedFileNames);
    console.log("Uploaded File Paths:", formData.uploadedFilePaths);
  
    // Check if index is valid
    if (index < 0 || index >= uploadedFileNames.length) {
      console.error("Invalid index:", index);
      return; // Prevent further execution if index is out of bounds
    }
  
    // Filter out the discarded file name and path
    const updatedFiles = uploadedFileNames.filter((_, i) => i !== index);
    const updatedPaths = formData.uploadedFilePaths.filter((_, i) => i !== index);
  
    // Update states
    setUploadedFileNames(updatedFiles);
    setFormData({ ...formData, uploadedFilePaths: updatedPaths });
  
    console.log("After discarding:");
    console.log("Updated Uploaded File Names:", updatedFiles);
    console.log("Updated Uploaded File Paths:", updatedPaths);
  };
  

  // Handle discard all files
  const handleDiscardAll = () => {
    setUploadedFileNames([]);
    setFormData({ ...formData, uploadedFilePaths: [] });
    console.log();
  };

  const handleEditDocument = (index) => {
    console.log("Edit document at index", index);
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
            {editingIndex === null ? (
              <button
                onClick={handleAddDocument}
                className="bg-rose-900 text-white rounded-2xl p-2 flex items-center text-sm justify-center"
              >
                <PlusCircleIcon className="h-5 w-5 mr-1" /> Add Document
              </button>
            ) : (
              <button
                onClick={() => console.log("Save Edit")}
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
                    <button onClick={() => handleEditDocument(index)}>
                      <PencilIcon className="h-6 w-6 text-white bg-yellow-400 rounded-xl p-1" />
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
      </div>
    </div>
  );
};

export default DocumentManagement;
