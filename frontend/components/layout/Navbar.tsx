"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '../modals/AuthModal';
import { Button } from '@/components/ui/Button';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md shadow-sm z-50 px-4 md:px-8 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-2xl font-extrabold text-teal-800 flex items-center gap-1.5 tracking-tight">
            <span className="text-teal-700 text-3xl">🐾</span> PAWZZ
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/directory" className="text-gray-600 hover:text-teal-700 font-bold transition-colors border-b-2 border-transparent hover:border-amber-500 pb-1">Directory</Link>
            <Link href="/volunteer" className="text-gray-600 hover:text-teal-700 font-bold transition-colors border-b-2 border-transparent hover:border-amber-500 pb-1">Volunteer</Link>
            <Link href="/booking" className="text-gray-600 hover:text-teal-700 font-bold transition-colors border-b-2 border-transparent hover:border-amber-500 pb-1">Booking</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-teal-700 overflow-hidden shadow-sm">
                <img src={user.profile.avatar} alt={user.profile.name} className="w-full h-full object-cover" />
              </div>
              <button 
                onClick={logout}
                className="text-sm font-bold text-gray-600 hover:text-teal-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <Button 
              variant="secondary"
              onClick={() => setIsAuthModalOpen(true)}
              className="text-sm border-2"
            >
              Login with Google
            </Button>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Navbar;
