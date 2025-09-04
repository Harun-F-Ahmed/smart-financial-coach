'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Settings, Download, Trash2, Lock } from 'lucide-react';

interface PrivacyControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyControlsModal({ isOpen, onClose }: PrivacyControlsModalProps) {
  const [deletePassword, setDeletePassword] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExportData = async () => {
    setIsExporting(true);
    setMessage(null);
    try {
      const response = await fetch('/api/privacy/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `finance-data-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        setMessage({ type: 'success', text: 'Data exported successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to export data. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred during export.' });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteData = async () => {
    if (!deletePassword) {
      setMessage({ type: 'error', text: 'Please enter your password to confirm deletion.' });
      return;
    }

    if (deletePassword !== 'DELETE') {
      setMessage({ type: 'error', text: 'Incorrect password. Please enter "DELETE" to confirm.' });
      return;
    }

    setIsDeleting(true);
    setMessage(null);
    try {
      const response = await fetch('/api/privacy/delete', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: deletePassword })
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'All data deleted successfully! The app will reload in 3 seconds.' });
        setTimeout(() => window.location.reload(), 3000);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.error || 'Failed to delete data.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An unexpected error occurred during deletion.' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white rounded-xl p-8 w-full max-w-md relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center mb-6">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Privacy Controls</h2>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Manage your financial data and privacy settings.
            </p>

            {message && (
              <div className={`p-3 mb-4 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              {/* Export Data */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Download className="h-5 w-5 text-green-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Export Your Data</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Download all your transaction data as a CSV file for your records.
                </p>
                <button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isExporting ? 'Exporting...' : 'Export Data'}
                </button>
              </div>

              {/* Delete Data */}
              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-center mb-3">
                  <Trash2 className="h-5 w-5 text-red-600 mr-2" />
                  <h3 className="font-medium text-gray-900">Delete All Data</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Permanently delete all your financial data. This action cannot be undone.
                </p>
                
                <div className="mb-3">
                  <label htmlFor="delete-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter "DELETE" to confirm:
                  </label>
                  <input
                    type="text"
                    id="delete-password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Type DELETE to confirm"
                  />
                </div>
                
                <button
                  onClick={handleDeleteData}
                  disabled={isDeleting || !deletePassword}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isDeleting ? 'Deleting...' : 'Delete All Data'}
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center text-sm text-gray-500">
                <Lock className="h-4 w-4 mr-2" />
                <span>All data is encrypted and stored securely</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}