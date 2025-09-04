'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Settings, Database, Brain, Bug, Download, Trash2 } from 'lucide-react';

interface PrivacyControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyControlsModal({ isOpen, onClose }: PrivacyControlsModalProps) {
  const [aiEnabled, setAiEnabled] = useState(false);
  const [diagnosticsEnabled, setDiagnosticsEnabled] = useState(false);
  const [aiServerStatus, setAiServerStatus] = useState<'enabled' | 'disabled' | 'unknown'>('unknown');

  useEffect(() => {
    // Check server-side AI configuration
    fetch('/api/privacy/status')
      .then(res => res.json())
      .then(data => {
        setAiServerStatus(data.aiEnabled ? 'enabled' : 'disabled');
      })
      .catch(() => setAiServerStatus('unknown'));
  }, []);

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/privacy/export');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `finance-data-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleDeleteData = async () => {
    if (confirm('Are you sure? This will permanently delete all your data and cannot be undone.')) {
      try {
        await fetch('/api/privacy/delete', { method: 'POST' });
        alert('Data deleted successfully. The page will reload.');
        window.location.reload();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Privacy Controls</h2>
                  <p className="text-sm text-gray-600">Manage your data and privacy settings</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* AI Features */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900">AI Features</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Coach Phrasing (AI)</p>
                      <p className="text-sm text-gray-600">Use AI to improve goal suggestions and insights</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {aiServerStatus === 'disabled' && (
                        <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">Admin disabled</span>
                      )}
                      <button
                        onClick={() => setAiEnabled(!aiEnabled)}
                        disabled={aiServerStatus === 'disabled'}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          aiEnabled ? 'bg-purple-600' : 'bg-gray-200'
                        } ${aiServerStatus === 'disabled' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            aiEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  {aiServerStatus === 'disabled' && (
                    <p className="text-xs text-gray-500">
                      AI features are disabled by the administrator for this demo.
                    </p>
                  )}
                </div>
              </div>

              {/* Diagnostics */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Bug className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Diagnostics</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Debug Information</p>
                      <p className="text-sm text-gray-600">Show technical details in insights and goals</p>
                    </div>
                    <button
                      onClick={() => setDiagnosticsEnabled(!diagnosticsEnabled)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        diagnosticsEnabled ? 'bg-orange-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          diagnosticsEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Data Management */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Data Management</h3>
                </div>
                
                <div className="space-y-3">
                  <button
                    onClick={handleExportData}
                    className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Download className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Export Data</p>
                        <p className="text-sm text-gray-600">Download your transaction data as CSV</p>
                      </div>
                    </div>
                  </button>
                  
                  <button
                    onClick={handleDeleteData}
                    className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Trash2 className="w-5 h-5 text-red-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Delete All Data</p>
                        <p className="text-sm text-gray-600">Permanently remove all your data</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">More Information</h3>
                </div>
                <a
                  href="/about/privacy"
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  View full privacy policy →
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
