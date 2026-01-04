import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Sparkles, Brain, TrendingUp, Users, Target, BarChart3, Lightbulb } from 'lucide-react';
import RecommendationCard from '../components/Recommendations/RecommendationCard';
import { mockRecommendations, recommendationsAPI } from '../api/recommendations';

const RecommendationsDemoPage = () => {
  const [activeDemo, setActiveDemo] = useState('personalized');
  const [demoRecommendations, setDemoRecommendations] = useState([]);
  const [userProfile, setUserProfile] = useState({
    preferences: ['beach', 'luxury', 'international'],
    travelStyle: 'mid-range',
    previousBookings: ['Bali', 'Goa', 'Dubai']
  });

  const demoTypes = [
    {
      id: 'personalized',
      title: 'Personalized Recommendations',
      description: 'Based on your travel history and preferences',
      icon: Target,
      color: 'blue'
    },
    {
      id: 'collaborative',
      title: 'Collaborative Filtering',
      description: 'What similar users also liked',
      icon: Users,
      color: 'green'
    },
    {
      id: 'trending',
      title: 'Trending Destinations',
      description: 'Popular destinations right now',
      icon: TrendingUp,
      color: 'red'
    },
    {
      id: 'ai-insights',
      title: 'AI Insights',
      description: 'Smart recommendations with explanations',
      icon: Brain,
      color: 'purple'
    }
  ];

  useEffect(() => {
    loadDemoRecommendations();
  }, [activeDemo]);

  const loadDemoRecommendations = () => {
    let filteredRecs = [...mockRecommendations];
    
    switch (activeDemo) {
      case 'personalized':
        filteredRecs = filteredRecs.filter(rec => rec.category === 'personalized');
        break;
      case 'collaborative':
        filteredRecs = filteredRecs.map(rec => ({
          ...rec,
          reasons: [{
            type: 'collaborative',
            description: 'Users with similar preferences also liked this',
            confidence: 0.85,
            details: {
              similarUsers: Math.floor(Math.random() * 200) + 50,
              matchedPreferences: ['beach', 'luxury']
            }
          }]
        }));
        break;
      case 'trending':
        filteredRecs = filteredRecs.map(rec => ({
          ...rec,
          category: 'trending',
          reasons: [{
            type: 'trending',
            description: 'Trending destination with high demand',
            confidence: 0.9,
            details: {
              trendingScore: Math.floor(Math.random() * 50) + 70
            }
          }]
        }));
        break;
      case 'ai-insights':
        filteredRecs = filteredRecs.map(rec => ({
          ...rec,
          reasons: [
            {
              type: 'preference_match',
              description: `Perfect match for your ${userProfile.preferences.join(', ')} preferences`,
              confidence: 0.95,
              details: {
                matchedPreferences: userProfile.preferences
              }
            },
            {
              type: 'seasonal',
              description: 'Best time to visit based on weather and pricing',
              confidence: 0.8,
              details: {
                seasonalScore: 85
              }
            }
          ]
        }));
        break;
    }
    
    setDemoRecommendations(filteredRecs);
  };

  const handleFeedback = async (feedback) => {
    console.log('Demo feedback:', feedback);
    // In demo mode, just log the feedback
  };

  const handleInteraction = async (interaction) => {
    console.log('Demo interaction:', interaction);
    // In demo mode, just log the interaction
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-600 hover:bg-blue-700 text-white',
      green: 'bg-green-600 hover:bg-green-700 text-white',
      red: 'bg-red-600 hover:bg-red-700 text-white',
      purple: 'bg-purple-600 hover:bg-purple-700 text-white'
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      <Head>
        <title>AI Recommendations Demo - MakeMyTrip Clone</title>
        <meta name="description" content="Interactive demo of AI-powered travel recommendations with collaborative filtering and personalization" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Brain className="w-12 h-12 text-blue-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">
                AI Recommendations Demo
              </h1>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience how our AI-powered recommendation engine suggests personalized travel options 
              based on your preferences, behavior, and collaborative filtering
            </p>
          </div>

          {/* Demo Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                icon: Target,
                title: 'Personalized',
                description: 'Based on your travel history and preferences'
              },
              {
                icon: Users,
                title: 'Collaborative',
                description: 'Learn from similar travelers'
              },
              {
                icon: Lightbulb,
                title: 'Transparent',
                description: 'Clear explanations for every recommendation'
              },
              {
                icon: BarChart3,
                title: 'Data-Driven',
                description: 'Powered by machine learning algorithms'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <Icon className="w-8 h-8 text-blue-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* User Profile Simulation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Simulated User Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Preferences</h4>
                <div className="flex flex-wrap gap-2">
                  {userProfile.preferences.map((pref, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Travel Style</h4>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  {userProfile.travelStyle}
                </span>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Previous Bookings</h4>
                <div className="flex flex-wrap gap-2">
                  {userProfile.previousBookings.map((booking, index) => (
                    <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                      {booking}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Demo Type Selector */}
          <div className="flex flex-wrap gap-4 mb-8">
            {demoTypes.map((demo) => {
              const Icon = demo.icon;
              return (
                <button
                  key={demo.id}
                  onClick={() => setActiveDemo(demo.id)}
                  className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeDemo === demo.id
                      ? getColorClasses(demo.color)
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  <div className="text-left">
                    <div className="font-medium">{demo.title}</div>
                    <div className="text-sm opacity-90">{demo.description}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Algorithm Explanation */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-200">
            <div className="flex items-start">
              <Sparkles className="w-6 h-6 text-blue-600 mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  How {demoTypes.find(d => d.id === activeDemo)?.title} Works
                </h3>
                <div className="text-gray-700">
                  {activeDemo === 'personalized' && (
                    <p>
                      Our personalized recommendations analyze your travel history, search patterns, 
                      and explicit preferences to suggest destinations and accommodations that match 
                      your unique travel style. The algorithm considers factors like preferred price 
                      range, destination types, and booking behavior.
                    </p>
                  )}
                  {activeDemo === 'collaborative' && (
                    <p>
                      Collaborative filtering identifies users with similar travel preferences and 
                      behavior patterns. When we find travelers who have made similar bookings or 
                      searches, we recommend destinations and hotels that they enjoyed but you haven't 
                      discovered yet.
                    </p>
                  )}
                  {activeDemo === 'trending' && (
                    <p>
                      Trending recommendations surface destinations and accommodations that are 
                      experiencing high demand, positive reviews, and increased bookings. This helps 
                      you discover popular spots and take advantage of emerging travel trends.
                    </p>
                  )}
                  {activeDemo === 'ai-insights' && (
                    <p>
                      Our AI combines multiple recommendation strategies and provides transparent 
                      explanations for each suggestion. You'll see exactly why each recommendation 
                      was made, including preference matches, seasonal factors, and price advantages.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {demoRecommendations.map((recommendation, index) => (
              <RecommendationCard
                key={`${activeDemo}-${index}`}
                recommendation={recommendation}
                onFeedback={handleFeedback}
                onInteraction={handleInteraction}
                showReasons={true}
              />
            ))}
          </div>

          {/* Demo Features Explanation */}
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Key Features Demonstrated
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">🎯 Smart Recommendations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Personalized based on user preferences</li>
                  <li>• Collaborative filtering from similar users</li>
                  <li>• Trending destinations and deals</li>
                  <li>• Seasonal and contextual suggestions</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">🔍 Transparency</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• "Why recommended?" explanations</li>
                  <li>• Confidence scores for each suggestion</li>
                  <li>• Matched preferences highlighting</li>
                  <li>• Algorithm reasoning display</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">📊 Feedback Loop</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Like/dislike feedback collection</li>
                  <li>• Booking and interaction tracking</li>
                  <li>• Continuous learning from user behavior</li>
                  <li>• Profile refinement over time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">⚡ Real-time Updates</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Dynamic price and availability updates</li>
                  <li>• Fresh recommendations generation</li>
                  <li>• Trending destination detection</li>
                  <li>• Seasonal adjustment algorithms</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Experience Personalized Travel?
              </h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Try our full AI recommendations system with your own travel preferences 
                and discover destinations tailored just for you.
              </p>
              <a
                href="/recommendations"
                className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Try Full Recommendations
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecommendationsDemoPage;