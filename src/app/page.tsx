'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardGrid from '@/components/DashboardGrid';
import AddWidgetModal from '@/components/modals/AddWidgetModal';
import { useWidgetDataFetching } from '@/hooks/useWidgetDataFetching';
import { useAppDispatch } from '@/hooks/redux';
import { loadWidgetsFromStorage } from '@/store/slices/dashboardSlice';

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  
  // Load widgets from localStorage on mount
  useEffect(() => {
    dispatch(loadWidgetsFromStorage());
  }, [dispatch]);
  
  // Start data fetching for all widgets
  useWidgetDataFetching();

  return (
    <div className="min-h-screen bg-[#1a1b2e]">
      <DashboardHeader onAddWidget={() => setIsAddModalOpen(true)} />
      <main className="container mx-auto px-4 py-6">
        <DashboardGrid />
        <AddWidgetModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      </main>
    </div>
  );
}
