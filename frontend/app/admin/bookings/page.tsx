"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/Button';

type Booking = {
  _id: string;
  userId: { _id: string; email: string; profile: { name: string } };
  providerId: { _id: string; title: string; type: string };
  time_slot: string;
  status: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [timeSlots, setTimeSlots] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [bookingsRes, settingsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/admin/bookings`, { withCredentials: true }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/bookings/settings`, { withCredentials: true })
      ]);
      setBookings(bookingsRes.data.data.bookings || []);
      if (settingsRes.data.data.settings?.timeSlots) {
        setTimeSlots(settingsRes.data.data.settings.timeSlots.join(', '));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Real-time update polling (every 10 seconds)
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleUpdateSlots = async () => {
    try {
      const parsedSlots = timeSlots.split(',').map(s => s.trim()).filter(s => s);
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/admin/settings`, { timeSlots: parsedSlots }, { withCredentials: true });
      alert('Global slots updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update slots');
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Bookings & Slots</h1>
        <p className="text-gray-500 mt-2">Manage global booking slots and review incoming appointments.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-teal-950 mb-4">Manage Global Slots</h2>
          <p className="text-sm text-gray-500 mb-4">Define available time slots separated by commas. These will be visible on the public booking page.</p>
          <textarea 
            className="w-full p-4 border border-gray-200 rounded-xl mb-4 text-sm font-medium focus:outline-none focus:border-teal-500"
            rows={4}
            value={timeSlots}
            onChange={(e) => setTimeSlots(e.target.value)}
            placeholder="e.g. 09:00, 10:00, 11:30, 14:00"
          />
          <Button onClick={handleUpdateSlots} className="w-full rounded-xl">Save Slots</Button>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-teal-950">Recent Bookings</h2>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Clinic / NGO</th>
                <th className="px-6 py-4 font-bold">Date & Time</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">Loading...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8 text-gray-400">No bookings found.</td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{b.userId?.profile?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500">{b.userId?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-teal-800">{b.providerId?.title || 'Unknown Provider'}</div>
                      <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{b.providerId?.type}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {new Date(b.time_slot).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                        b.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
