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

export default function AdminApprovePage() {
  const [listings, setListings] = useState<ListingApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/admin/listings/pending`, { withCredentials: true });
      setListings(res.data.data.listings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleApprove = async (id: string, status: string) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/admin/approve`, { listingId: id, status }, { withCredentials: true });
      fetchListings();
    } catch (err) {
      alert("Failed to update status.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Listing Approvals</h1>
        <p className="text-gray-500 mt-2">Approve or reject new clinics and NGOs joining the directory.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-bold">Provider Name</th>
              <th className="px-6 py-4 font-bold">Type</th>
              <th className="px-6 py-4 font-bold">Contact</th>
              <th className="px-6 py-4 font-bold">Location</th>
              <th className="px-6 py-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">Loading...</td>
              </tr>
            ) : listings.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-400">No pending listings found.</td>
              </tr>
            ) : (
              listings.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{item.name}</div>
                    <div className="text-xs text-gray-400">Joined {new Date(item.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div>{item.email}</div>
                    <div>{item.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.location?.city || item.location?.address}
                  </td>
                  <td className="px-6 py-4 flex items-center justify-center gap-2">
                    <Button variant="danger" size="sm" onClick={() => handleApprove(item._id, 'rejected')}>Reject</Button>
                    <Button variant="primary" size="sm" onClick={() => handleApprove(item._id, 'approved')}>Approve</Button>
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
