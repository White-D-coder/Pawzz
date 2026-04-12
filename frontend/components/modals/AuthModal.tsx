"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const roles = [
    { id: 'Pet Parent', name: 'Pet Parent', icon: '🐶', description: 'Find care for your pet' },
    { id: 'Vet Clinic', name: 'Vet Clinic', icon: '🏥', description: 'Doctors & Clinics' },
    { id: 'NGO', name: 'NGO', icon: '🐾', description: 'Animal Shelters' },
    { id: 'Volunteer / City Lead', name: 'Volunteer', icon: '🤝', description: 'Helping hands' },
    { id: 'Admin', name: 'System Admin', icon: '⚡', description: 'Platform Management' },
  ];

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (!selectedRole) {
      setError("Please select a role first!");
      return;
    }
    
    try {
      const loggedInUser = await login(credentialResponse.credential, selectedRole);
      console.log("👤 Login Success! User Role:", loggedInUser.role);
      onClose();
      
      // Redirect based on role
      if (loggedInUser.role === 'Admin') {
        console.log("🚀 Redirecting to Admin Panel...");
        router.push('/admin');
      } else {
        console.log("🏠 Not an Admin, staying on home page.");
      }
    } catch (err) {
      console.error("❌ Login redirection failed:", err);
      setError("Authentication failed. Please check your console.");
    }
  };

  return (
    <AnimatePresence>
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />
        <motion.div
            initial={false}
            animate={isOpen ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full relative z-10 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-700 to-teal-800" />
            
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="text-center mb-8">
              <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-bold rounded-full mb-4">JOIN THE TRIBE</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome to PAWZZ</h2>
              <p className="text-gray-500 font-medium">Select your role to continue</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-6">
              {roles.map((role) => (
                <div
                  key={role.id}
                  onClick={() => {
                    setSelectedRole(role.id);
                    setError(null);
                  }}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${
                    selectedRole === role.id 
                      ? 'border-teal-700 bg-teal-50 shadow-md translate-x-1' 
                      : 'border-gray-100 hover:border-teal-700/30 hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 ${
                    selectedRole === role.id ? 'bg-white shadow-sm' : 'bg-gray-100'
                  }`}>
                    {role.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-900">{role.name}</div>
                    <div className="text-xs text-gray-500 font-medium">{role.description}</div>
                  </div>
                  {selectedRole === role.id && (
                    <div className="w-5 h-5 bg-teal-700 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl text-center">
                {error}
              </div>
            )}

            <div className={`transition-opacity ${!selectedRole ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Google Login Failed")}
                useOneTap
                theme="outline"
                shape="pill"
                width="350"
                text="continue_with"
              />

              {/* Dev Mode Bypass Button */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  onClick={() => handleGoogleSuccess({ credential: 'mock_token_bypass' })}
                  className="w-full mt-4 py-3 bg-gray-100 text-gray-400 text-[10px] font-black rounded-full hover:bg-gray-200 transition-all uppercase tracking-widest border border-dashed border-gray-300"
                >
                  🛠️ Dev Bypass Login
                </button>
              )}
            </div>
            
            <p className="mt-6 text-center text-[10px] text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
              By continuing, you agree to PAWZZ’s <span className="underline cursor-pointer hover:text-teal-700">Terms</span> and <span className="underline cursor-pointer hover:text-teal-700">Privacy</span>.
            </p>
          </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
