'use client';

import { Shield, Database, Settings, Lock, Clock, Users, Mail, Eye, Key } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-8"
    >
      <motion.div variants={sectionVariants}>
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">Privacy Policy</h1>
        <p className="mt-2 text-lg text-white/90 drop-shadow">Your data, your control, our commitment.</p>
      </motion.div>

      <motion.div variants={sectionVariants} className="glass rounded-xl p-8 shadow-lg">
        <div className="flex items-center mb-4">
          <Shield className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">1. What Data We Collect</h2>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          Finance Coach connects to your bank accounts through secure, read-only connections to help you understand your spending patterns.
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
          <li><strong>Transaction data:</strong> Date, amount, merchant, category, and description</li>
          <li><strong>Account information:</strong> Account type and balance (read-only)</li>
          <li><strong>User preferences:</strong> Your settings and customization choices</li>
          <li><strong>Usage analytics:</strong> How you interact with the app to improve our service</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          <strong>We never collect:</strong> Banking credentials, social security numbers, or other sensitive personal identifiers.
        </p>
      </motion.div>

      <motion.div variants={sectionVariants} className="glass rounded-xl p-8 shadow-lg">
        <div className="flex items-center mb-4">
          <Database className="h-6 w-6 text-emerald-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">2. How We Process & Store Your Data</h2>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
          <li><strong>Encryption:</strong> All data is encrypted in transit and at rest using bank-level security standards</li>
          <li><strong>Secure servers:</strong> Data is stored on secure, SOC 2 compliant cloud infrastructure</li>
          <li><strong>Local processing:</strong> Most analysis happens on our secure servers, not on your device</li>
          <li><strong>No third-party sharing:</strong> We never sell or share your financial data with third parties</li>
          <li><strong>Regular audits:</strong> Our security practices are regularly audited by independent firms</li>
        </ul>
      </motion.div>

      <motion.div variants={sectionVariants} className="glass rounded-xl p-8 shadow-lg">
        <div className="flex items-center mb-4">
          <Settings className="h-6 w-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">3. Your Data Controls</h2>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          You have complete control over your data:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
          <li><strong>Export data:</strong> Download all your data as a CSV file at any time</li>
          <li><strong>Delete data:</strong> Permanently delete all your data with password confirmation</li>
          <li><strong>Disconnect accounts:</strong> Remove bank connections at any time</li>
          <li><strong>Update preferences:</strong> Change your privacy settings and data sharing preferences</li>
          <li><strong>Data portability:</strong> Your data belongs to you - we make it easy to take it elsewhere</li>
        </ul>
      </motion.div>

      <motion.div variants={sectionVariants} className="glass rounded-xl p-8 shadow-lg">
        <div className="flex items-center mb-4">
          <Lock className="h-6 w-6 text-red-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">4. Security Practices</h2>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
          <li><strong>Bank-level encryption:</strong> AES-256 encryption for all data at rest and in transit</li>
          <li><strong>Secure connections:</strong> All bank connections use OAuth 2.0 and read-only access</li>
          <li><strong>Multi-factor authentication:</strong> Required for all administrative access</li>
          <li><strong>Regular security audits:</strong> Third-party security assessments every quarter</li>
          <li><strong>Incident response:</strong> 24/7 monitoring with immediate response to any security issues</li>
          <li><strong>Employee access:</strong> Strict access controls - only authorized personnel can access your data</li>
        </ul>
      </motion.div>

      <motion.div variants={sectionVariants} className="glass rounded-xl p-8 shadow-lg">
        <div className="flex items-center mb-4">
          <Clock className="h-6 w-6 text-orange-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">5. Data Retention & Lifecycle</h2>
        </div>
        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
          <li><strong>Active accounts:</strong> Data is retained while your account is active</li>
          <li><strong>Account closure:</strong> Data is deleted within 30 days of account closure</li>
          <li><strong>Inactive accounts:</strong> Data is deleted after 2 years of inactivity</li>
          <li><strong>Legal requirements:</strong> Some data may be retained longer if required by law</li>
          <li><strong>Backup deletion:</strong> All backups are securely deleted within 90 days</li>
        </ul>
      </motion.div>

      <motion.div variants={sectionVariants} className="glass rounded-xl p-8 shadow-lg">
        <div className="flex items-center mb-4">
          <Eye className="h-6 w-6 text-teal-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">6. How We Use Your Data</h2>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          We use your data only to provide and improve our financial coaching services:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
          <li><strong>Spending analysis:</strong> Categorize and analyze your transactions to provide insights</li>
          <li><strong>Goal tracking:</strong> Help you set and track financial goals</li>
          <li><strong>Subscription detection:</strong> Identify recurring charges and potential savings</li>
          <li><strong>Service improvement:</strong> Analyze usage patterns to improve our features</li>
          <li><strong>Customer support:</strong> Help you with questions about your account</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          <strong>We never:</strong> Sell your data, use it for advertising, or share it with third parties without your explicit consent.
        </p>
      </motion.div>

      <motion.div variants={sectionVariants} className="glass rounded-xl p-8 shadow-lg">
        <div className="flex items-center mb-4">
          <Key className="h-6 w-6 text-indigo-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">7. Your Rights</h2>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          You have the right to:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
          <li><strong>Access:</strong> Request a copy of all data we have about you</li>
          <li><strong>Correction:</strong> Correct any inaccurate data</li>
          <li><strong>Deletion:</strong> Request deletion of your data (right to be forgotten)</li>
          <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
          <li><strong>Restriction:</strong> Limit how we process your data</li>
          <li><strong>Objection:</strong> Object to certain types of data processing</li>
        </ul>
      </motion.div>

      <motion.div variants={sectionVariants} className="glass rounded-xl p-8 shadow-lg">
        <div className="flex items-center mb-4">
          <Mail className="h-6 w-6 text-pink-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">8. Contact Us</h2>
        </div>
        <p className="text-gray-700 leading-relaxed mb-4">
          Questions about this privacy policy or your data? We're here to help:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
          <li><strong>Email:</strong> privacy@financecoach.com</li>
          <li><strong>Phone:</strong> 1-800-FINANCE (1-800-346-2623)</li>
          <li><strong>Address:</strong> Finance Coach, Inc., 123 Security St, San Francisco, CA 94105</li>
          <li><strong>Data Protection Officer:</strong> dpo@financecoach.com</li>
        </ul>
        <p className="text-gray-700 leading-relaxed mt-4">
          We respond to all privacy inquiries within 48 hours.
        </p>
      </motion.div>

      <motion.div variants={sectionVariants} className="glass rounded-xl p-8 shadow-lg">
        <div className="flex items-center mb-4">
          <Clock className="h-6 w-6 text-gray-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">9. Policy Updates</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          We may update this privacy policy from time to time. When we do, we'll notify you via email and in-app notification at least 30 days before changes take effect.
          Your continued use of the service after the effective date constitutes acceptance of the updated policy.
        </p>
        <p className="text-gray-700 leading-relaxed mt-4">
          <strong>Last updated:</strong> December 2024
        </p>
      </motion.div>
    </motion.div>
  );
}