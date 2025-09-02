import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Widget, DashboardState } from '@/types/widget';
import { storageUtils } from '@/utils/storage';

const initialState: DashboardState = {
  widgets: [],
  isLoading: false,
  error: undefined,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addWidget: (state, action: PayloadAction<Widget>) => {
      state.widgets.push(action.payload);
      storageUtils.saveWidgets(state.widgets);
    },
    removeWidget: (state, action: PayloadAction<string>) => {
      state.widgets = state.widgets.filter(widget => widget.id !== action.payload);
      storageUtils.saveWidgets(state.widgets);
    },
    updateWidget: (state, action: PayloadAction<Partial<Widget> & { id: string }>) => {
      const index = state.widgets.findIndex(widget => widget.id === action.payload.id);
      if (index !== -1) {
        state.widgets[index] = { ...state.widgets[index], ...action.payload };
      }
      storageUtils.saveWidgets(state.widgets);
    },
    updateWidgetData: (state, action: PayloadAction<{ id: string; data: unknown }>) => {
      const index = state.widgets.findIndex(widget => widget.id === action.payload.id);
      if (index !== -1) {
        state.widgets[index].data = action.payload.data;
        state.widgets[index].lastUpdated = new Date();
      }
      // Save to localStorage after updating
      storageUtils.saveWidgets(state.widgets);
    },
    reorderWidgets: (state, action: PayloadAction<Widget[]>) => {
      state.widgets = action.payload;
      storageUtils.saveWidgets(state.widgets);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | undefined>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = undefined;
    },
    loadWidgetsFromStorage: (state) => {
      const widgets = storageUtils.loadWidgets();
      state.widgets = widgets;
    },
  },
});

export const {
  addWidget,
  removeWidget,
  updateWidget,
  updateWidgetData,
  reorderWidgets,
  setLoading,
  setError,
  clearError,
  loadWidgetsFromStorage,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
