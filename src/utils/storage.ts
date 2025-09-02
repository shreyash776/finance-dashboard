import { Widget } from '@/types/widget';

const STORAGE_KEY = 'finance-dashboard-widgets';

export const storageUtils = {
  saveWidgets: (widgets: Widget[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
    } catch (error) {
      console.error('Failed to save widgets to localStorage:', error);
    }
  },

  loadWidgets: (): Widget[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const widgets = JSON.parse(stored);
        // Ensure the widgets have the correct structure
        return widgets.map((widget: unknown) => ({
          ...(widget as Widget),
          lastUpdated: (widget as Widget).lastUpdated ? new Date((widget as Widget).lastUpdated!) : undefined,
        }));
      }
    } catch (error) {
      console.error('Failed to load widgets from localStorage:', error);
    }
    return [];
  },

  clearWidgets: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear widgets from localStorage:', error);
    }
  },
};
