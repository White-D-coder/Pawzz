"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  listingId: string;
  listingName: string;
}

export default function BookingModal({ isOpen, onClose, listingId, listingName }: BookingModalProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock available times since the backend GET /availability might not be wired fully yet.
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const getTodayString = () => new Date().toISOString().split('T')[0];

  const handleBooking = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/bookings`, {
        listingId,
        slotDate: date,
        slotTime: time
      }, { withCredentials: true });
      
      setStep(3); // Success step
    } catch (err: any) {
      if (err.response?.status === 409) {
        setError('SLOT_TAKEN: This slot was just booked. Please select another.');
      } else {
        setError(err.response?.data?.message || 'Failed to confirm booking.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const closeReset = () => {
    onClose();
    setTimeout(() => {
      setStep(1);
      setDate('');
      setTime('');
      setError(null);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeReset}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col"
          >
            <div className="bg-teal-50 p-6 border-b border-teal-100 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Book Appointment</h3>
                <p className="text-sm text-gray-500 mt-1">{listingName}</p>
              </div>
              <button onClick={closeReset} className="text-gray-400 hover:text-gray-900 transition-colors">
                ✕
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <h4 className="font-bold text-gray-900 mb-4">Step 1: Select Date</h4>
                  <input 
                    type="date" 
                    min={getTodayString()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-700 outline-none"
                  />
                  <div className="mt-6 flex justify-end">
                    <Button onClick={() => setStep(2)} disabled={!date}>Next Step</Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4">
                  <h4 className="font-bold text-gray-900 mb-4">Step 2: Select Time for {date}</h4>
                  <div className="grid grid-cols-3 gap-3">
                    {timeSlots.map(slot => (
                      <button
                        key={slot}
                        onClick={() => setTime(slot)}
                        className={`py-2 rounded-lg border-2 transition-all font-medium text-sm ${
                          time === slot 
                          ? 'bg-teal-700 border-teal-700 text-white shadow-md' 
                          : 'bg-transparent border-gray-200 text-gray-600 hover:border-teal-700 hover:text-teal-700'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <div className="mt-8 flex justify-between">
                    <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
                    <Button onClick={handleBooking} isLoading={isLoading} disabled={!time}>Confirm Booking</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="animate-in zoom-in text-center py-6">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                    ✓
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-500 mb-6">Your appointment for {date} at {time} is secured.</p>
                  <Button onClick={closeReset} className="w-full">Done</Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
