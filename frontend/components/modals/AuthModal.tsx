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
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);

  const roles = [
    { id: 'Vet Clinic', name: 'Vet Clinic', icon: '🏥', description: 'Doctors & Clinics' },
    { id: 'NGO', name: 'NGO', icon: '🐾', description: 'Animal Shelters' },
    { id: 'Volunteer / City Lead', name: 'Volunteer', icon: '🤝', description: 'Helping hands' },
  ];

  const handleGoogleLogin = async () => {
    if (!selectedRole) {
      alert("Please select a role first!");
      return;
    }
    // Simulate login for now - we'll integrate the real SDK in the next step
    console.log(`Logging in as ${selectedRole}...`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-primary to-brand-sky" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-brand-dark transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-brand-bg text-brand-primary text-xs font-bold rounded-full mb-4">JOIN THE TRIBE</span>
              <h2 className="text-3xl font-extrabold text-brand-dark mb-2">Welcome to PAWZZ</h2>
              <p className="text-gray-500">Select your role to continue</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => setSelectedRole(role.id)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                    selectedRole === role.id 
                      ? 'border-brand-primary bg-brand-bg/50 shadow-md translate-x-1' 
                      : 'border-gray-100 hover:border-brand-primary/30 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${
                    selectedRole === role.id ? 'bg-white shadow-sm' : 'bg-gray-100'
                  }`}>
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-brand-dark">{role.name}</div>
                    <div className="text-xs text-gray-500">{role.description}</div>
                  </div>
                  {selectedRole === role.id && (
                    <div className="w-5 h-5 bg-brand-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={!selectedRole}
              className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold transition-all shadow-lg ${
                selectedRole 
                  ? 'bg-brand-dark text-white hover:bg-black hover:shadow-xl active:scale-95' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              }`}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            
            <p className="mt-6 text-center text-xs text-gray-400">
              By continuing, you agree to PAWZZ’s <span className="underline cursor-pointer hover:text-gray-600">Terms of Service</span> and <span className="underline cursor-pointer hover:text-gray-600">Privacy Policy</span>.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
