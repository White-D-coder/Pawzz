"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function AuthPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
     if (user) router.push('/');
  }, [user, router]);

  const roles = [
    { id: 'Pet Parent', name: 'Pet Parent', icon: '🐶', description: 'Find care for your pet' },
    { id: 'Vet Clinic', name: 'Vet Clinic', icon: '🏥', description: 'Manage doctors & slots' },
    { id: 'NGO', name: 'NGO', icon: '🐾', description: 'Dispatch rescue missions' },
    { id: 'Volunteer', name: 'Volunteer', icon: '🤝', description: 'Help animals in need' },
  ];

  const handleAuthSuccess = async (credentialResponse: any) => {
    if (!selectedRole) {
      setError("Dosti shuru karne ke liye ek ROLE select karein! (Select a role to continue)");
      return;
    }
    
    setLoading(true);
    try {
      const loggedInUser = await login(credentialResponse.credential, selectedRole);
      
      if (loggedInUser.role === 'Admin') {
        router.push('/admin');
      } else if (loggedInUser.status === 'pending') {
        router.push('/?auth=pending'); // Show pending modal on home
      } else {
        router.push('/');
      }
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex items-stretch overflow-hidden">
      {/* Left Decoration - Brand Side */}
      <div className="hidden lg:flex w-1/2 bg-teal-800 relative items-center justify-center p-20 overflow-hidden">
         <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -ml-40 -mt-40" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl -mr-40 -mb-40" />
         </div>
         
         <div className="relative z-10 text-white max-w-lg">
            <h1 className="text-7xl font-black tracking-tighter leading-[0.9] mb-8">
               JOIN THE <br/> <span className="text-teal-400">TRIBE.</span>
            </h1>
            <p className="text-xl font-medium text-teal-100/80 mb-12 leading-relaxed">
               The unified platform connecting veterinary clinics, NGOs, and volunteers to provide the best care for every pet.
            </p>
            
            <div className="flex gap-4">
               <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10">
                  <div className="text-2xl font-black leading-none">2k+</div>
                  <div className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Members</div>
               </div>
               <div className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/10">
                  <div className="text-2xl font-black leading-none">500+</div>
                  <div className="text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">Rescues</div>
               </div>
            </div>
         </div>
         
         {/* Floating Paws Decoration */}
         <div className="absolute top-1/4 right-10 text-6xl opacity-20 rotate-12">🐾</div>
         <div className="absolute bottom-20 left-20 text-4xl opacity-10 -rotate-45">🦴</div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 md:p-16 lg:p-24 justify-center relative bg-white">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-12">
               <div className="w-12 h-12 bg-teal-800 rounded-2xl mb-6 flex items-center justify-center text-2xl shadow-lg shadow-teal-900/20">🐾</div>
               <h2 className="text-4xl font-black text-gray-900 tracking-tight">Create your account</h2>
               <p className="text-gray-500 font-medium mt-2">Pick your identity within the ecosystem.</p>
            </div>

            <div className="space-y-3 mb-10">
               {roles.map((role) => (
                 <motion.div
                   key={role.id}
                   whileHover={{ x: 4 }}
                   onClick={() => {
                     setSelectedRole(role.id);
                     setError(null);
                   }}
                   className={`flex items-center gap-5 p-5 rounded-[2rem] border-2 transition-all cursor-pointer group select-none ${
                     selectedRole === role.id 
                       ? 'border-teal-700 bg-teal-50/50 shadow-sm' 
                       : 'border-gray-100 hover:border-teal-700/20 hover:bg-gray-50'
                   }`}
                 >
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all ${
                       selectedRole === role.id ? 'bg-white shadow-sm scale-110' : 'bg-gray-50'
                    }`}>
                       {role.icon}
                    </div>
                    <div className="flex-1">
                       <h4 className="font-black text-gray-900">{role.name}</h4>
                       <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">{role.description}</p>
                    </div>
                    {selectedRole === role.id && (
                       <div className="w-6 h-6 bg-teal-700 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                       </div>
                    )}
                 </motion.div>
               ))}
            </div>

            <AnimatePresence>
               {error && (
                 <motion.div 
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-red-50 text-red-500 p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-center mb-6 border border-red-100"
                 >
                    {error}
                 </motion.div>
               )}
            </AnimatePresence>

            <div className={`transition-all duration-500 scale-105 ${!selectedRole ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100 select-none'}`}>
               <div className="relative">
                  {loading && (
                    <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-full font-black text-xs text-teal-800">
                       PROCESING SECURE SIGN-IN...
                    </div>
                  )}
                  <GoogleLogin
                    onSuccess={handleAuthSuccess}
                    onError={() => setError("Google Login Failed")}
                    theme="filled_blue"
                    shape="pill"
                    width="400"
                    text="continue_with"
                  />
               </div>

               <div className="mt-8 flex items-center gap-4 text-gray-300">
                  <div className="h-[1px] bg-gray-100 flex-grow" />
                  <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Secure Unified Access</span>
                  <div className="h-[1px] bg-gray-100 flex-grow" />
               </div>

               <p className="mt-8 text-center text-xs font-bold text-gray-400">
                  Are you an Admin? <span className="text-teal-700 underline cursor-pointer" onClick={() => setSelectedRole('Admin')}>Login here</span>
               </p>
            </div>
          </div>
          
          <div className="mt-20 text-[10px] font-black text-gray-300 uppercase tracking-[0.3em] text-center lg:text-left">
             © 2024 PAWZZ Ecosytem • Encrypted Access
          </div>
      </div>
    </div>
  );
}
