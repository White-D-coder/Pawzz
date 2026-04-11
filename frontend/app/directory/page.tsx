import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import BookingTrigger from '@/components/directory/BookingTrigger';

// SSR Fetch function
async function getListings(searchParams: any) {
  const query = new URLSearchParams(searchParams).toString();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}/api/listings?${query}`, {
    cache: 'no-store' // SEO-friendly but dynamic
  });
  if (!res.ok) return [];
  const json = await res.json();
  return json.data?.listings || [];
}

export default async function DirectoryPage({ searchParams }: { searchParams: any }) {
  const listings = await getListings(searchParams);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero & Search Console */}
      <section className="bg-teal-50 py-12 px-4 border-b border-teal-100">
        <div className="max-w-5xl mx-auto text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Find Trusted Pet Care</h1>
          <p className="text-lg text-gray-600">Discover verified clinics, NGOs, and service providers near you.</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4 max-w-5xl mx-auto">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-3.5 text-gray-400">📍</span>
            <input 
              type="text" 
              placeholder="Search by city or area..." 
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700 transition-shadow"
            />
          </div>
          <div className="w-full md:w-48">
            <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-700">
              <option value="">All Categories</option>
              <option value="Clinic">Vet Clinic</option>
              <option value="NGO">NGO Shelter</option>
            </select>
          </div>
          <Button variant="primary" className="py-3 px-8">Search</Button>
        </div>
      </section>

      {/* Listing Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12 w-full flex-grow">
        {listings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900">No providers found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing: any) => (
              <Card key={listing._id} className="flex flex-col h-full">
                <div className="h-48 w-full bg-gray-200 relative">
                  {/* Placeholder for actual image */}
                  <div className="absolute top-4 left-4 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {listing.type}
                  </div>
                </div>
                
                <div className="p-5 flex-grow">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{listing.name}</h3>
                  <p className="text-sm text-gray-500 mt-2 flex items-start gap-1">
                    <span>📍</span> {listing.location?.address || 'Location Hidden'}
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {listing.services?.slice(0, 3).map((service: string, i: number) => (
                      <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                        {service}
                      </span>
                    ))}
                    {listing.services?.length > 3 && (
                      <span className="text-xs text-teal-700 font-bold self-center">+{listing.services.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center mt-auto">
                  <div className="text-xs text-gray-400">
                    {listing.verified ? '✅ Verified Provider' : '⏳ Pending Review'}
                  </div>
                  <BookingTrigger listingId={listing._id} listingName={listing.name} />
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
