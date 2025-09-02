'use client';

import { useState, useMemo } from 'react';
import { Widget } from '@/types/widget';
import { extractTableData, getFieldValue, formatValue } from '@/utils/dataUtils';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

interface TableWidgetProps {
  widget: Widget;
}

export default function TableWidget({ widget }: TableWidgetProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const itemsPerPage = widget.config.itemsPerPage || 10;
  
  const tableData = useMemo(() => {
    return extractTableData(widget.data, widget);
  }, [widget]);

  const selectedFields = useMemo(() => {
    return widget.config.selectedFields || [];
  }, [widget.config.selectedFields]);

  const filteredData = useMemo(() => {
    if (!searchTerm) return tableData;
    
    return tableData.filter(item => {
      return selectedFields.some(field => {
        const value = getFieldValue(item, field);
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [tableData, searchTerm, selectedFields]);

  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      const aValue = getFieldValue(a, sortField);
      const bValue = getFieldValue(b, sortField);
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [filteredData, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (!widget.data) {
    return (
      <div className="p-4 text-center text-gray-400">
        <div className="animate-pulse space-y-2">
          <div className="h-8 bg-gray-700 rounded"></div>
          <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
        <p className="mt-2 text-sm">Loading table data...</p>
      </div>
    );
  }

  if (tableData.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        <Filter size={24} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">No table data available</p>
        <p className="text-xs mt-1">Try selecting array fields or different data source</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search table..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full pl-10 pr-4 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-[#00d4aa] focus:outline-none text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              {selectedFields.slice(0, 5).map(field => (
                <th
                  key={field}
                  className="text-left py-2 px-2 text-gray-300 cursor-pointer hover:text-white transition-colors"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center space-x-1">
                    <span className="truncate">
                      {field.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    {sortField === field && (
                      <span className="text-[#00d4aa]">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={index} className="border-b border-gray-700/50 hover:bg-[#1a1b2e] transition-colors">
                {selectedFields.slice(0, 5).map(field => {
                  const value = getFieldValue(item, field);
                  return (
                    <td key={field} className="py-2 px-2 text-white">
                      <span className="truncate block max-w-[150px]" title={formatValue(value)}>
                        {formatValue(value)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} entries
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-gray-300">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
