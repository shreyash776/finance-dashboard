'use client';

import { useMemo } from 'react';
import { Widget } from '@/types/widget';
import { extractChartData, getFieldValue, isNumeric } from '@/utils/dataUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface ChartWidgetProps {
  widget: Widget;
}

const COLORS = ['#00d4aa', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];

export default function ChartWidget({ widget }: ChartWidgetProps) {
  const chartData = useMemo(() => {
    return extractChartData(widget.data, widget);
  }, [widget]);

  const chartType = widget.config.chartType || 'line';
  const selectedFields = widget.config.selectedFields || [];
  
  // Get numeric fields for charting
  const numericFields = selectedFields.filter(field => {
    if (chartData.length > 0) {
      const value = getFieldValue(chartData[0], field);
      return isNumeric(value);
    }
    return false;
  });

  if (!widget.data) {
    return (
      <div className="p-4 h-64 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-24 mx-auto"></div>
          </div>
          <p className="mt-2 text-sm">Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0 || numericFields.length === 0) {
    return (
      <div className="p-4 h-64 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <BarChart3 size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No chart data available</p>
          <p className="text-xs mt-1">Select numeric fields to display charts</p>
        </div>
      </div>
    );
  }

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="index" 
          stroke="#9CA3AF" 
          fontSize={12}
        />
        <YAxis 
          stroke="#9CA3AF" 
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#F3F4F6'
          }}
        />
        {numericFields.slice(0, 4).map((field, index) => (
          <Line
            key={field}
            type="monotone"
            dataKey={field}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={2}
            dot={{ fill: COLORS[index % COLORS.length], strokeWidth: 0, r: 4 }}
            name={field.split('.').pop()}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData.slice(0, 20)}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="index" 
          stroke="#9CA3AF" 
          fontSize={12}
        />
        <YAxis 
          stroke="#9CA3AF" 
          fontSize={12}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#1F2937', 
            border: '1px solid #374151',
            borderRadius: '6px',
            color: '#F3F4F6'
          }}
        />
        {numericFields.slice(0, 4).map((field, index) => (
          <Bar
            key={field}
            dataKey={field}
            fill={COLORS[index % COLORS.length]}
            name={field.split('.').pop()}
            radius={[2, 2, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => {
    // For pie chart, use the first row of data
    const pieData = numericFields.slice(0, 6).map((field, index) => ({
      name: field.split('.').pop(),
      value: Math.abs(Number(getFieldValue(chartData[0], field)) || 0),
      color: COLORS[index % COLORS.length]
    })).filter(item => item.value > 0);

    if (pieData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400">
          <p className="text-sm">No positive values for pie chart</p>
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, percent }: { name?: string; percent?: number }) => 
              `${name || ''} ${percent ? (percent * 100).toFixed(1) : '0'}%`
            }
            labelLine={false}
            fontSize={12}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '6px',
              color: '#F3F4F6'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="p-4">
      {/* Chart Type Selector */}
      <div className="mb-4 flex space-x-2">
        {(['line', 'bar', 'pie'] as const).map(type => (
          <button
            key={type}
            onClick={() => {
              // This would update widget config - we'll implement this later
              console.log(`Switch to ${type} chart`);
            }}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              chartType === type
                ? 'bg-[#00d4aa] text-[#1a1b2e]'
                : 'bg-[#1a1b2e] text-gray-300 hover:text-white border border-gray-600'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-[#1a1b2e] rounded-lg p-2">
        {chartType === 'line' && renderLineChart()}
        {chartType === 'bar' && renderBarChart()}
        {chartType === 'pie' && renderPieChart()}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-2">
        {numericFields.slice(0, chartType === 'pie' ? 6 : 4).map((field, index) => (
          <div key={field} className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-gray-300">
              {field.split('.').pop()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
