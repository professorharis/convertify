"use client";
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Mail, Phone, MapPin, Send, CheckCircle2,
  Menu, X, ChevronLeft, Home, Users, Shield, FileText, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission – replace with actual Formspree or API call
    setFormSubmitted(true);
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const contactInfo = [
    { icon: <Mail size={20} />, title: "Email", value: "hello@convertify.com", link: "mailto:hello@convertify.com" },
    { icon: <Phone size={20} />, title: "Phone", value: "+1 (555) 123-4567", link: "tel:+15551234567" },
    { icon: <MapPin size={20} />, title: "Office", value: "123 Innovation Dr, San Francisco, CA", link: "#" },
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
        
        <span className="font-bold text-gray-900 text-sm">Contact Us</span>
        
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
              <Mail size={16} />
              <span className="font-medium text-sm">Get in Touch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Contact <span className="text-orange-600">Us</span>
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            
            {/* Left: Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Get in Touch</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                Whether you have a question about our tools, need support, or just want to say hello, 
                we're here for you.
              </p>
              
              <div className="space-y-4">
                {contactInfo.map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-orange-300 transition-colors no-underline"
                  >
                    <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{item.title}</div>
                      <div className="font-medium text-gray-900">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Right: Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8"
            >
              {formSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600 text-sm">
                    Thank you for contacting us. We'll get back to you soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Send a Message</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    <Send size={18} />
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>
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
              Need Immediate Help?
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
              Check our FAQ or start converting right away.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                href="/faq"
                className="inline-flex items-center justify-center gap-2 bg-white text-orange-600 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold border-2 border-orange-500 hover:bg-orange-50 transition-colors text-sm sm:text-base"
              >
                <FileText size={16} />
                Visit FAQ
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