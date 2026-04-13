"use client";

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import BookingModal from '@/components/modals/BookingModal';
import { useAuth } from '@/context/AuthContext';

interface DirectoryContainerProps {
  initialListings: any[];
}

export default function DirectoryContainer({ initialListings }: DirectoryContainerProps) {
  const { user, openAuthModal } = useAuth();
  const [selectedListing, setSelectedListing] = useState<{ id: string; name: string } | null>(null);

  const handleOpenBooking = (id: string, name: string) => {
    if (!user) {
      openAuthModal();
    } else {
      setSelectedListing({ id, name });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialListings.map((listing: any, index: number) => {
          const providerImages = [
            '/image/providers/doc1.jpeg',
            '/image/providers/doc2.jpeg',
            '/image/providers/doc3.jpeg',
            '/image/providers/doc4.jpeg',
            '/image/providers/doc5.jpeg',
            '/image/providers/doc6.jpeg',
          ];
          const fallbackImage = providerImages[index % providerImages.length];

          return (
            <Card key={listing._id} className="flex flex-col h-full hover:shadow-cloud transition-all duration-300 rounded-[2rem]">
              <div className="h-48 w-full relative overflow-hidden text-center justify-items-center">
                <img 
                  src={listing.imageUrl || fallbackImage} 
                  alt={listing.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-teal-800 text-[10px] font-black px-4 py-1.5 rounded-full shadow-sm uppercase tracking-widest border border-teal-100">
                  {listing.type}
                </div>
                {listing.price > 0 && (
                  <div className="absolute bottom-4 right-4 bg-teal-900 text-white text-xs font-black px-4 py-1.5 rounded-full shadow-lg">
                    ₹{listing.price}
                  </div>
                )}
              </div>
              
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 leading-tight">{listing.name}</h3>
                    {listing.telemetry?.years_experience && (
                      <div className="text-[10px] font-extrabold text-amber-600 uppercase mt-1">
                        {listing.telemetry.years_experience} Years Experience
                      </div>
                    )}
                  </div>
                  {listing.telemetry?.rating > 0 && (
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-black">
                      <span>⭐</span> {listing.telemetry.rating}
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-4">
                  <span className="text-teal-600">📍</span> {listing.location?.city || listing.location?.address || 'Location Hidden'}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {listing.services?.slice(0, 3).map((service: string, i: number) => (
                    <span key={i} className="bg-white text-teal-700 text-[10px] font-bold px-3 py-1 rounded-lg border border-teal-50 shadow-sm">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center mt-auto">
                <div className="flex flex-col gap-1">
                  <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                    {listing.verification_status === 'approved' ? '✅ Verified Provider' : '⏳ Pending Review'}
                  </div>
                  {listing.telemetry?.total_bookings > 0 && (
                    <div className="text-xs text-teal-700 font-bold flex items-center gap-1">
                      <span className="animate-pulse">🔥</span> {listing.telemetry.total_bookings}+ Bookings
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => handleOpenBooking(listing._id, listing.name)}
                  className="bg-teal-700 text-white rounded-full px-6 py-2 text-sm font-black shadow-sm hover:bg-teal-800 hover:shadow-cloud transition-all active:scale-95"
                >
                  Book Now
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      <BookingModal 
        isOpen={!!selectedListing} 
        onClose={() => setSelectedListing(null)} 
        listingId={selectedListing?.id || ''}
        listingName={selectedListing?.name || ''}
      />
    </>
  );
}
