"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function ClinicDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'Vet Clinic')) {
       router.push('/');
    }
  }, [user, loading, router]);

  const fetchClinicData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/clinic/data`, { withCredentials: true });
      setData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch clinic data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicData();
  }, []);

  const toggleSlot = async (time: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/clinic/slots/toggle`, { 
        date: selectedDate,
        slotTime: time 
      }, { withCredentials: true });
      fetchClinicData(); 
    } catch (err) {
      alert("Failed to update slot");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-teal-900 font-bold uppercase tracking-[0.5em] animate-pulse">
      🔐 Syncing encrypted healthcare records...
    </div>
  );

  const listing = data?.listing;
  const bookings = data?.bookings || [];
  
  // Helper to get next 7 days for the calendar bar
  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split('T')[0];
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="text-amber-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Healthcare Partner Portal</div>
            <h1 className="text-5xl font-black text-teal-950 tracking-tighter">
              Welcome, <span className="text-teal-600">Dr. {user?.profile.name.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2">Managing <span className="text-teal-900 font-bold">{listing?.name || 'Your Clinic'}</span> listings and bookings.</p>
          </div>
          <div className="flex gap-4">
             <Button variant="outline" className="rounded-2xl px-8">Edit Listing</Button>
             <Button variant="primary" className="rounded-2xl px-8 shadow-cloud">Internal Reports</Button>
          </div>
        </div>

        {/* Real Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
           {[
             { label: 'Patient Bookings', value: bookings.length, trend: 'Registered slots', icon: '📅', color: 'bg-teal-50 text-teal-600' },
             { label: 'Network Points', value: listing?.telemetry?.rating || 4.5, trend: 'Reputation', icon: '⭐', color: 'bg-indigo-50 text-indigo-600' },
             { label: 'Total Visits', value: listing?.telemetry?.total_bookings || 0, trend: 'Lifetime', icon: '✅', color: 'bg-purple-50 text-purple-600' },
             { label: 'Exp. Level', value: (listing?.telemetry?.years_experience || 5) + 'Y', trend: 'Professional', icon: '🎓', color: 'bg-amber-50 text-amber-600' },
           ].map((stat, i) => (
             <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-cloud transition-all">
                <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-xl mb-6 shadow-sm`}>{stat.icon}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</div>
                <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                <div className="text-[10px] font-bold text-teal-500 mt-2">{stat.trend}</div>
             </div>
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Incoming Appointments */}
           <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-[3rem] shadow-cloud border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <h2 className="text-xl font-black text-teal-950">Active Bookings</h2>
                  <span className="text-xs font-bold text-teal-600 bg-white px-4 py-1.5 rounded-full shadow-sm">Real-time Data</span>
                </div>
                <div className="p-4">
                  {bookings.length === 0 ? (
                    <div className="p-20 text-center text-gray-400 italic font-bold">No appointments booked yet.</div>
                  ) : bookings.map((apt: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-[2rem] transition-all group">
                        <div className="flex items-center gap-4">
                          <img src={apt.petParent?.profile?.avatar} className="w-12 h-12 rounded-2xl shadow-sm border border-white" />
                          <div>
                              <div className="font-black text-gray-900">{apt.petInfo?.name || 'Pet'} <span className="text-gray-400 font-medium text-xs">({apt.petParent?.profile?.name})</span></div>
                              <div className="text-xs font-bold text-teal-600 mt-0.5">{apt.petInfo?.type || 'Consultation'}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-sm text-gray-900">{apt.slotTime}</div>
                          <div className={`text-[10px] font-black uppercase tracking-widest mt-1 ${apt.status === 'confirmed' ? 'text-teal-500' : 'text-amber-500'}`}>{apt.status}</div>
                        </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LIVE SLOT MANAGER */}
              <div className="bg-white rounded-[3rem] shadow-cloud border border-gray-100 p-10">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    <div>
                      <h2 className="text-2xl font-black text-teal-950 tracking-tighter">Live Slot Manager</h2>
                      <p className="text-sm text-gray-500 font-medium tracking-tight">Managing availability for {new Date(selectedDate).toLocaleDateString()}.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                       {next7Days.map((date) => (
                         <button
                           key={date}
                           onClick={() => setSelectedDate(date)}
                           className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                             selectedDate === date 
                             ? 'bg-teal-700 border-teal-700 text-white shadow-md' 
                             : 'bg-white border-gray-100 text-gray-400 hover:border-teal-500 hover:text-teal-500'
                           }`}
                         >
                           {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'].map((time, i) => {
                      const slotData = listing?.slots?.find((s: any) => s.date === selectedDate && s.time === time);
                      const isLocked = slotData ? slotData.isLocked : true; // Default locked if not mentioned in DB yet
                      const isBooked = slotData?.isBooked;

                      return (
                        <button 
                          key={i} 
                          onClick={() => !isBooked && toggleSlot(time)}
                          disabled={isBooked}
                          className={`p-6 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-2 group relative
                            ${isBooked ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-50' : 
                              isLocked ? 'bg-red-50 border-red-100 text-red-600 hover:bg-white' : 
                              'bg-white border-teal-50 hover:border-teal-500 text-teal-900'}`}
                        >
                           <span className="text-xs font-black">{time}</span>
                           <span className="text-[8px] font-black uppercase tracking-tighter opacity-60">
                              {isBooked ? '📋 Booked' : (isLocked ? '🔒 Locked' : '🔓 Unlock')}
                           </span>
                        </button>
                      );
                    })}
                 </div>
              </div>
           </div>

           {/* Sidebar Actions - COMPACT & RESPONSIVE */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-gradient-to-br from-teal-950 to-teal-800 p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
                 <div className="absolute -bottom-10 -right-4 text-9xl opacity-5 group-hover:scale-110 transition-all font-black">🏥</div>
                 <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-3 leading-tight tracking-tighter">Sync with <br/> Network Map</h3>
                    <p className="text-[10px] font-bold text-teal-300/80 mb-6 leading-relaxed">Enable real-time emergency pings from nearby rescue volunteers.</p>
                    <button 
                      onClick={async () => {
                        try {
                          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/sos/trigger`, {
                            type: 'CRITICAL',
                            message: `Emergency at ${listing?.name}`,
                            location: listing?.location?.coords
                          }, { withCredentials: true });
                          alert("🚨 SOS Broadcasted to nearby volunteers!");
                        } catch (err) {
                          alert("Failed to raise SOS. Please try again.");
                        }
                      }}
                      className="bg-teal-400 w-full py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest text-teal-950 hover:bg-teal-300 transition-all shadow-lg active:scale-95"
                    >
                       Activate SOS Channel
                    </button>
                 </div>
              </div>
              
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
                 <h4 className="font-black text-teal-950 mb-6 px-1 tracking-tight text-lg">Clinic Resources</h4>
                 <div className="grid grid-cols-1 gap-2">
                    {[
                      { name: 'Inventory Manager', icon: '📦' },
                      { name: 'Medical Forms', icon: '📝' },
                      { name: 'Community Chat', icon: '💬' },
                      { name: 'Legal Docs', icon: '⚖️' }
                    ].map((item, i) => (
                      <button key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-teal-50/50 transition-all border border-transparent hover:border-teal-100 group">
                         <div className="flex items-center gap-3">
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-sm font-bold text-gray-700 group-hover:text-teal-950">{item.name}</span>
                         </div>
                         <span className="text-gray-300 group-hover:translate-x-1 transition-all">→</span>
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
