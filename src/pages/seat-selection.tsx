import React from 'react';
import { useRouter } from 'next/router';
import SeatSelectionPage from './SeatSelectionPage';

const SeatSelection = () => {
  const router = useRouter();
  const { 
    type, 
    itemId, 
    itemName, 
    aircraftType, 
    hotelType, 
    checkIn, 
    checkOut 
  } = router.query;

  // Default values for demo
  const selectionType = (type as string) || 'flight';
  const id = (itemId as string) || 'FL001';
  const name = (itemName as string) || (selectionType === 'flight' ? 'AI101 Delhi to Mumbai' : 'The Taj Mahal Palace');
  const aircraft = (aircraftType as string) || 'Boeing 737-800';
  const hotel = (hotelType as string) || 'luxury-hotel';

  const handleBack = () => {
    router.back();
  };

  const handleComplete = (selectionData) => {
    console.log('Selection completed:', selectionData);
    // In real app, proceed to payment or booking confirmation
    router.push('/booking-confirmation');
  };

  return (
    <SeatSelectionPage
      type={selectionType}
      itemId={id}
      itemName={name}
      aircraftType={aircraft}
      hotelType={hotel}
      checkIn={checkIn as string}
      checkOut={checkOut as string}
      onBack={handleBack}
      onComplete={handleComplete}
    />
  );
};

export default SeatSelection;