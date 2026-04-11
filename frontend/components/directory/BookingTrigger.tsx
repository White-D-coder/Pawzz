"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import BookingModal from '@/components/modals/BookingModal';
import AuthModal from '@/components/modals/AuthModal';
import { useAuth } from '@/context/AuthContext';

interface BookingTriggerProps {
  listingId: string;
  listingName: string;
}

export default function BookingTrigger({ listingId, listingName }: BookingTriggerProps) {
  const { user } = useAuth();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleClick = () => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setIsBookingOpen(true);
    }
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleClick}>Book Now</Button>
      
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
        listingId={listingId}
        listingName={listingName}
      />
      
      {!user && (
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
        />
      )}
    </>
  );
}
