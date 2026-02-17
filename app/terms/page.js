"use client";
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Shield, FileText, Scale, AlertCircle, CheckCircle2,
  Menu, X, ChevronLeft, Home, Users, Mail, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHasHistory(window.history.length > 1);
    }
  }, []);

  const handleBackNavigation = (e) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      if (hasHistory) {
        router.back();
      } else {
        router.push('/');
      }
    }
  };

  const lastUpdated = "February 15, 2026";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-50">
        <button 
          onClick={handleBackNavigation}
          className="flex items-center gap-2 text-orange-600 font-medium text-sm"
        >
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        
        <span className="font-bold text-gray-900 text-sm">Terms of Service</span>
        
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1 text-gray-600"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* DESKTOP NAVBAR */}
      <nav className="hidden md:flex h-20 bg-white border-b border-gray-200 px-4 sm:px-6 md:px-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white">
            <Sparkles size={24} />
          </div>
          <Link href="/" className="text-2xl font-bold tracking-tight">Convertify</Link>
        </div>
        <Link 
          href="/"
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
        >
          <ArrowRight size={18} />
          Back to Converter
        </Link>
      </nav>

      {/* MOBILE MENU DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 py-4 absolute top-14 left-0 right-0 z-40 shadow-xl rounded-b-2xl">
          <div className="flex flex-col">
            <Link 
              href="/" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center justify-center">
                <Home size={18} />
              </div>
              <span className="font-medium">Home</span>
            </Link>
          
            <Link 
              href="/about" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center justify-center">
                <Users size={18} />
              </div>
              <span className="font-medium">About</span>
            </Link>
            
            <Link 
              href="/privacy" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center justify-center">
                <Shield size={18} />
              </div>
              <span className="font-medium">Privacy</span>
            </Link>
            
            <Link 
              href="/contact" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center justify-center">
                <Mail size={18} />
              </div>
              <span className="font-medium">Contact</span>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full mb-4">
              <Scale size={16} />
              <span className="font-medium text-sm">Terms of Service</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Terms of <span className="text-orange-600">Use</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-16">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 md:p-10">
            
            <div className="prose prose-sm sm:prose-base max-w-none text-gray-600">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 first:mt-0">1. Acceptance of Terms</h2>
              <p>
                By accessing or using Convertify ("the Service"), you agree to be bound by these Terms of Service. 
                If you do not agree, you may not use the Service. We reserve the right to update these terms at any time.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">2. Description of Service</h2>
              <p>
                Convertify provides browser‑based file conversion tools. All processing occurs locally on your device; 
                we do not upload, store, or have access to your files. You are responsible for the files you choose to convert.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">3. User Responsibilities</h2>
              <p>You agree to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the Service only for lawful purposes.</li>
                <li>Not attempt to reverse engineer or exploit the Service.</li>
                <li>Not use the Service to distribute malware or harmful content.</li>
                <li>Not exceed reasonable usage limits (automated scripts are prohibited).</li>
              </ul>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">4. Intellectual Property</h2>
              <p>
                The Service, including its code, design, and content, is owned by Convertify and protected by copyright 
                and trademark laws. You may not copy, modify, or distribute any part without written permission.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">5. Disclaimer of Warranties</h2>
              <p>
                The Service is provided "as is" without warranties of any kind. We do not guarantee that conversions will 
                be error‑free or that the Service will be uninterrupted. You use it at your own risk.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">6. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Convertify shall not be liable for any indirect, incidental, 
                or consequential damages arising from your use of the Service. Because files are processed locally, 
                we cannot be responsible for data loss or corruption.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">7. Indemnification</h2>
              <p>
                You agree to indemnify and hold Convertify harmless from any claims arising out of your misuse of the Service.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">8. Governing Law</h2>
              <p>
                These terms are governed by the laws of [Your Country/State], without regard to conflict of law principles.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">9. Contact Information</h2>
              <p>
                For questions about these Terms, please contact us at{' '}
                <a href="mailto:legal@convertify.com" className="text-orange-600 hover:underline">
                  legal@convertify.com
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-100 via-white to-gray-50 rounded-2xl p-6 sm:p-8 md:p-12 text-center shadow-xl border border-gray-200"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Ready to Convert?
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
              Experience fast, private file conversion – no sign‑up required.
            </p>
            <Link 
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:shadow-lg transition-all text-sm sm:text-base"
            >
              <Sparkles size={16} />
              Start Converting
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-800 py-8 sm:py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 md:mb-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white">
                <Sparkles size={18} className="sm:size-6" />
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold">Convertify</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                &copy; {new Date().getFullYear()} Convertify. All rights reserved.
              </p>
              <div className="flex gap-4 sm:gap-6 justify-center md:justify-end">
                <Link href="/privacy" className="text-gray-600 hover:text-orange-600 transition-colors text-xs sm:text-sm">
                  Privacy
                </Link>
                <Link href="/terms" className="text-gray-600 hover:text-orange-600 transition-colors text-xs sm:text-sm">
                  Terms
                </Link>
                <Link href="/contact" className="text-gray-600 hover:text-orange-600 transition-colors text-xs sm:text-sm">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}