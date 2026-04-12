import React from 'react';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen z-50 fixed inset-0 overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white min-h-screen p-4 flex flex-col pt-6 z-10">
        <div className="mb-10 px-2">
          <Link href="/" className="text-2xl font-extrabold text-teal-500 flex items-center gap-2">
            <span className="text-white text-3xl">🐾</span> PAWZZ Admin
          </Link>
        </div>
        
        <nav className="flex-1 space-y-2">
          <Link href="/admin/analytics" className="block px-4 py-3 bg-transparent rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            Analytics & Stats
          </Link>
          <Link href="/admin/users" className="block px-4 py-3 bg-transparent rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            Manage Users
          </Link>
          <Link href="/admin/bookings" className="block px-4 py-3 bg-transparent rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            Bookings & Slots
          </Link>
          <Link href="/admin/volunteers" className="block px-4 py-3 bg-transparent rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            Volunteer Reviews
          </Link>
          <Link href="/admin/approve" className="block px-4 py-3 bg-transparent rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
            Listing Approvals
          </Link>
        </nav>
        
        <div className="pt-4 border-t border-gray-800 mt-auto">
          <Link href="/" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-400 hover:text-white transition-colors">
            ← Back to Public Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50 p-8 overflow-y-auto z-0 h-screen">
        {children}
      </main>
    </div>
  );
}
