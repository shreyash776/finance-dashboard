'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Settings, X, MoreVertical } from 'lucide-react';
import { useAppDispatch } from '@/hooks/redux';
import { removeWidget } from '@/store/slices/dashboardSlice';
import { Widget } from '@/types/widget';
import { useState } from 'react';
import CardWidget from './CardWidget';
import TableWidget from './TableWidget';
import ChartWidget from './ChartWidget';

interface WidgetCardProps {
  widget: Widget;
}

interface WidgetCardProps {
  widget: Widget;
}

export default function WidgetCard({ widget }: WidgetCardProps) {
  const dispatch = useAppDispatch();
  const [showMenu, setShowMenu] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRemoveWidget = () => {
    dispatch(removeWidget(widget.id));
  };

  const renderWidgetContent = () => {
    const displayMode = widget.config.displayMode || widget.type;
    
    switch (displayMode) {
      case 'table':
        return <TableWidget widget={widget} />;
      case 'chart':
        return <ChartWidget widget={widget} />;
      case 'card':
      default:
        return <CardWidget widget={widget} />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-[#16213e] border border-gray-700 rounded-lg p-4 hover:border-[#00d4aa]/50 transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div {...listeners} className="cursor-grab hover:cursor-grabbing">
            <MoreVertical size={16} className="text-gray-400" />
          </div>
          <h3 className="font-semibold text-white">{widget.name}</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <Settings size={14} className="text-gray-400" />
          </button>
          <button
            onClick={handleRemoveWidget}
            className="p-1 hover:bg-red-900/30 rounded text-red-400"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-gray-400">
          Type: <span className="text-[#00d4aa]">{widget.config.displayMode || widget.type}</span>
        </div>
        <div className="text-sm text-gray-400">
          API: <span className="text-white break-all">{widget.apiUrl}</span>
        </div>
        <div className="text-sm text-gray-400">
          Refresh: <span className="text-white">{widget.refreshInterval}s</span>
        </div>
        
        {widget.lastUpdated && (
          <div className="text-xs text-gray-500">
            Last updated: {new Date(widget.lastUpdated).toLocaleTimeString()}
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-gray-700 pt-4">
        {renderWidgetContent()}
      </div>
    </div>
  );
}
