'use client';

import { useState, useEffect } from 'react';
import BookingModal from '@/components/BookingModal';
import ContactModal from '@/components/ContactModal';
import ExitIntentPopup from '@/components/ExitIntentPopup';

// Global modal triggers
export function openBookingModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-booking-modal'));
  }
}

export function openContactModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-contact-modal'));
  }
}

export default function GlobalModals() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  useEffect(() => {
    const handleOpenBooking = () => {
      setIsContactOpen(false);
      setIsBookingOpen(true);
    };

    const handleOpenContact = () => {
      setIsBookingOpen(false);
      setIsContactOpen(true);
    };

    window.addEventListener('open-booking-modal', handleOpenBooking);
    window.addEventListener('open-contact-modal', handleOpenContact);

    return () => {
      window.removeEventListener('open-booking-modal', handleOpenBooking);
      window.removeEventListener('open-contact-modal', handleOpenContact);
    };
  }, []);

  const hasOtherModalOpen = isBookingOpen || isContactOpen;

  return (
    <>
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
      <ExitIntentPopup hasOtherModalOpen={hasOtherModalOpen} />
    </>
  );
}
