export interface Widget {
  id: string;
  name: string;
  type: 'card' | 'table' | 'chart';
  apiUrl: string;
  refreshInterval: number;
  config: WidgetConfig;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  data?: unknown;
  lastUpdated?: Date;
}

export interface WidgetConfig {
  displayMode?: 'card' | 'table' | 'chart';
  selectedFields?: string[];
  searchFields?: string[];
  showArraysOnly?: boolean;
  chartType?: 'line' | 'bar' | 'pie' | 'candle';
  timeInterval?: 'daily' | 'weekly' | 'monthly';
  itemsPerPage?: number;
  currency?: string;
}

export interface ApiResponse {
  success: boolean;
  data: unknown;
  fields: string[];
  error?: string;
}

export interface DashboardState {
  widgets: Widget[];
  isLoading: boolean;
  error?: string;
}
