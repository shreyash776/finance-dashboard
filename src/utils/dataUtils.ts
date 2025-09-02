import { Widget } from '@/types/widget';

export const getFieldValue = (data: unknown, fieldPath: string): unknown => {
  if (!data || typeof data !== 'object') return null;
  
  const keys = fieldPath.split('.');
  let current: unknown = data;
  
  for (const key of keys) {
    if (key.endsWith('[]')) {
      // Handle array notation
      const arrayKey = key.replace('[]', '');
      if (current && typeof current === 'object' && arrayKey in current) {
        const currentObj = current as Record<string, unknown>;
        current = currentObj[arrayKey];
        if (Array.isArray(current)) {
          return current; // Return the entire array
        }
      }
      return null;
    } else {
      if (current && typeof current === 'object' && key in current) {
        const currentObj = current as Record<string, unknown>;
        current = currentObj[key];
      } else {
        return null;
      }
    }
  }
  
  return current;
};

export const formatValue = (value: unknown): string => {
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') {
    // Format numbers with appropriate precision
    if (value > 1000000) {
      return `${(value / 1000000).toFixed(2)}M`;
    } else if (value > 1000) {
      return `${(value / 1000).toFixed(2)}K`;
    } else if (value % 1 !== 0) {
      return value.toFixed(4);
    }
    return value.toLocaleString();
  }
  if (typeof value === 'string') {
    // Format dates if they look like dates
    if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
      try {
        return new Date(value).toLocaleString();
      } catch {
        return value;
      }
    }
    return value;
  }
  if (Array.isArray(value)) {
    return `Array (${value.length} items)`;
  }
  if (typeof value === 'object') {
    return 'Object';
  }
  return String(value);
};

export const isNumeric = (value: unknown): boolean => {
  return typeof value === 'number' && !isNaN(value);
};

export const extractChartData = (data: unknown, widget: Widget) => {
  if (!data || !widget.config.selectedFields) return [];
  
  // If data is an array, use it for time series
  if (Array.isArray(data)) {
    return data.slice(0, 50).map((item, index) => {
      const point: Record<string, unknown> = { index };
      widget.config.selectedFields?.forEach(field => {
        point[field] = getFieldValue(item, field);
      });
      return point;
    });
  }
  
  // If data is an object, create single data point
  const point: Record<string, unknown> = {};
  widget.config.selectedFields.forEach(field => {
    const value = getFieldValue(data, field);
    if (isNumeric(value)) {
      point[field] = value;
    }
  });
  
  return Object.keys(point).length > 0 ? [point] : [];
};

export const extractTableData = (data: unknown, widget: Widget) => {
  if (!data) return [];
  
  // If data is an array, return it directly
  if (Array.isArray(data)) {
    return data.slice(0, 100); // Limit to 100 items for performance
  }
  
  // If we're looking for arrays within the data
  if (widget.config.showArraysOnly && typeof data === 'object') {
    for (const field of widget.config.selectedFields || []) {
      const value = getFieldValue(data, field);
      if (Array.isArray(value)) {
        return value.slice(0, 100);
      }
    }
  }
  
  // Return single object as array
  return [data];
};
