'use client';

import { Plus } from 'lucide-react';

interface DashboardHeaderProps {
  onAddWidget: () => void;
}

export default function DashboardHeader({ onAddWidget }: DashboardHeaderProps) {
  return (
    <header className="border-b border-gray-700 bg-[#16213e]/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#00d4aa] rounded-lg flex items-center justify-center">
              <span className="text-[#1a1b2e] font-bold text-sm">FD</span>
            </div>
            <div>
              <h1 className="text-white text-xl font-semibold">Finance Dashboard</h1>
              <p className="text-gray-400 text-sm">Connect to APIs and build your custom dashboard</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={onAddWidget}
            className="bg-[#00d4aa] hover:bg-[#00c49a] text-[#1a1b2e] px-4 py-2 rounded-lg flex items-center space-x-2 font-medium transition-colors"
          >
            <Plus size={16} />
            <span>Add Widget</span>
          </button>
        </div>
      </div>
    </header>
  );
}
