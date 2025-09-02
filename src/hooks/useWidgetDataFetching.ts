import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { updateWidgetData } from '@/store/slices/dashboardSlice';
import { widgetDataFetcher } from '@/utils/widgetDataFetcher';

export function useWidgetDataFetching() {
  const dispatch = useAppDispatch();
  const widgets = useAppSelector((state) => state.dashboard.widgets);

  useEffect(() => {
    // Start data fetching for all widgets
    widgets.forEach((widget) => {
      widgetDataFetcher.startPeriodicFetch(widget, (widgetId, data) => {
        dispatch(updateWidgetData({ id: widgetId, data }));
      });
    });

    // Cleanup function to stop all fetching when component unmounts
    return () => {
      widgets.forEach((widget) => {
        widgetDataFetcher.stopPeriodicFetch(widget.id);
      });
    };
  }, [widgets, dispatch]);

  // Stop fetching for removed widgets
  useEffect(() => {
    const currentWidgetIds = new Set(widgets.map(w => w.id));
    
    // This will run cleanup for any widgets that were removed
    return () => {
      widgets.forEach((widget) => {
        if (!currentWidgetIds.has(widget.id)) {
          widgetDataFetcher.stopPeriodicFetch(widget.id);
        }
      });
    };
  }, [widgets]);
}
