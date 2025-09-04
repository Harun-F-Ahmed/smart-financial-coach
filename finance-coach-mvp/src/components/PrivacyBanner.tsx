'use client';

import { useState } from 'react';
import { Shield, X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PrivacyControlsModal from './PrivacyControlsModal';

export default function PrivacyBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 relative"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-white" />
            <p className="text-sm font-medium">
              Your data is secure • Bank-level encryption • Processing stays local.{' '}
              <button
                onClick={() => setShowModal(true)}
                className="underline hover:no-underline inline-flex items-center space-x-1"
              >
                <span>Learn more</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </p>
          </div>
          <button
            onClick={() => setIsVisible(false)}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Dismiss privacy banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <PrivacyControlsModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </>
  );
}
