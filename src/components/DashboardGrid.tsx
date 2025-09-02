'use client';

import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { reorderWidgets } from '@/store/slices/dashboardSlice';
import WidgetCard from './widgets/WidgetCard';
import EmptyDashboard from './EmptyDashboard';
import type { DragEndEvent } from '@dnd-kit/core';

export default function DashboardGrid() {
  const dispatch = useAppDispatch();
  const widgets = useAppSelector((state) => state.dashboard.widgets);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex(widget => widget.id === active.id);
      const newIndex = widgets.findIndex(widget => widget.id === over.id);
      
      const reorderedWidgets = arrayMove(widgets, oldIndex, newIndex);
      dispatch(reorderWidgets(reorderedWidgets));
    }
  };

  if (widgets.length === 0) {
    return <EmptyDashboard />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {widgets.map((widget) => (
            <WidgetCard key={widget.id} widget={widget} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
