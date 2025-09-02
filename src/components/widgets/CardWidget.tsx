'use client';

import { useState } from 'react';
import { Widget } from '@/types/widget';
import { getFieldValue, formatValue, isNumeric } from '@/utils/dataUtils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CardWidgetProps {
  widget: Widget;
}

export default function CardWidget({ widget }: CardWidgetProps) {
  const [showAllFields, setShowAllFields] = useState(false);

  if (!widget.data) {
    return (
      <div className="p-4 text-center text-gray-400">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
        <p className="mt-2 text-sm">Loading data...</p>
      </div>
    );
  }

  const selectedFields = widget.config.selectedFields || [];
  const fieldsToShow = showAllFields ? selectedFields : selectedFields.slice(0, 5);

  const renderFieldValue = (field: string, value: unknown) => {
    const formattedValue = formatValue(value);
    const isNumber = isNumeric(value);

    return (
      <div key={field} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0">
        <span className="text-sm text-gray-400 capitalize truncate flex-1 mr-2">
          {field.split('.').pop()?.replace(/([A-Z])/g, ' $1').trim()}
        </span>
        <div className="flex items-center space-x-2">
          {isNumber && (
            <div className="text-xs">
              {Number(value) > 0 ? (
                <TrendingUp size={12} className="text-green-400" />
              ) : Number(value) < 0 ? (
                <TrendingDown size={12} className="text-red-400" />
              ) : (
                <Minus size={12} className="text-gray-400" />
              )}
            </div>
          )}
          <span className={`text-sm font-medium ${
            isNumber 
              ? Number(value) > 0 
                ? 'text-green-400' 
                : Number(value) < 0 
                  ? 'text-red-400' 
                  : 'text-white'
              : 'text-white'
          }`}>
            {formattedValue}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="space-y-1">
        {fieldsToShow.map(field => {
          const value = getFieldValue(widget.data, field);
          return renderFieldValue(field, value);
        })}
      </div>

      {selectedFields.length > 5 && (
        <button
          onClick={() => setShowAllFields(!showAllFields)}
          className="mt-3 w-full text-center text-xs text-[#00d4aa] hover:text-[#00c49a] transition-colors"
        >
          {showAllFields ? 'Show Less' : `Show ${selectedFields.length - 5} More Fields`}
        </button>
      )}

      {selectedFields.length === 0 && (
        <div className="text-center py-4">
          <p className="text-gray-400 text-sm">No fields selected</p>
          <p className="text-xs text-gray-500 mt-1">Configure widget to select data fields</p>
        </div>
      )}
    </div>
  );
}
