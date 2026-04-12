"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import axios from 'axios';

export default function NGODashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNGOData = async () => {
    try {
      const [resData, resMissions] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/ngo/data`, { withCredentials: true }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/missions`, { withCredentials: true })
      ]);
      setData(resData.data.data);
      setMissions(resMissions.data.data.missions);
    } catch (err) {
      console.error("Failed to fetch NGO data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDispatch = async () => {
    try {
      const newMission = {
        title: "Emergency Rescue",
        description: "Reported injured animal at station road",
        priority: "high",
        location: { address: "Mumbai Central Station", city: "Mumbai", coords: { type: "Point", coordinates: [72.82, 18.97] } }
      };
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/missions`, newMission, { withCredentials: true });
      fetchNGOData();
      alert("🚀 Rescue mission launched & volunteers notified!");
    } catch (err) {
      alert("Failed to dispatch team.");
    }
  };

  useEffect(() => {
    fetchNGOData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black animate-pulse text-teal-900 uppercase tracking-widest">Identifying NGO Administrator...</div>;

  if (!user || user.role !== 'NGO' || !user.isApproved) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-cloud max-w-2xl border border-gray-100">
           <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-sm rotate-12">🛡️</div>
           <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter uppercase italic">Access <span className="text-purple-600">Restricted</span></h1>
           <p className="text-gray-500 font-bold leading-relaxed mb-8">
              Hello {user?.profile.name}! Your NGO administrative account is currently being vetted by the PAWZZ ethics board. 
              We are verifying your non-profit registration to maintain the community's trust.
           </p>
           <div className="flex flex-col gap-3">
              <div className="bg-purple-50 text-purple-700 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-purple-100 shadow-sm">
                 Status: NGO Credential Verification In-Progress
              </div>
              <a href="/" className="text-teal-600 font-black uppercase text-[10px] tracking-widest hover:underline mt-6">Return to safety hub</a>
           </div>
        </div>
      </div>
    );
  }

  const listing = data?.listing;
  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-6 sm:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <div className="text-amber-600 font-black text-[10px] uppercase tracking-[0.3em] mb-2">Non-Profit Management Hub</div>
            <h1 className="text-5xl font-black text-teal-950 tracking-tighter">
              Admin, <span className="text-teal-600 truncate">{user?.profile.name.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-500 font-medium mt-2">Managing <span className="text-teal-900 font-bold">{listing?.name || 'Your Rescue Team'}</span> missions.</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
             <Button variant="outline" className="flex-1 md:flex-none rounded-2xl px-8 h-12">Update Shelter</Button>
             <Button 
                onClick={handleDispatch}
                variant="primary" 
                className="flex-1 md:flex-none rounded-2xl px-8 h-12 shadow-cloud bg-purple-600 hover:bg-purple-700 border-none"
             >
                Dispatch Team
             </Button>
          </div>
        </div>

        {/* Live Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Rescues', value: stats?.totalRescues || missions.length, icon: '🚑', bg: 'bg-emerald-50 text-emerald-600' },
            { label: 'Active Volunteers', value: stats?.activeVolunteers || 0, icon: '🤝', bg: 'bg-indigo-50 text-indigo-600' },
            { label: 'Shelter Capacity', value: stats?.shelterCapacity || '0%', icon: '🏠', bg: 'bg-amber-50 text-amber-600' },
            { label: 'Funding Goal', value: stats?.fundingGoal || '0%', icon: '💰', bg: 'bg-purple-50 text-purple-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 group hover:shadow-cloud transition-all">
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center text-xl mb-6 shadow-sm`}>{stat.icon}</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</div>
                <div className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Rescue Missions */}
           <div className="lg:col-span-8 space-y-8">
              <div className="bg-white rounded-[3rem] shadow-cloud border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                  <h2 className="text-xl font-black text-teal-950 tracking-tight">Active Rescue Missions</h2>
                  <span className="text-xs font-bold text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full">{missions.length} Missions</span>
                </div>
                <div className="p-6">
                  {missions.length === 0 ? (
                    <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest">No active missions. Dispatch a team now!</div>
                  ) : (
                    missions.map((mission, i) => (
                      <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:bg-gray-50 rounded-[2rem] transition-all gap-4 mb-2">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-teal-950 rounded-2xl flex items-center justify-center text-2xl shadow-lg saturate-150">🚑</div>
                            <div>
                                <div className="font-black text-gray-900 tracking-tight">{mission.title}</div>
                                <div className="text-xs font-bold text-teal-600 flex items-center gap-1">📍 {mission.location.address}</div>
                            </div>
                          </div>
                          <div className="flex flex-row md:flex-col justify-between items-center md:items-end">
                            <div className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${mission.status === 'active' ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-green-50 border-green-200 text-green-600'}`}>{mission.status}</div>
                            <div className="text-[10px] font-bold text-gray-400 mt-2">{new Date(mission.createdAt).toLocaleTimeString()}</div>
                          </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
           </div>

           {/* NGO Specific Tools */}
                       <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-[90%] bg-purple-400 rounded-full" />
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-xs font-bold mb-2">
                          <span className="opacity-60 uppercase">Cat Cages</span>
                          <span>4/10</span>
                       </div>
                       <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-[40%] bg-white rounded-full" />
                       </div>
                    </div>
                 </div>
                 <Button className="w-full mt-10 bg-white text-purple-900 font-black rounded-2xl py-4 hover:bg-gray-100">Update Inventory</Button>
              </div>

              <div className="bg-amber-100 p-8 rounded-[3rem] border border-amber-200">
                 <h4 className="font-black text-amber-900 mb-2">Fundraising Status</h4>
                 <div className="text-3xl font-black text-amber-950 mb-4">₹42,500 <span className="text-xs font-bold opacity-40">/ 50k Goal</span></div>
                 <div className="text-[10px] font-bold text-amber-700 uppercase tracking-widest">Next Payout: Oct 20</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
