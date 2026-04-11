"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();

  const handleGoogleLogin = async () => {
    // This would typically involve the Google SDK
    // For now, we'll simulate getting a token and calling our login service
    console.log("Simulating Google Login...");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative"
            >
              <div className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer" onClick={onClose}>
                ✕
              </div>
              
              <div className="text-center mb-8">
                <div className="text-3xl font-extrabold text-brand-dark mb-2">PAWZZ</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to PAWZZ</h2>
                <p className="text-gray-500 text-sm">Join our pet care community</p>
              </div>

              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-4 hover:bg-brand-bg transition-colors font-medium text-gray-700 mb-6"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Continue with Google
              </button>

              <div className="space-y-4">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider text-center">Select your role</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border-2 border-brand-primary/20 bg-brand-bg/50 p-4 rounded-xl text-center cursor-pointer hover:border-brand-primary transition-all">
                    <span className="block text-xl mb-1">🏥</span>
                    <span className="text-xs font-bold text-brand-dark">Clinic</span>
                  </div>
                  <div className="border-2 border-gray-100 p-4 rounded-xl text-center cursor-pointer hover:border-brand-primary transition-all">
                    <span className="block text-xl mb-1">🐾</span>
                    <span className="text-xs font-bold text-gray-600">NGO</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
