import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const dummyData = [
  { sr: 1, fileNo: 'FMID1708534506152', creationDate: '21/02/2024', title: 'Scooby', subject: 'Pet Registration', action: 'View' },
  { sr: 2, fileNo: 'FMID1716483454198', creationDate: '23/05/2024', title: 'Tuffy', subject: 'Pet Registration', action: 'View' },
  { sr: 3, fileNo: 'FMID1716831404178', creationDate: '27/05/2024', title: 'Chintu', subject: 'Pet Registration', action: 'View' },
  { sr: 4, fileNo: 'FMID1716832143812', creationDate: '27/05/2024', title: 'Minnie', subject: 'Pet Registration', action: 'View' },
  { sr: 5, fileNo: 'FMID1716931143269', creationDate: '29/05/2024', title: 'Frodo', subject: 'Pet Registration', action: 'View' },
];

const Stats = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = dummyData.filter(item =>
    Object.values(item).some(val => 
      val.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredData.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>
      
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <label htmlFor="recordsPerPage" className="mr-2">Show:</label>
          <select
            id="recordsPerPage"
            className="border rounded p-1"
            value={recordsPerPage}
            onChange={(e) => setRecordsPerPage(Number(e.target.value))}
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
            className="border rounded p-1 mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="text-gray-500" />
        </div>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">SR.</th>
            <th className="border p-2">File No</th>
            <th className="border p-2">Creation Date</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Subject</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map((item) => (
            <tr key={item.sr}>
              <td className="border p-2">{item.sr}</td>
              <td className="border p-2">{item.fileNo}</td>
              <td className="border p-2">{item.creationDate}</td>
              <td className="border p-2">{item.title}</td>
              <td className="border p-2">{item.subject}</td>
              <td className="border p-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded">
                  {item.action}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          <ArrowLeftIcon className="inline" />
          Previous
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastRecord >= filteredData.length}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          Next
          <ArrowRightIcon className="inline" />
        </button>
      </div>
    </div>
  );
};

export default Stats;