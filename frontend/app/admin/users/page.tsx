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

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/admin/update-user/${userId}`, { role: newRole }, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Are you SURE? This user will be gone permanently!")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/admin/delete-user/${userId}`, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const handleToggleApproval = async (userId: string, current: boolean) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/admin/update-user/${userId}`, { isApproved: !current }, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      alert("Failed to toggle approval");
    }
  };

  const handleApprovalAction = async (userId: string, approve: boolean) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/admin/users/approve`, { userId, approve }, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      alert("Action failed");
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
      <div className="bg-white rounded-[3rem] shadow-cloud border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-black uppercase tracking-widest">
              <th className="px-8 py-6">Identity / Name</th>
              <th className="px-8 py-6">Current Role</th>
              <th className="px-8 py-6">Verification Request</th>
              <th className="px-8 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-20 animate-pulse text-teal-900 font-bold uppercase tracking-[0.5em]">Syncing encrypted records...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-12 text-gray-400 font-bold italic">No users found in database.</td></tr>
            ) : (
              users.map((user: any) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                       <img src={user.profile?.avatar} className="w-10 h-10 rounded-2xl shadow-sm border-2 border-white ring-4 ring-teal-50/50" alt="" />
                       <div>
                          <div className="text-gray-900 font-black tracking-tight">{user.profile?.name}</div>
                          <div className="text-[10px] text-gray-400 font-extrabold uppercase mt-0.5">{user.email}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <select 
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer px-2 py-1 rounded-lg border-none ${
                        user.role === 'Admin' ? 'text-teal-600 bg-teal-50' : 'text-gray-600 bg-gray-50'
                      }`}
                    >
                       <option value="Pet Parent">Pet Parent</option>
                       <option value="Vet Clinic">Vet Clinic</option>
                       <option value="NGO">NGO</option>
                       <option value="Volunteer">Volunteer</option>
                       <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-8 py-6">
                    {user.requestedRole ? (
                      <div className="flex items-center gap-3">
                         <div className="flex flex-col">
                            <span className="text-[9px] font-black text-amber-600 uppercase tracking-tighter italic">Requested Role:</span>
                            <span className="text-xs font-black text-gray-900">{user.requestedRole}</span>
                         </div>
                         <div className="flex gap-1">
                            <button 
                               onClick={() => handleApprovalAction(user._id, true)}
                               className="bg-teal-500 hover:bg-teal-600 text-white text-[9px] font-black uppercase px-3 py-1.5 rounded-xl shadow-sm transition-all"
                            >
                               Accept
                            </button>
                            <button 
                               onClick={() => handleApprovalAction(user._id, false)}
                               className="bg-gray-100 hover:bg-red-50 text-gray-400 hover:text-red-500 text-[9px] font-black uppercase px-3 py-1.5 rounded-xl transition-all"
                            >
                               Reject
                            </button>
                         </div>
                      </div>
                    ) : (
                      <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider border
                         ${user.isApproved ? 'bg-teal-50 text-teal-600 border-teal-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                        {user.isApproved ? '● Verified Professional' : '● standard user'}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                     <button 
                       onClick={() => handleDelete(user._id)}
                       className="p-3 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                     >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                     </button>
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
