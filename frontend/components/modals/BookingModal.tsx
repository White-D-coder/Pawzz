"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import Script from 'next/script';

interface Slot {
  time: string;
  isLocked: boolean;
  isBooked: boolean;
}

interface Listing {
  _id: string;
  price: number;
  slots?: Slot[];
}

interface ListingResponse {
  data: {
    listing: Listing;
  };
}

interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

interface OrderResponse {
  data: {
    order: RazorpayOrder;
  };
}

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

  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [listingPrice, setListingPrice] = useState(0);

  React.useEffect(() => {
    if (isOpen && listingId) {
      axios.get<ListingResponse>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/listings/${listingId}`)
        .then(res => {
          if (res.data?.data?.listing) {
            const l = res.data.data.listing;
            setListingPrice(l.price || 500);
            if (l.slots) {
              const available = l.slots.filter((s) => !s.isLocked && !s.isBooked).map((s) => s.time);
              setTimeSlots(available);
            }
          }
        })
        .catch(err => console.error("Could not load clinic slots:", err));
    }
  }, [isOpen, listingId]);

  const getTodayString = () => new Date().toISOString().split('T')[0];

  const handleBooking = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Create Razorpay Order
      const orderRes = await axios.post<OrderResponse>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/payment/orders`, {
        amount: listingPrice,
        receipt: `rcpt_${listingId.slice(-4)}`
      }, { withCredentials: true });

      if (!orderRes.data?.data?.order) {
        throw new Error('Failed to create payment order');
      }

      const orderData = orderRes.data.data.order;

      // 2. Open Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock_id',
        amount: orderData.amount,
        currency: orderData.currency,
        name: "PAWZZ",
        description: `Booking charge for ${listingName}`,
        order_id: orderData.id,
        handler: async (response: any) => {
          // 3. Confirm Booking
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/bookings`, {
            listingId,
            slotDate: date,
            slotTime: time,
            paymentId: response.razorpay_payment_id
          }, { withCredentials: true });
          setStep(4);
        },
        prefill: {
          name: user?.profile.name,
          email: user?.email
        },
        theme: { color: "#0D9488" }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Transaction failed. Please try again.');
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

  const stepVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <AnimatePresence>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeReset}
            className="absolute inset-0 bg-teal-950/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[2.5rem] shadow-cloud w-full max-w-lg relative z-10 overflow-hidden flex flex-col border border-teal-50"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-50 to-white px-8 py-8 border-b border-teal-100 flex justify-between items-center relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-teal-600" />
              <div>
                <h3 className="text-2xl font-black text-teal-950 tracking-tighter">Book Appointment</h3>
                <p className="text-sm text-teal-700 font-bold opacity-80 mt-1">📍 {listingName}</p>
              </div>
              <button onClick={closeReset} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-teal-50 text-gray-400 hover:text-teal-900 transition-colors">
                ✕
              </button>
            </div>

            <div className="p-8 min-h-[300px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-xs font-bold shadow-inner"
                  >
                    {error}
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div 
                    key="step1"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-xs font-black text-teal-950 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-[10px]">1</span>
                        Pick a Date
                      </h4>
                      <input 
                        type="date" 
                        min={getTodayString()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-teal-700 focus:bg-white rounded-2xl outline-none transition-all font-bold text-gray-800"
                      />
                    </div>
                    <div className="pt-4 flex justify-end">
                      <Button size="lg" className="px-10 h-14 rounded-2xl" onClick={() => setStep(2)} disabled={!date}>Next Step</Button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div>
                      <h4 className="text-xs font-black text-teal-950 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-[10px]">2</span>
                        Pick a Time for {new Date(date).toLocaleDateString()}
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {timeSlots.map(slot => (
                          <button
                            key={slot}
                            onClick={() => setTime(slot)}
                            className={`py-3 rounded-2xl border-2 transition-all font-black text-sm tracking-tight ${
                              time === slot 
                              ? 'bg-teal-700 border-teal-700 text-white shadow-md scale-105' 
                              : 'bg-white border-gray-100 text-gray-500 hover:border-teal-700 hover:text-teal-700 shadow-sm'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 flex justify-between gap-4">
                      <Button variant="secondary" className="flex-1 h-14 rounded-2xl" onClick={() => setStep(1)}>Back</Button>
                      <Button className="flex-1 h-14 rounded-2xl" onClick={() => setStep(3)} disabled={!time}>Summary</Button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    variants={stepVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="space-y-6"
                  >
                    <div className="bg-amber-50/50 p-6 rounded-[2rem] border-2 border-dashed border-amber-200">
                      <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-4">Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-bold">Facility</span>
                          <span className="text-teal-950 font-black">{listingName}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-bold">Date</span>
                          <span className="text-teal-950 font-black">{new Date(date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-bold">Time Slot</span>
                          <span className="text-teal-950 font-black">{time}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-[10px] text-gray-400 font-bold text-center px-6 leading-relaxed">
                      By confirming, you agree to follow the facility's safety guidelines. A confirmation email will be sent to <span className="text-teal-700 font-black underline">{user?.email}</span>.
                    </p>

                    <div className="pt-2 flex justify-between gap-4">
                      <Button variant="secondary" className="flex-1 h-14 rounded-2xl" onClick={() => setStep(2)}>Back</Button>
                      <Button className="flex-1 h-14 rounded-2xl shadow-cloud" onClick={handleBooking} isLoading={isLoading}>Confirm Booking</Button>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div 
                    key="step4"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 shadow-sm">🐾</div>
                    <h3 className="text-3xl font-black text-teal-950 mb-3 tracking-tighter">Spot Secured!</h3>
                    <p className="text-gray-500 mb-8 font-medium">Your appointment at <span className="text-teal-700 font-bold">{listingName}</span> is confirmed for {time}.</p>
                    <Button onClick={closeReset} className="w-full h-14 rounded-2xl shadow-sm">Wonderful!</Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
