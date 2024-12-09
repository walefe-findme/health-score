"use client"
import React, { useState } from 'react';
import jsonData from '../../data.json';

function JsonTable() {
  const [selectedHealthLikert, setSelectedHealthLikert] = useState('All');
  const [selectedHealthScore, setSelectedHealthScore] = useState('All');
  const [searchCompany, setSearchCompany] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const data = jsonData;

  if (data.length === 0) {
    return <div className="text-center mt-10">No data available</div>;
  }
  const { Sheet1 } = data;

  // Get unique Health_Score_Likert values for filter
  const uniqueHealthLikerts = ['All', ...new Set(Sheet1.map(item => item.Health_Score_Likert))];

  // Get unique Health_Score ranges for filter
  const healthScoreRanges = [
    'All',
    '0-20',
    '21-40', 
    '41-60',
    '61-80',
    '81-100'
  ];

  // Filter data based on both selections and search
  const filteredData = Sheet1.filter(item => {
    const likertMatch = selectedHealthLikert === 'All' || item.Health_Score_Likert === selectedHealthLikert;
    
    let scoreMatch = true;
    if (selectedHealthScore !== 'All') {
      const [min, max] = selectedHealthScore.split('-').map(Number);
      scoreMatch = item.Health_Score >= min && item.Health_Score <= max;
    }

    const searchMatch = item.company_name.toLowerCase().includes(searchCompany.toLowerCase());

    return likertMatch && scoreMatch && searchMatch;
  }).sort((a, b) => a.company_name.localeCompare(b.company_name)); // Sort alphabetically by company name

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const headers = Object.keys(Sheet1[0]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="h-full w-full p-6 md:p-12 bg-[#f7f9fc]">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-[#2d3748]">
            Health Score
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#718096]">Search Company:</label>
              <input
                type="text"
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
                placeholder="Enter company name..."
                className="rounded border border-[#e2e8f0] px-3 py-1.5 text-[#4a5568]"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#718096]">Filter by Health Score Likert:</label>
              <select 
                value={selectedHealthLikert}
                onChange={(e) => setSelectedHealthLikert(e.target.value)}
                className="rounded border border-[#e2e8f0] px-3 py-1.5 text-[#4a5568]"
              >
                {uniqueHealthLikerts.map(score => (
                  <option key={score} value={score}>{score}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[#718096]">Filter by Health Score Range:</label>
              <select
                value={selectedHealthScore}
                onChange={(e) => setSelectedHealthScore(e.target.value)}
                className="rounded border border-[#e2e8f0] px-3 py-1.5 text-[#4a5568]"
              >
                {healthScoreRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-[#e2e8f0] bg-white shadow-sm">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] transition-colors">
                  {headers.map((header) => (
                    <th 
                      key={header}
                      className="h-12 px-4 text-left align-middle font-medium text-[#718096] [&:has([role=checkbox])]:pr-0"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {currentData.length > 0 ? (
                  currentData.map((row) => (
                    <tr 
                      key={row.id || row._id || Object.values(row)[0]}
                      className="border-b border-[#e2e8f0] transition-colors hover:bg-[#f7fafc] data-[state=selected]:bg-[#f7fafc]"
                    >
                      {headers.map((header) => (
                        <td 
                          key={header}
                          className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-[#4a5568]"
                        >
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length} className="text-center p-4 text-[#718096]">
                      No results found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-[#718096] py-4">
          <div>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-[#e2e8f0] disabled:opacity-50"
            >
              Previous
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === index + 1
                    ? 'bg-[#4a5568] text-white'
                    : 'border-[#e2e8f0]'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-[#e2e8f0] disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JsonTable;