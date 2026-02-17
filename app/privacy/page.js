"use client";
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Shield, Lock, Eye, Database, Server, 
  FileText, Mail, Cookie, AlertCircle, CheckCircle2,
  Menu, X, ChevronLeft, Home, HelpCircle, Users, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
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
        
        <span className="font-bold text-gray-900 text-sm">Privacy Policy</span>
        
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
              href="/contact" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center justify-center">
                <Mail size={18} />
              </div>
              <span className="font-medium">Contact</span>
            </Link>
            
            <Link 
              href="/terms" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center justify-center">
                <FileText size={18} />
              </div>
              <span className="font-medium">Terms</span>
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
              <Shield size={16} />
              <span className="font-medium text-sm">Privacy First</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Privacy <span className="text-orange-600">Policy</span>
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
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-6 first:mt-0">Our Commitment to Privacy</h2>
              <p>
                At Convertify, we take your privacy seriously. Our service is designed to process files entirely 
                in your browser — we never upload, store, or have access to your files or personal data. 
                This policy explains how we protect your information.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">What We Collect</h2>
              <p>
                We collect minimal information necessary to operate and improve our service:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Anonymous usage data</strong> – We may collect anonymous statistics about feature usage to improve the service. This data cannot be traced back to you.</li>
                <li><strong>Email (optional)</strong> – If you contact us, we'll use your email only to respond. We never share it.</li>
                <li><strong>Cookies</strong> – We use essential cookies to maintain your session preferences. No tracking cookies are used.</li>
              </ul>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">How We Protect Your Files</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                {[
                  { icon: <Lock size={20} />, text: "Files never leave your device" },
                  { icon: <Eye size={20} />, text: "We cannot view your content" },
                  { icon: <Database size={20} />, text: "No cloud storage used" },
                  { icon: <Server size={20} />, text: "All processing is local" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-orange-600">{item.icon}</div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">Data Retention</h2>
              <p>
                Because we don't store your files, there's nothing to retain. Once you close your browser tab, 
                all temporary data is automatically cleared. We keep anonymous usage statistics for up to 26 months.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">Third-Party Services</h2>
              <p>
                We use the following third-party services that may collect anonymous data:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Vercel Analytics</strong> – For basic traffic metrics (no personal data).</li>
                <li><strong>GitHub</strong> – For open-source contributions (public repositories only).</li>
              </ul>
              <p className="mt-4">
                These services are governed by their own privacy policies. We do not share any personal information with them.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">Your Rights</h2>
              <p>
                Depending on your location, you may have rights under GDPR, CCPA, or other privacy laws. 
                Since we don't collect personal data, these rights primarily apply to the anonymous usage data 
                we might hold. To exercise any rights, contact us.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">Children's Privacy</h2>
              <p>
                Our service is not directed at children under 13. We do not knowingly collect information from children.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">Changes to This Policy</h2>
              <p>
                We may update this policy occasionally. The latest version will always be posted here with the 
                "Last updated" date. Significant changes will be announced via our website.
              </p>

              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-8">Contact Us</h2>
              <p>
                If you have questions about this policy, please contact us at{' '}
                <a href="mailto:privacy@convertify.com" className="text-orange-600 hover:underline">
                  privacy@convertify.com
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
              Your Privacy Matters
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
              Experience true privacy with local processing – no uploads, no tracking.
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