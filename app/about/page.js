"use client";
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Users, Target, Globe, Shield, Zap, 
  Heart, Award, Clock, Star, TrendingUp, Users as UsersIcon,
  CheckCircle2, ArrowRight, Menu, X, ChevronLeft, Home, FileText, HelpCircle, Mail, Code
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
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

  // Yahan maine Sirf Aapka naam dala hai, kyunke client ko owner se matlab hota hai
  const team = [
    { 
      name: "Haris Khan", 
      role: "Founder & Lead Developer", 
      bio: "Full-stack developer passionate about building secure, AI-powered tools that solve real-world problems.", 
      avatar: "/team/haris.jpg", // Apni pic ka naam yahan likh dena
      icon: <Code size={32} />
    },
    { 
      name: "Convertify AI", 
      role: "Core Engine", 
      bio: "Our advanced AI algorithms working 24/7 to ensure your files are converted instantly and accurately.", 
      avatar: "/team/ai.jpg", 
      icon: <Zap size={32} />
    }
  ];

  // Ye milestones aapki journey ke hisab se set kiye hain
  const milestones = [
    { year: "2025", title: "Inception", description: "The idea of Convertify was born to solve file format issues simply." },
    { year: "2026 Q1", title: "Development", description: "Built the core engine using Next.js and advanced AI integration." },
    { year: "2026 Q2", title: "Global Launch", description: "Convertify goes live, empowering users worldwide." },
    { year: "Future", title: "Mobile App", description: "Expanding our ecosystem to iOS and Android platforms." },
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
        
        <span className="font-bold text-gray-900 text-sm">About</span>
        
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
      <section className="py-8 sm:py-12 md:py-20 bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-2xl sm:text-3xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              About <span className="text-orange-600">Convertify</span>
            </h1>
            <p className="text-sm sm:text-base md:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed px-2">
              A professional tool designed for speed, security, and simplicity. 
              We make file conversion effortless so you can focus on your work.
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Users className="text-orange-500" size={16} />
                <span className="font-medium text-xs sm:text-sm">Trusted Globally</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Zap className="text-orange-500" size={16} />
                <span className="font-medium text-xs sm:text-sm">AI Powered</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
                <Shield className="text-orange-500" size={16} />
                <span className="font-medium text-xs sm:text-sm">100% Secure</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4 sm:space-y-6"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Our Story</h2>
              <div className="space-y-3 sm:space-y-4 text-gray-600 text-sm sm:text-base">
                <p>
                  Convertify started with a single goal: to remove the friction from file management. 
                  As a developer, I realized that most online converters were either full of ads, 
                  slow, or unsafe for sensitive documents.
                </p>
                <p>
                  I wanted to build something better. A platform that respects user privacy by processing 
                  files locally or securely in the cloud, without storing them permanently.
                </p>
                <p>
                  Today, Convertify stands as a testament to modern web technology — combining 
                  the power of AI with a clean, user-centric design. It is built for students, 
                  professionals, and creators who value their time.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Fast.</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Secure. Reliable.</h3>
                <p className="text-orange-100 text-sm sm:text-base">
                  Built by <strong>Creative Haris</strong>, engineered for performance.
                </p>
              </div>
              <div className="absolute -bottom-4 sm:-bottom-6 -right-4 sm:-right-6 bg-white rounded-2xl p-4 sm:p-6 shadow-xl border border-gray-200 w-2/3">
                <Code className="text-orange-500 mb-2 sm:mb-3" size={24} />
                <h4 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">Clean Code</h4>
                <p className="text-gray-600 text-xs sm:text-sm">Optimized for all devices.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Why Convertify?</h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto px-2">
              Our core values that define the product
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                icon: <Shield size={24} />,
                title: "Privacy Focused",
                description: "We believe privacy is a right. Your files are yours alone.",
                color: "text-blue-600 bg-blue-50"
              },
              {
                icon: <Zap size={24} />,
                title: "Lightning Speed",
                description: "Powered by Next.js architecture for instant conversions.",
                color: "text-orange-600 bg-orange-50"
              },
              {
                icon: <Heart size={24} />,
                title: "Made with Passion",
                description: "Developed with attention to detail and user experience.",
                color: "text-red-600 bg-red-50"
              },
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl ${value.color} flex items-center justify-center mb-4 sm:mb-5 md:mb-6`}>
                  {value.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{value.title}</h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section (Updated to Focus on Haris) */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Meet the Creator</h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              The mind behind the code
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 text-center w-full max-w-sm shadow-md"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center text-white shadow-inner">
                  {/* Agar image nahi hai to Icon dikhayega */}
                  {member.icon}
                </div>
                <h3 className="font-bold text-xl sm:text-2xl mb-1">{member.name}</h3>
                <p className="text-orange-600 font-medium text-base sm:text-lg mb-3 sm:mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm sm:text-base">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Our Journey</h2>
            <p className="text-gray-600 text-sm sm:text-base">From concept to reality</p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-orange-500 to-red-600"></div>
            
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center mb-8 sm:mb-12 ${
                  index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : ''
                }`}
              >
                <div className="w-1/2 md:w-2/5"></div>
                <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-4 border-orange-500 z-10"></div>
                <div className={`w-full md:w-2/5 ${index % 2 === 0 ? 'md:pr-8 sm:md:pr-12' : 'md:pl-8 sm:md:pl-12'}`}>
                  <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-xs sm:text-sm text-orange-600 font-bold mb-1 sm:mb-2">{milestone.year}</div>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">{milestone.title}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{milestone.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-100 via-white to-gray-50 rounded-2xl p-6 sm:p-8 md:p-12 text-center shadow-xl border border-gray-200"
          >
            <h2 className="text-lg sm:text-xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              Ready to streamline your workflow?
            </h2>
            <p className="text-sm sm:text-base md:text-xl text-gray-700 mb-4 sm:mb-6 md:mb-10">
              Join the growing community of users trusting Convertify.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link 
                href="/"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold hover:shadow-2xl transition-all text-sm sm:text-base md:text-lg"
              >
                <Zap size={16} />
                Start Converting
              </Link>
              <Link 
                href="/contact"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 bg-white text-orange-600 px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl font-bold border-2 border-orange-500 hover:bg-orange-50 transition-colors text-sm sm:text-base md:text-lg"
              >
                <UsersIcon size={16} />
                Work with Haris
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
                &copy; {new Date().getFullYear()} Convertify. Designed by Creative Haris.
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