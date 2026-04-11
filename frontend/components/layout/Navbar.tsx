"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '../modals/AuthModal';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md shadow-sm z-40 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-extrabold text-brand-dark flex items-center gap-2">
            <span className="text-brand-primary">🐾</span> PAWZZ
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/directory" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">Directory</Link>
            <Link href="/volunteer" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">Volunteer</Link>
            <Link href="/booking" className="text-gray-600 hover:text-brand-primary font-medium transition-colors">Booking</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-brand-primary overflow-hidden">
                <img src={user.profile.avatar} alt={user.profile.name} className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={logout}
                className="text-sm font-medium text-gray-500 hover:text-brand-dark"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="border-2 border-brand-primary text-brand-primary px-5 py-2 rounded-xl font-medium hover:bg-brand-bg transition-all active:scale-95"
            >
              Login with Google
            </button>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
