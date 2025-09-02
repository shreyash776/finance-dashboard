import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['dashboard/updateWidgetData'],
        ignoredActionPaths: ['payload.lastUpdated'],
        ignoredStatePaths: ['dashboard.widgets.lastUpdated'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
