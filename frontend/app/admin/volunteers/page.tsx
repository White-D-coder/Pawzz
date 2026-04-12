"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';

type VolunteerApplication = {
  _id: string;
  formData: {
    fullName: string;
    email: string;
    areaOfInterest: string;
  };
  audioFileId: string;
  transcript: string | null;
  status: string;
  createdAt: string;
};

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<VolunteerApplication | null>(null);

  const fetchVolunteers = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/admin/volunteers`, { withCredentials: true });
      setVolunteers(res.data.data.submissions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const handleAction = async (id: string, action: 'accept' | 'reject') => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/admin/volunteers/${id}`, { status: action === 'accept' ? 'accepted' : 'rejected' }, { withCredentials: true });
      setSelectedApp(null);
      fetchVolunteers();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Volunteer Applications</h1>
        <p className="text-gray-500 mt-2">Review pending candidate audio submissions and transcripts.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">Applicant Name</th>
              <th className="px-6 py-4 font-bold">Area</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td>
              </tr>
            ) : volunteers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">No applications found.</td>
              </tr>
            ) : (
              volunteers.map((v) => (
                <tr key={v._id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{v.formData.fullName}</div>
                    <div className="text-xs text-gray-500">{v.formData.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{v.formData.areaOfInterest}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{new Date(v.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      v.status === 'processing' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                      v.status === 'pending review' ? 'bg-amber-100 text-amber-800' :
                      v.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => setSelectedApp(v)}
                      className="text-teal-700 font-bold hover:text-teal-800 text-sm"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-4 lg:p-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="bg-white shadow-2xl w-full max-w-lg h-full lg:h-screen relative z-10 flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Review Application</h3>
                <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-900">✕</button>
              </div>

              <div className="p-8 flex-grow overflow-y-auto">
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Applicant Info</h4>
                  <div className="font-bold text-xl text-gray-900">{selectedApp.formData.fullName}</div>
                  <div className="text-gray-600 mb-1">{selectedApp.formData.email}</div>
                  <div className="text-teal-700 font-medium font-sm bg-teal-50 inline-block px-3 py-1 rounded-md mt-2">{selectedApp.formData.areaOfInterest}</div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Audio Submission</h4>
                  <audio 
                    controls 
                    className="w-full mb-4" 
                    src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/volunteers/audio/${selectedApp.audioFileId}`} 
                  />
                  
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">AI Transcript</h4>
                  <div className="bg-gray-100 p-4 rounded-xl text-gray-800 italic leading-relaxed min-h-[120px]">
                    {selectedApp.transcript || <span className="text-gray-400">Transcription is still processing...</span>}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-4">
                <button 
                  onClick={() => handleAction(selectedApp._id, 'reject')}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-sm transition-all active:scale-95 text-lg"
                >
                  Reject
                </button>
                <button 
                  onClick={() => handleAction(selectedApp._id, 'accept')}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl shadow-sm transition-all active:scale-95 text-lg"
                >
                  Accept
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
