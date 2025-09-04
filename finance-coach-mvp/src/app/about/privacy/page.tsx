import { Shield, Database, Lock, Eye, Trash2, Download, Brain, Bug } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">Privacy Policy</h1>
        <p className="text-lg text-white/90 drop-shadow">
          Your privacy and data security are our top priorities
        </p>
      </div>

      {/* Content */}
      <div className="glass rounded-xl p-8 space-y-8">
        
        {/* What Data We Use */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900">What Data This Demo Uses</h2>
          </div>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              This is a <strong>demonstration application</strong> that uses <strong>synthetic data only</strong>. 
              No real bank accounts are connected, and no personal financial information is collected or processed.
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Synthetic transactions:</strong> Generated sample data for demonstration purposes</li>
              <li><strong>No real bank login:</strong> This demo does not connect to any financial institutions</li>
              <li><strong>No external API calls:</strong> All processing happens locally on your device</li>
              <li><strong>No PII collection:</strong> No personally identifiable information is gathered</li>
            </ul>
          </div>
        </section>

        {/* Processing & Storage */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Lock className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900">Processing & Storage</h2>
          </div>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              All data processing and storage happens locally on your device:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Local SQLite database:</strong> All data stored in a local file on your device</li>
              <li><strong>Local API routes:</strong> All calculations and processing happen on the same host</li>
              <li><strong>No cloud storage:</strong> Data never leaves your device</li>
              <li><strong>Optional AI features:</strong> Disabled by default; can be enabled locally</li>
            </ul>
          </div>
        </section>

        {/* Your Controls */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-purple-500" />
            <h2 className="text-2xl font-bold text-gray-900">Your Controls</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Download className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-900">Export Data</h3>
              </div>
              <p className="text-sm text-gray-600">Download your transaction data as CSV at any time</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Trash2 className="w-5 h-5 text-red-500" />
                <h3 className="font-semibold text-gray-900">Delete Data</h3>
              </div>
              <p className="text-sm text-gray-600">Permanently remove all your data from the local database</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <h3 className="font-semibold text-gray-900">AI Phrasing Toggle</h3>
              </div>
              <p className="text-sm text-gray-600">Enable or disable AI-enhanced suggestions and insights</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Bug className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900">Diagnostics Toggle</h3>
              </div>
              <p className="text-sm text-gray-600">Show or hide technical debug information</p>
            </div>
          </div>
        </section>

        {/* Security Practices */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900">Security Practices</h2>
          </div>
          <div className="prose prose-gray max-w-none">
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Content Security Policy (CSP):</strong> Implemented to prevent XSS attacks</li>
              <li><strong>Security headers:</strong> Proper HTTP security headers configured</li>
              <li><strong>No third-party trackers:</strong> No analytics, ads, or tracking scripts</li>
              <li><strong>Local processing only:</strong> No data transmission to external servers</li>
              <li><strong>HTTPS ready:</strong> Application supports secure connections</li>
            </ul>
          </div>
        </section>

        {/* Data Lifecycle */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Database className="w-6 h-6 text-indigo-500" />
            <h2 className="text-2xl font-bold text-gray-900">Data Lifecycle & Retention</h2>
          </div>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              Since this is a local-only application:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Local storage only:</strong> Data remains on your device</li>
              <li><strong>No automatic deletion:</strong> Data persists until you delete it</li>
              <li><strong>Delete resets database:</strong> Removing data completely resets the local database</li>
              <li><strong>No backup or sync:</strong> No automatic backup or synchronization</li>
            </ul>
          </div>
        </section>

        {/* Hypothetical Real Sources */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Lock className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">If Connected to Real Sources (Hypothetical)</h2>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Note:</strong> This demo does not connect to real financial institutions. 
              If it did, here's how we would handle it:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Explicit consent:</strong> Clear opt-in for each data source</li>
              <li><strong>Granular permissions:</strong> Choose which accounts and data types to share</li>
              <li><strong>Easy revocation:</strong> One-click disconnect from any connected source</li>
              <li><strong>Data portability:</strong> Export all data before disconnecting</li>
              <li><strong>Transparent processing:</strong> Clear explanation of how data is used</li>
            </ul>
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6 text-gray-500" />
            <h2 className="text-2xl font-bold text-gray-900">Contact & Issues</h2>
          </div>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              This is a demonstration application. For questions about privacy practices or to report issues:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Privacy questions:</strong> Review this policy and the privacy controls modal</li>
              <li><strong>Technical issues:</strong> Check the application logs and diagnostics</li>
              <li><strong>Data concerns:</strong> Use the export and delete functions as needed</li>
              <li><strong>Feature requests:</strong> This is a demo - features are for demonstration only</li>
            </ul>
          </div>
        </section>

        {/* Last Updated */}
        <div className="pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
