import type { Metadata } from "next";
import "./globals.css";
import PrivacyBanner from "../components/PrivacyBanner";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Finance Coach MVP",
  description: "Smart Financial Coach - Insights, Subscriptions, Goals",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <header className="glass sticky top-0 z-50 border-b border-white/20">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">FC</span>
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Finance Coach
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-1" role="navigation" aria-label="Main navigation">
                <a href="/dashboard" className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/50">
                  Dashboard
                </a>
                <a href="/insights" className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/50">
                  Insights
                </a>
                <a href="/subscriptions" className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/50">
                  Subscriptions
                </a>
                <a href="/goals" className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/50">
                  Goals
                </a>
                <a href="/about/privacy" className="text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/50">
                  Privacy
                </a>
              </div>
            </div>
          </nav>
        </header>
        <PrivacyBanner />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
