"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/Button';

type ListingApplication = {
  _id: string;
  name: string;
  type: string;
  location: { address: string; city: string };
  email: string;
  phone: string;
  verification_status: string;
  createdAt: string;
};

type UserApplication = {
  _id: string;
  email: string;
  requestedRole: string;
  profile: { name: string; avatar: string };
  createdAt: string;
};

export default function AdminApprovePage() {
  const [listings, setListings] = useState<ListingApplication[]>([]);
  const [users, setUsers] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
      
      const [listingsRes, usersRes] = await Promise.all([
        axios.get(`${apiUrl}/api/admin/listings/pending`, { withCredentials: true }),
        axios.get(`${apiUrl}/api/admin/users/pending`, { withCredentials: true })
      ]);

      setListings((listingsRes.data as any).data.listings || []);
      setUsers((usersRes.data as any).data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApproveListing = async (id: string, status: string) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/admin/approve`, { listingId: id, status }, { withCredentials: true });
      fetchData();
    } catch (err) {
      alert("Failed to update listing.");
    }
  };

  const handleApproveUser = async (userId: string, approve: boolean) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/admin/users/approve`, { userId, approve }, { withCredentials: true });
      fetchData();
    } catch (err) {
      alert("Failed to update user status.");
    }
  };

  return (
    <div className="space-y-12 pb-20">
      {/* 1. User Signups Section */}
      <section>
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">New Signups (Roles)</h1>
          <p className="text-gray-500 mt-2 font-medium">Approve users requesting specific roles (NGO, Clinic, etc.)</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-cloud border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                <th className="px-8 py-6">User / Email</th>
                <th className="px-8 py-6">Requested Role</th>
                <th className="px-8 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 ? (
                <tr><td colSpan={3} className="text-center py-12 text-gray-400 font-bold italic">No pending signups</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <img src={user.profile.avatar} className="w-8 h-8 rounded-full shadow-sm" alt="" />
                        <div>
                          <div className="font-bold text-gray-900">{user.profile.name}</div>
                          <div className="text-xs text-gray-500 font-medium">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border border-teal-100">
                        {user.requestedRole}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleApproveUser(user._id, false)}>Reject</Button>
                        <Button variant="primary" size="sm" onClick={() => handleApproveUser(user._id, true)}>Approve Full Access</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Listing Verification Section */}
      <section>
        <div className="mb-8 border-t border-gray-100 pt-12">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Directory Listings</h1>
          <p className="text-gray-500 mt-2 font-medium">Verify profiles and healthcare facility details.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-cloud border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-black uppercase tracking-widest">
                <th className="px-8 py-6">Provider Name</th>
                <th className="px-8 py-6">Type</th>
                <th className="px-8 py-6">Contact & Location</th>
                <th className="px-8 py-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {listings.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-12 text-gray-400 font-bold italic">No pending listings</td></tr>
              ) : (
                listings.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="font-bold text-gray-900">{item.name}</div>
                      <div className="text-[10px] text-gray-400 font-extrabold uppercase mt-1">Joined {new Date(item.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-amber-100">
                        {item.type}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-xs text-gray-600 font-bold">
                      <div className="mb-1 text-teal-800">{item.email}</div>
                      <div className="opacity-60">{item.location?.city || item.location?.address}</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleApproveListing(item._id, 'rejected')}>Reject</Button>
                        <Button variant="primary" size="sm" onClick={() => handleApproveListing(item._id, 'approved')}>Approve & Publish</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
