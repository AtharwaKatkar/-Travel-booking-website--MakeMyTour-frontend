import React from 'react';
import { useRouter } from 'next/router';
import ReviewsPage from './ReviewsPage';

const Reviews = () => {
  const router = useRouter();
  const { type, id, name } = router.query;

  // Default values for demo
  const itemType = (type as string) || 'hotel';
  const itemId = (id as string) || 'hotel_001';
  const itemName = (name as string) || 'The Taj Mahal Palace Mumbai';

  const handleBack = () => {
    router.back();
  };

  return (
    <ReviewsPage
      itemType={itemType}
      itemId={itemId}
      itemName={itemName}
      onBack={handleBack}
    />
  );
};

export default Reviews;