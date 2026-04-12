"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function MyBookingsPage() {
  const { user, openAuthModal } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/bookings/my`, {
          withCredentials: true
        });
        setBookings(res.data.data.bookings || []);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 flex justify-center items-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-teal-900 font-bold">Fetching your appointments...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 flex justify-center items-center px-4">
        <Card className="max-w-md p-10 text-center rounded-[3rem] shadow-cloud border-4 border-teal-50">
          <div className="text-6xl mb-6">🔒</div>
          <h2 className="text-3xl font-black text-teal-900 mb-4">Auth Required</h2>
          <p className="text-gray-500 font-medium mb-8">Please sign in to view and manage your pet care appointments.</p>
          <Button onClick={openAuthModal} className="w-full h-14 rounded-2xl">Sign In Now</Button>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-32 pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-800 text-xs font-black rounded-full mb-6 tracking-widest uppercase shadow-sm">
            Service History
          </span>
          <h1 className="text-5xl md:text-6xl font-black text-teal-950 tracking-tighter leading-tight">
            My <span className="text-teal-600">Bookings</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium mt-4">Manage your upcoming visits and review past pet care sessions.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-[3rem] shadow-sm border border-teal-50 p-20 text-center">
            <div className="text-8xl mb-8 opacity-20 rotate-12 inline-block">📅</div>
            <h3 className="text-2xl font-black text-teal-950">No bookings yet</h3>
            <p className="text-gray-500 mt-4 font-medium max-w-sm mx-auto mb-8">You haven't scheduled any care sessions yet. Find the perfect vet or helper in our directory!</p>
            <Button onClick={() => window.location.href = '/directory'} className="px-10 h-14 rounded-2xl">Explore Directory</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full bg-white rounded-[2.5rem] shadow-sm hover:shadow-cloud transition-all border border-teal-50 overflow-hidden flex flex-col">
                    <div className="bg-teal-950 p-6 text-white flex justify-between items-center">
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-1">Appointment ID</div>
                        <div className="font-mono text-xs opacity-60">#{booking._id.slice(-8).toUpperCase()}</div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        booking.status === 'confirmed' ? 'bg-teal-500 text-white' : 
                        booking.status === 'pending' ? 'bg-amber-400 text-teal-950' : 
                        'bg-gray-200 text-gray-500'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                    
                    <div className="p-8 flex-grow">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-white">
                          🐾
                        </div>
                        <div>
                          <h4 className="font-bold text-teal-950 leading-tight">Pet Care Session</h4>
                          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Confirmed with Provider</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-gray-600">
                          <span className="text-xl">📅</span>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date</div>
                            <div className="font-bold text-teal-900">{new Date(booking.time_slot).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-600">
                          <span className="text-xl">⏰</span>
                          <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Time Slot</div>
                            <div className="font-bold text-teal-900">{new Date(booking.time_slot).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-8 pt-0 mt-auto">
                      <Button variant="secondary" className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest" disabled>
                        Manage Booking
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </main>
  );
}
