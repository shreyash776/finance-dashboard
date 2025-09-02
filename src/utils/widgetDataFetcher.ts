import { Widget, ApiResponse } from '@/types/widget';

export class WidgetDataFetcher {
  private static instance: WidgetDataFetcher;
  private intervalIds: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): WidgetDataFetcher {
    if (!WidgetDataFetcher.instance) {
      WidgetDataFetcher.instance = new WidgetDataFetcher();
    }
    return WidgetDataFetcher.instance;
  }

  async fetchWidgetData(widget: Widget): Promise<ApiResponse> {
    try {
      const response = await fetch(`/api/fetch-widget-data?url=${encodeURIComponent(widget.apiUrl)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data: data.data,
        fields: data.fields || [],
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        fields: [],
        error: error instanceof Error ? error.message : 'Failed to fetch data',
      };
    }
  }

  startPeriodicFetch(widget: Widget, onDataUpdate: (widgetId: string, data: unknown) => void): void {
    // Clear existing interval if any
    this.stopPeriodicFetch(widget.id);

    // Initial fetch
    this.fetchWidgetData(widget).then((response) => {
      if (response.success) {
        onDataUpdate(widget.id, response.data);
      }
    });

    // Set up periodic fetching
    const intervalId = setInterval(async () => {
      const response = await this.fetchWidgetData(widget);
      if (response.success) {
        onDataUpdate(widget.id, response.data);
      }
    }, widget.refreshInterval * 1000);

    this.intervalIds.set(widget.id, intervalId);
  }

  stopPeriodicFetch(widgetId: string): void {
    const intervalId = this.intervalIds.get(widgetId);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervalIds.delete(widgetId);
    }
  }

  stopAllFetches(): void {
    this.intervalIds.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.intervalIds.clear();
  }
}

export const widgetDataFetcher = WidgetDataFetcher.getInstance();
