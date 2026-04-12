"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { io } from 'socket.io-client';

const MapComponent = dynamic(() => import('@/components/map/MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-teal-50/50 animate-pulse flex items-center justify-center rounded-[2.5rem]">
      <div className="text-center">
        <div className="text-4xl mb-4">🌍</div>
        <div className="font-bold text-teal-900">Loading Map Intelligence...</div>
      </div>
    </div>
  )
});

export default function MapPage() {
  const [data, setData] = useState<{ listings: any[], volunteers: any[] }>({ listings: [], volunteers: [] });

  const fetchData = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/map`, {
        withCredentials: true
      });
      setData(res.data.data || { listings: [], volunteers: [] });
    } catch (err) {
      console.error("Map data fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen for real-time map updates
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001', {
      withCredentials: true
    });

    socket.on('new-user-approved', () => {
      console.log("🗺️ New provider approved. Updating map pins...");
      fetchData();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <section className="bg-gradient-to-b from-teal-50 to-white pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-800 text-xs font-black rounded-full mb-6 tracking-widest uppercase">
                Real-time Network
              </span>
              <h1 className="text-5xl md:text-6xl font-black text-teal-950 tracking-tighter leading-tight">
                Explore the <span className="text-teal-600 block md:inline">Safety Net</span>
              </h1>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-sm border border-teal-50">
                <span className="w-3 h-3 rounded-full bg-teal-700"></span>
                <span className="text-xs font-bold text-gray-600">Verified Clinics</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl shadow-sm border border-teal-50">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="text-xs font-bold text-gray-600">City Leads</span>
              </div>
            </div>
          </div>

          <div className="h-[70vh] w-full">
            <MapComponent listings={data.listings} volunteers={data.volunteers} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-teal-50">
              <h4 className="text-xl font-bold text-teal-950 mb-2">Global Support</h4>
              <p className="text-sm text-gray-500 font-medium">Connecting you to professionals anywhere, instantly.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-teal-50">
              <h4 className="text-xl font-bold text-teal-950 mb-2">Verified Only</h4>
              <p className="text-sm text-gray-500 font-medium">Only approved clinics and trustworthy volunteers appear here.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-teal-50">
              <h4 className="text-xl font-bold text-teal-950 mb-2">City Leads</h4>
              <p className="text-sm text-gray-500 font-medium">Specialized coordinators managing regional welfare ops.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
