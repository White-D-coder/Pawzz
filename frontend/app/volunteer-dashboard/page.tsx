"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { io } from 'socket.io-client';
import { AnimatePresence, motion } from 'framer-motion';

export default function VolunteerDashboard() {
  const { user, loading } = useAuth();
  const [sosAlert, setSosAlert] = useState<any>(null);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-teal-900 uppercase tracking-widest">Identifying Tribe Member...</div>;

  if (!user || user.role !== 'Volunteer' || !user.isApproved) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-cloud max-w-2xl border border-gray-100">
           <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-sm rotate-6">🌟</div>
           <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">Access <span className="text-teal-600">Restricted</span></h1>
           <p className="text-gray-500 font-bold leading-relaxed mb-8">
              Welcome to the family, {user?.profile.name}! Your volunteer application is currently under review. 
              We'll notify you once our community leads verify your location and availability.
           </p>
           <div className="flex flex-col gap-3">
              <div className="bg-teal-50 text-teal-700 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-teal-100 shadow-sm">
                 Status: Joining the Circle of Hope
              </div>
              <a href="/" className="text-teal-600 font-black uppercase text-[10px] tracking-widest hover:underline mt-6">Return to home hub</a>
           </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001', {
      withCredentials: true
    });

    socket.emit('join-room', 'volunteers');

    socket.on('emergency-ping', (data) => {
      console.log("🚨 SOS RECEIVED:", data);
      setSosAlert(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-teal-50/30 pt-32 pb-20 px-6 sm:px-10">
      <AnimatePresence>
        {sosAlert && (
          <motion.div 
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-full max-w-md bg-red-600 rounded-[2rem] p-8 shadow-2xl text-white border-4 border-white"
          >
             <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl animate-bounce">🚨</div>
                <div>
                   <h3 className="text-xl font-black">CRITICAL SOS</h3>
                   <p className="text-xs font-bold text-red-100 uppercase tracking-widest">Nearby Emergency Detected</p>
                </div>
             </div>
             <p className="bg-red-700/50 p-4 rounded-2xl text-sm font-bold mb-6 border border-red-500/30">
                {sosAlert.message}
             </p>
             <div className="flex gap-4">
                <button 
                  onClick={() => setSosAlert(null)}
                  className="flex-1 py-3 bg-red-700 hover:bg-red-800 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                >
                  Ignore
                </button>
                <button 
                  onClick={() => {
                    alert("Proceeding to location!");
                    setSosAlert(null);
                  }}
                  className="flex-1 py-3 bg-white text-red-600 hover:bg-gray-100 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg active:scale-95"
                >
                  Accept Mission
                </button>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="max-w-6xl mx-auto">
        {/* Profile Card Overlay */}
        <div className="bg-white rounded-[3rem] shadow-cloud border border-white p-12 mb-12 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-20 bg-teal-500/5 rounded-full blur-3xl -mr-20 -mt-20" />
           
           <div className="relative">
              <img src={user?.profile.avatar} className="w-32 h-32 rounded-[2.5rem] shadow-lg border-4 border-white" alt="" />
              <div className="absolute -bottom-2 -right-2 bg-teal-500 text-white p-2 rounded-xl text-xs font-black shadow-lg">★ 4.8</div>
           </div>

           <div className="flex-grow text-center md:text-left">
              <div className="text-teal-600 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Tribe Member Profile</div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">{user?.profile.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <span className="text-xs font-bold text-gray-500 flex items-center gap-1">📍 Mumbai Lead</span>
                 <span className="text-xs font-bold text-gray-500 flex items-center gap-1">🕒 24h Availability</span>
                 <span className="text-xs font-bold text-teal-600 flex items-center gap-1 font-black">✓ Verified Volunteer</span>
              </div>
           </div>

           <div className="flex flex-col gap-3 min-w-[200px]">
              <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 text-center">
                 <div className="text-[10px] font-black text-teal-700 uppercase mb-1">Impact Score</div>
                 <div className="text-2xl font-black text-teal-900">842 XP</div>
              </div>
              <Button variant="primary" className="rounded-2xl py-4 font-black text-xs uppercase tracking-widest bg-teal-900 hover:bg-black border-none">Update Status</Button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* My Tasks */}
           <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                 <span className="bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">🎯</span> Assigned Tasks
              </h2>
              
              <div className="space-y-4">
                 {[
                   { title: 'Emergency Rescue: Injured Cat', loc: 'Bandra West', priority: 'High', deadline: 'In 3h' },
                   { title: 'Coordinate NGO Supplies', loc: 'Andheri East', priority: 'Medium', deadline: 'By Tonight' },
                 ].map((task, i) => (
                   <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:border-teal-200 transition-all group">
                      <div className="flex justify-between items-start mb-6">
                         <div>
                            <h3 className="text-lg font-black text-gray-900 group-hover:text-teal-700 transition-colors">{task.title}</h3>
                            <p className="text-sm font-bold text-gray-400 mt-1">{task.loc}</p>
                         </div>
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${task.priority === 'High' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-gray-50 text-gray-400'}`}>
                            {task.priority}
                         </span>
                      </div>
                      <div className="flex justify-between items-center bg-gray-50/50 p-4 rounded-2xl">
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Time Remaining: <span className="text-gray-900">{task.deadline}</span></div>
                         <button className="text-xs font-black text-teal-700 underline underline-offset-4">Open Details</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Network Activity */}
           <div className="space-y-6">
              <h2 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                 <span className="bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm">🚀</span> Tribe Activity
              </h2>
              
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
                 <div className="space-y-8">
                    {[
                      { user: 'Amit S.', action: 'marked task as COMPLETED', time: '12m ago' },
                      { user: 'Dr. Neha', action: 'posted a new URGENT rescue', time: '1h ago' },
                      { user: 'System', action: 'rewarded you 50 XP for weekly streak', time: '5h ago' },
                      { user: 'Team NGO', action: 'updated shelter availability', time: '1d ago' },
                    ].map((log, i) => (
                      <div key={i} className="flex gap-4 relative">
                         <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0 ring-4 ring-teal-50" />
                         {i < 3 && <div className="absolute left-[3.5px] top-6 w-[1px] h-10 bg-gray-100" />}
                         <div>
                            <div className="text-sm font-bold text-gray-700"><span className="text-teal-900 font-black">{log.user}</span> {log.action}</div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase mt-1">{log.time}</div>
                         </div>
                      </div>
                    ))}
                 </div>
                 <button className="w-full mt-10 py-4 bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all">Show Older Activity</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
