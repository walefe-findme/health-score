"use client"
import React, { useState } from 'react';
import jsonData from '../../data.json';

function JsonTable() {
  const [selectedHealthLikert, setSelectedHealthLikert] = useState('Todos');
  const [selectedHealthScore, setSelectedHealthScore] = useState('Todos');
  const [searchCompany, setSearchCompany] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const data = jsonData;

  if (data.length === 0) {
    return <div className="text-center mt-10 text-gray-200">Nenhum dado disponível</div>;
  }
  const { Sheet1 } = data;

  // Obter valores únicos de Health_Score_Likert para filtro
  const uniqueHealthLikerts = ['Todos', ...new Set(Sheet1.map(item => item.Health_Score_Likert))];

  // Obter intervalos únicos de Health_Score para filtro
  const healthScoreRanges = [
    'Todos',
    '0-20',
    '21-40', 
    '41-60',
    '61-80',
    '81-100'
  ];

  // Filtrar dados com base em ambas as seleções e pesquisa
  const filteredData = Sheet1.filter(item => {
    const likertMatch = selectedHealthLikert === 'Todos' || item.Health_Score_Likert === selectedHealthLikert;
    
    let scoreMatch = true;
    if (selectedHealthScore !== 'Todos') {
      const [min, max] = selectedHealthScore.split('-').map(Number);
      scoreMatch = item.Health_Score >= min && item.Health_Score <= max;
    }

    const searchMatch = item.company_name.toLowerCase().includes(searchCompany.toLowerCase());

    return likertMatch && scoreMatch && searchMatch;
  }).sort((a, b) => a.company_name.localeCompare(b.company_name)); // Ordenar alfabeticamente por nome da empresa

  // Calcular paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const headers = Object.keys(Sheet1[0]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Função para gerar array de páginas com dots
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    // Sempre mostrar primeira página
    range.push(1);

    // Calcular range ao redor da página atual
    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 1 && i < totalPages) {
        range.push(i);
      }
    }

    // Sempre mostrar última página
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Adicionar dots onde necessário
    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="h-full w-full p-6 md:p-12 bg-gray-900">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-100">
            Health Score
          </h1>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-300">Pesquisar Empresa:</label>
              <input
                type="text"
                value={searchCompany}
                onChange={(e) => setSearchCompany(e.target.value)}
                placeholder="Digite o nome da empresa..."
                className="rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-gray-200 placeholder-gray-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-300">Filtrar por Classificação:</label>
              <select 
                value={selectedHealthLikert}
                onChange={(e) => setSelectedHealthLikert(e.target.value)}
                className="rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-gray-200"
              >
                {uniqueHealthLikerts.map(score => (
                  <option key={score} value={score}>{score}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-300">Filtrar por Intervalo:</label>
              <select
                value={selectedHealthScore}
                onChange={(e) => setSelectedHealthScore(e.target.value)}
                className="rounded border border-gray-700 bg-gray-800 px-3 py-1.5 text-gray-200"
              >
                {healthScoreRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-700 bg-gray-800 shadow-sm">
          <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b border-gray-700 bg-gray-900 transition-colors">
                  {headers.map((header) => (
                    <th 
                      key={header}
                      className="h-12 px-4 text-left align-middle font-medium text-gray-300 [&:has([role=checkbox])]:pr-0"
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
                      className="border-b border-gray-700 transition-colors hover:bg-gray-700 data-[state=selected]:bg-gray-700"
                    >
                      {headers.map((header) => (
                        <td 
                          key={header}
                          className="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-gray-200"
                        >
                          {row[header]}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={headers.length} className="text-center p-4 text-gray-400">
                      Nenhum resultado encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-300 py-4">
          <div>
            Mostrando {startIndex + 1} até {Math.min(endIndex, filteredData.length)} de {filteredData.length} registros
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-gray-700 bg-gray-800 disabled:opacity-50 text-gray-200"
            >
              Anterior
            </button>
            {getPageNumbers().map((pageNumber, index) => (
              pageNumber === '...' ? (
                <span key={`dots-${index}`} className="px-3 py-1 text-gray-400">...</span>
              ) : (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === pageNumber
                      ? 'bg-gray-600 text-white border-gray-600'
                      : 'border-gray-700 bg-gray-800 text-gray-200'
                  }`}
                >
                  {pageNumber}
                </button>
              )
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-gray-700 bg-gray-800 disabled:opacity-50 text-gray-200"
            >
              Próximo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JsonTable;