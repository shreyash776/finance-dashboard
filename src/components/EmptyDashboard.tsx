'use client';

import { BarChart3, Plus } from 'lucide-react';

export default function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-24 h-24 bg-[#16213e] rounded-full flex items-center justify-center mb-6">
        <BarChart3 size={48} className="text-[#00d4aa]" />
      </div>
      
      <h2 className="text-2xl font-bold text-white mb-4">Build Your Finance Dashboard</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        Create custom widgets by connecting to any finance API. Track stocks, crypto,
        and other financial data in real-time.
      </p>
      
      <div className="flex items-center space-x-2 text-[#00d4aa] bg-[#16213e] px-6 py-3 rounded-lg border border-gray-600">
        <Plus size={20} />
        <span className="font-medium">Click &quot;Add Widget&quot; to get started</span>
      </div>
    </div>
  );
}
