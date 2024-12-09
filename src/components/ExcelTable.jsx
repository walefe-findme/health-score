"use client"
import React, { useState, useMemo } from 'react';
import jsonData from '../../data.json'; // Adjust the path as necessary

function JsonTable() {
  const data = jsonData;

  if (data.length === 0) {
    return <div className="text-center mt-10">No data available</div>;
  }

  const { Sheet1 } = data;
  const headers = Object.keys(Sheet1[0]);
  console.log('headers',headers);

  return (
    <div className="h-full w-full p-6 md:p-12 bg-[#fafafa]">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">
            Health Score
          </h1>
        </div>

        <div className="rounded-lg border border-[#e2e8f0] bg-white shadow-sm">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc] transition-colors">
                  {headers.map((header) => (
                    <th 
                      key={header}
                      className="h-12 px-4 text-left align-middle font-medium text-[#64748b] [&:has([role=checkbox])]:pr-0"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {Sheet1.map((row, index) => (
                  <tr 
                    key={row.id || row._id || Object.values(row)[0]}
                    className="border-b border-[#e2e8f0] transition-colors hover:bg-[#f8fafc] data-[state=selected]:bg-[#f8fafc]"
                  >
                    {headers.map((header) => (
                      <td 
                        key={header}
                        className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-[#334155]"
                      >
                        {row[header]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-sm text-[#64748b] text-center py-4">
          Showing {data.length} entries
        </div>
      </div>
    </div>
  );
}

export default JsonTable; 