'use client';

import { useState, useEffect } from 'react';
import { X, TestTube } from 'lucide-react';
import { useAppDispatch } from '@/hooks/redux';
import { addWidget } from '@/store/slices/dashboardSlice';
import { Widget, WidgetConfig } from '@/types/widget';

interface AddWidgetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddWidgetModal({ isOpen, onClose }: AddWidgetModalProps) {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<'basic' | 'config'>('basic');
  const [widgetName, setWidgetName] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<{
    success: boolean;
    data?: unknown;
    fields?: string[];
    error?: string;
  } | null>(null);

  // Config state
  const [displayMode, setDisplayMode] = useState<'card' | 'table' | 'chart'>('card');
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [searchFields, setSearchFields] = useState<string[]>([]);
  const [showArraysOnly, setShowArraysOnly] = useState(false);
  const [availableFields, setAvailableFields] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setStep('basic');
      setWidgetName('');
      setApiUrl('');
      setRefreshInterval(30);
      setApiTestResult(null);
      setDisplayMode('card');
      setSelectedFields([]);
      setSearchFields([]);
      setShowArraysOnly(false);
      setAvailableFields([]);
    }
  }, [isOpen]);

  const testApiConnection = async () => {
    if (!apiUrl.trim()) {
      setApiTestResult({ success: false, error: 'Please enter an API URL' });
      return;
    }

    setIsTestingApi(true);
    try {
      const response = await fetch(`/api/test-widget?url=${encodeURIComponent(apiUrl)}`);
      const result = await response.json();
      
      if (result.success) {
        setApiTestResult({
          success: true,
          data: result.data,
          fields: result.fields
        });
        setAvailableFields(result.fields || []);
        setSelectedFields(result.fields?.slice(0, 5) || []); // Select first 5 fields by default
      } else {
        setApiTestResult({ success: false, error: result.error });
      }
    } catch (error) {
      setApiTestResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to test API connection' 
      });
    } finally {
      setIsTestingApi(false);
    }
  };

  const handleCreateWidget = () => {
    if (!widgetName.trim() || !apiUrl.trim()) {
      return;
    }

    const config: WidgetConfig = {
      displayMode,
      selectedFields,
      searchFields,
      showArraysOnly,
      chartType: displayMode === 'chart' ? 'line' : undefined,
      itemsPerPage: displayMode === 'table' ? 10 : undefined,
    };

    const newWidget: Widget = {
      id: Date.now().toString(),
      name: widgetName.trim(),
      type: displayMode,
      apiUrl: apiUrl.trim(),
      refreshInterval,
      config,
      position: { x: 0, y: 0, width: 1, height: 1 },
    };

    dispatch(addWidget(newWidget));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#16213e] border border-gray-700 rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">Add New Widget</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {step === 'basic' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Widget Name
                </label>
                <input
                  type="text"
                  value={widgetName}
                  onChange={(e) => setWidgetName(e.target.value)}
                  placeholder="e.g., Bitcoin Price Tracker"
                  className="w-full px-3 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-[#00d4aa] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  API URL
                </label>
                <input
                  type="url"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder="https://api.coinbase.com/v2/exchange-rates?currency=BTC"
                  className="w-full px-3 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white placeholder-gray-400 focus:border-[#00d4aa] focus:outline-none"
                />
                <button
                  onClick={testApiConnection}
                  disabled={isTestingApi}
                  className="mt-2 w-full bg-[#00d4aa]/20 hover:bg-[#00d4aa]/30 text-[#00d4aa] px-3 py-2 rounded-md flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <TestTube size={16} />
                  <span>{isTestingApi ? 'Testing...' : 'Test'}</span>
                </button>
              </div>

              {apiTestResult && (
                <div className={`p-3 rounded-md ${
                  apiTestResult.success 
                    ? 'bg-green-900/20 border border-green-700 text-green-300' 
                    : 'bg-red-900/20 border border-red-700 text-red-300'
                }`}>
                  {apiTestResult.success ? (
                    <div>
                      <p className="font-medium text-green-300">✓ API connection successful! Top-level fields found:</p>
                      <p className="text-sm mt-1">{apiTestResult.fields?.join(', ')}</p>
                    </div>
                  ) : (
                    <p>✗ {apiTestResult.error}</p>
                  )}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Refresh Interval (seconds)
                </label>
                <input
                  type="number"
                  value={refreshInterval}
                  onChange={(e) => setRefreshInterval(Number(e.target.value))}
                  min={10}
                  className="w-full px-3 py-2 bg-[#1a1b2e] border border-gray-600 rounded-md text-white focus:border-[#00d4aa] focus:outline-none"
                />
              </div>

              {apiTestResult?.success && (
                <div className="flex justify-between">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <div className="space-x-2">
                    <button
                      onClick={() => setStep('config')}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md"
                    >
                      Configure Fields
                    </button>
                    <button
                      onClick={handleCreateWidget}
                      className="px-4 py-2 bg-[#00d4aa] hover:bg-[#00c49a] text-[#1a1b2e] rounded-md font-medium"
                    >
                      Add Widget
                    </button>
                  </div>
                </div>
              )}

              {!apiTestResult?.success && (
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </>
          )}

          {step === 'config' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Display Mode
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['card', 'table', 'chart'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDisplayMode(mode)}
                      className={`px-3 py-2 rounded-md text-sm font-medium capitalize ${
                        displayMode === mode
                          ? 'bg-[#00d4aa] text-[#1a1b2e]'
                          : 'bg-[#1a1b2e] text-gray-300 border border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {displayMode === 'chart' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Chart Type
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['line', 'bar', 'pie'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          // This would be handled by chart type selection
                          console.log(`Selected chart type: ${type}`);
                        }}
                        className="px-3 py-2 rounded-md text-sm font-medium capitalize bg-[#1a1b2e] text-gray-300 border border-gray-600 hover:border-gray-500"
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Selected Fields (max 10)
                </label>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {availableFields.map((field) => (
                    <label key={field} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFields.includes(field)}
                        onChange={(e) => {
                          if (e.target.checked && selectedFields.length < 10) {
                            setSelectedFields([...selectedFields, field]);
                          } else if (!e.target.checked) {
                            setSelectedFields(selectedFields.filter(f => f !== field));
                          }
                        }}
                        className="text-[#00d4aa] focus:ring-[#00d4aa]"
                      />
                      <span className="text-sm text-gray-300">{field}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="showArraysOnly"
                  checked={showArraysOnly}
                  onChange={(e) => setShowArraysOnly(e.target.checked)}
                  className="text-[#00d4aa] focus:ring-[#00d4aa]"
                />
                <label htmlFor="showArraysOnly" className="text-sm text-gray-300">
                  Show arrays only (recommended for table view)
                </label>
              </div>

              {/* Help text based on widget type */}
              <div className="p-3 bg-[#1a1b2e] rounded border border-gray-600">
                <h4 className="text-sm font-medium text-white mb-2">Widget Type Guide:</h4>
                <div className="text-xs text-gray-300 space-y-1">
                  <p><span className="text-[#00d4aa]">Card:</span> Best for key-value data, financial metrics</p>
                  <p><span className="text-[#00d4aa]">Table:</span> Perfect for lists, arrays, paginated data</p>
                  <p><span className="text-[#00d4aa]">Chart:</span> Ideal for numeric data, trends, analytics</p>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setStep('basic')}
                  className="px-4 py-2 text-gray-400 hover:text-white"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateWidget}
                  className="px-4 py-2 bg-[#00d4aa] hover:bg-[#00c49a] text-[#1a1b2e] rounded-md font-medium"
                >
                  Add Widget
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
