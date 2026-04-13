"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

const Navbar = () => {
  const { user, logout, openAuthModal } = useAuth();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* Status Banner for Pending Approvals */}
      {mounted && user && !user.isApproved && user.requestedRole && (
        <div className="fixed top-0 left-0 w-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-[0.2em] py-2 text-center z-[60] shadow-md animate-pulse">
          ⏳ Your request for {user.requestedRole} status is pending admin approval. Surfing as {user.role}.
        </div>
      )}

      <div className={`fixed ${mounted && user && !user.isApproved && user.requestedRole ? 'top-10' : 'top-6'} left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300`}>
        <nav className="h-20 glass rounded-[2rem] shadow-cloud px-6 md:px-10 flex items-center justify-between border-white/40 relative">
          {/* 1. Logo (Left) */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="text-2xl font-black text-teal-900 flex items-center gap-2 tracking-tighter">
              <span className="text-amber-500 text-3xl drop-shadow-sm">🐾</span> PAWZZ
            </Link>
          </div>

          {/* 2. Navigation Links (Center) */}
          <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            <Link href="/directory" className="text-gray-700 hover:text-teal-700 font-bold transition-all hover:scale-105">Directory</Link>
            <Link href="/volunteer" className="text-gray-700 hover:text-teal-700 font-bold transition-all hover:scale-105">{mounted ? 'Join Tribe' : 'Volunteer'}</Link>
            <Link href="/map" className="text-gray-700 hover:text-teal-700 font-bold transition-all hover:scale-105">Network Map</Link>

            {mounted && user && (
              <Link
                href={
                  user.role === 'Admin' ? '/admin/analytics' :
                    user.role === 'Vet Clinic' ? '/clinic' :
                      user.role === 'NGO' ? '/ngo' : '/volunteer-dashboard'
                }
                className="bg-teal-950 text-white px-5 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-lg active:scale-95"
              >
                {user.role === 'Admin' ? 'Admin Panel' : 'My Dashboard'}
              </Link>
            )}
          </div>

          {/* 3. Auth / Profile (Right) */}
          <div className="flex items-center gap-6 shrink-0">
            {user ? (
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-bold text-teal-900 leading-none mb-1">{user.profile.name}</span>
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest leading-none opacity-80">{user.role}</span>
                </div>
                <div className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm overflow-hidden ring-4 ring-teal-50 relative">
                  <Image 
                    src={user.profile.avatar} 
                    alt={user.profile.name} 
                    fill
                    className="object-cover"
                    unoptimized={true}
                  />
                </div>
                <button 
                  onClick={logout}
                  className="px-6 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all text-[10px] font-black uppercase tracking-widest shadow-sm"
                  title="Logout"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Button
                variant="secondary"
                onClick={openAuthModal}
                className="h-12 px-8 rounded-2xl"
              >
                Sign In
              </Button>
            )}
          </div>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
