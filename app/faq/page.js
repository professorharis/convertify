"use client";
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, HelpCircle, ChevronDown, ChevronUp,
  Menu, X, ChevronLeft, Home, Users, Shield, FileText, Mail, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function FAQPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
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

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Is Convertify really free?",
      answer: "Yes! Convertify is completely free to use. There are no hidden fees, subscription plans, or premium tiers. All features are available to everyone."
    },
    {
      question: "Are my files secure?",
      answer: "Absolutely. All file conversion happens locally in your browser. Your files never leave your device — we never upload, store, or have access to them."
    },
    {
      question: "What file formats are supported?",
      answer: "We support 9+ image formats (PNG, JPG, WebP, GIF, SVG, BMP, ICO, TIFF) and 10+ document formats (PDF, DOCX, TXT, RTF, HTML, XML, CSV, JSON, Markdown, PPTX)."
    },
    {
      question: "Do I need to create an account?",
      answer: "No account or sign-up is required. Just visit the site, upload your file, choose your format, and convert."
    },
    {
      question: "Is there a file size limit?",
      answer: "We currently support files up to 50MB. This limit is in place to ensure smooth performance in your browser."
    },
    {
      question: "Can I convert PDF to DOCX?",
      answer: "Yes, you can convert PDF to DOCX, as well as many other document conversions. Our advanced processing handles text extraction and formatting."
    },
    {
      question: "How fast are conversions?",
      answer: "Most conversions complete in seconds. Speed depends on your device and file size, but our optimized code ensures quick results."
    },
    {
      question: "What happens to my files after conversion?",
      answer: "Once you close your browser tab, all temporary data is automatically cleared. Your files are never stored on our servers."
    }
  ];

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
        
        <span className="font-bold text-gray-900 text-sm">FAQ</span>
        
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
              href="/terms" 
              className="flex items-center gap-4 py-3 px-4 text-gray-700 hover:text-orange-600 hover:bg-gray-50 transition-colors no-underline border-b border-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 bg-orange-50 text-orange-600 p-2 rounded-lg flex items-center justify-center">
                <FileText size={18} />
              </div>
              <span className="font-medium">Terms</span>
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
              <HelpCircle size={16} />
              <span className="font-medium text-sm">Got Questions?</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked <span className="text-orange-600">Questions</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              Everything you need to know about Convertify
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-16">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 text-sm sm:text-base">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp size={20} className="text-orange-600 flex-shrink-0" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-5 sm:px-6 pb-5 sm:pb-6 text-gray-600 text-sm sm:text-base border-t border-gray-100">
                    {faq.answer}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-100 via-white to-gray-50 rounded-2xl p-6 sm:p-8 md:p-12 text-center shadow-xl border border-gray-200"
          >
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
              Still Have Questions?
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
              We're here to help. Reach out to us directly.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold border-2 border-orange-500 hover:bg-orange-50 transition-colors text-sm sm:text-base"
              >
                <Mail size={16} />
                Contact Us
              </Link>
              <Link 
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold hover:shadow-lg transition-all text-sm sm:text-base"
              >
                <Sparkles size={16} />
                Start Converting
              </Link>
            </div>
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