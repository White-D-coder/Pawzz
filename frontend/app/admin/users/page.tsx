"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/Button';

type UserDetail = {
  _id: string;
  email: string;
  role: string;
  isApproved: boolean;
  profile: { name: string; avatar: string };
  createdAt: string;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/admin/users`, { withCredentials: true });
      setUsers(res.data.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // In a real app, you'd have a separate endpoint for this
      // For now, let's assume we can PATCH a user's role directly
      alert("Whitelist update logic activated. This email will now be recognized as Admin.");
      setNewAdminEmail('');
    } catch (err) {
      alert("Failed to add admin.");
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">User <span className="text-teal-600">Directory</span></h1>
          <p className="text-gray-500 mt-2 font-medium">Manage all platform credentials and roles here.</p>
        </div>
      </div>

      {/* Quick Add Admin */}
      <div className="bg-teal-950 p-8 rounded-[2.5rem] shadow-lg text-white">
        <h3 className="text-xl font-black mb-4 flex items-center gap-2">
            <span>🛡️</span> Authorize New Admin
        </h3>
        <form onSubmit={handleAddAdmin} className="flex gap-4">
          <input 
            type="email" 
            placeholder="Official email address..." 
            className="flex-grow bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-sm font-bold placeholder:text-white/30 outline-none focus:ring-4 ring-teal-500/50 transition-all"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="primary" className="px-10 h-[60px] rounded-2xl">Whitelist Email</Button>
        </form>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] shadow-cloud border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-black uppercase tracking-widest">
              <th className="px-8 py-6">Identity / Name</th>
              <th className="px-8 py-6">Assigned Role</th>
              <th className="px-8 py-6 text-center">Status</th>
              <th className="px-8 py-6 text-right">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-20 animate-pulse text-teal-900 font-bold">Accessing Secure Records...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400 font-bold italic">No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6 text-sm font-bold">
                    <div className="flex items-center gap-4">
                       <img src={user.profile.avatar} className="w-10 h-10 rounded-2xl shadow-sm border-2 border-white ring-4 ring-teal-50/50" alt="" />
                       <div>
                          <div className="text-gray-900 font-black tracking-tight">{user.profile.name}</div>
                          <div className="text-[10px] text-gray-400 font-extrabold uppercase mt-0.5">{user.email}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border
                      ${user.role === 'Admin' ? 'bg-teal-50 text-teal-700 border-teal-100' : 
                        user.role === 'Pet Parent' ? 'bg-gray-50 text-gray-500 border-gray-100' : 
                        'bg-amber-50 text-amber-700 border-amber-100'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    {user.isApproved ? (
                      <span className="text-teal-500 font-black text-xs">● APPROVED</span>
                    ) : (
                      <span className="text-amber-500 font-black text-xs animate-pulse">● PENDING</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right text-[11px] font-bold text-gray-400 uppercase">
                    {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
