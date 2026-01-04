import React from 'react';
import Head from 'next/head';
import RecommendationDashboard from '../components/Recommendations/RecommendationDashboard';

const RecommendationsPage = () => {
  return (
    <>
      <Head>
        <title>AI Recommendations - MakeMyTrip Clone</title>
        <meta name="description" content="Get personalized travel recommendations powered by AI based on your preferences and behavior" />
        <meta name="keywords" content="AI recommendations, personalized travel, collaborative filtering, travel suggestions" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <RecommendationDashboard />
      </div>
    </>
  );
};

export default RecommendationsPage;