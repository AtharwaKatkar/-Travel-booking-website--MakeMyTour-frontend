# AI Recommendations - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Initialize Sample Data
```bash
# Start the development server
npm run dev

# Visit the recommendations page
http://localhost:3000/recommendations

# Click "Initialize Sample Data" if no recommendations appear
```

### 2. Try the Demo
Visit the interactive demo to see all features:
```
http://localhost:3000/recommendations-demo
```

### 3. Basic API Usage

#### Generate Recommendations
```javascript
import { recommendationsAPI } from '../api/recommendations';

const recommendations = await recommendationsAPI.generateRecommendations({
  userId: 'user123',
  count: 10,
  category: 'personalized' // or 'trending', 'deals', 'seasonal'
});
```

#### Track User Interactions
```javascript
await recommendationsAPI.trackInteraction({
  userId: 'user123',
  itemType: 'destination',
  itemId: 'bali_001',
  interactionType: 'view', // 'view', 'book', 'save', 'share'
  metadata: {
    destination: 'Bali',
    price: 45000,
    features: ['beach', 'culture']
  }
});
```

#### Submit Feedback
```javascript
await recommendationsAPI.submitFeedback({
  userId: 'user123',
  recommendationId: 'rec_001',
  feedbackType: 'like' // 'like', 'dislike', 'booked', 'saved'
});
```

## 🎯 Key Features Demo

### Personalized Recommendations
- Based on user travel history and preferences
- Shows "You liked beaches! Try Bali" style messages
- Confidence scores and matched preferences

### Collaborative Filtering
- "Users like you also enjoyed..." recommendations
- Shows similar user count and common preferences
- Cross-user learning for discovery

### Transparent AI
- "Why recommended?" tooltips on every suggestion
- Detailed explanations with confidence percentages
- Clear reasoning for each recommendation

### Feedback Loop
- Like/dislike buttons on each recommendation
- Automatic profile updates based on feedback
- Continuous learning from user behavior

## 🔧 Component Usage

### Basic Dashboard
```jsx
import RecommendationDashboard from '../components/Recommendations/RecommendationDashboard';

function MyPage() {
  return <RecommendationDashboard userId="user123" />;
}
```

### Individual Recommendation Card
```jsx
import RecommendationCard from '../components/Recommendations/RecommendationCard';

function MyComponent({ recommendation }) {
  const handleFeedback = async (feedback) => {
    await recommendationsAPI.submitFeedback(feedback);
  };

  const handleInteraction = async (interaction) => {
    await recommendationsAPI.trackInteraction(interaction);
  };

  return (
    <RecommendationCard
      recommendation={recommendation}
      onFeedback={handleFeedback}
      onInteraction={handleInteraction}
      showReasons={true}
    />
  );
}
```

## 📊 Analytics Dashboard

View system performance:
```javascript
const analytics = await recommendationsAPI.getAnalytics();
console.log(analytics.data);
// {
//   totalRecommendations: 150,
//   clickThroughRate: 12.5,
//   conversionRate: 3.2,
//   averageScore: 78.4,
//   categoryBreakdown: { personalized: 60, trending: 40, deals: 30, seasonal: 20 }
// }
```

## 🎨 Customization

### Filter Options
```javascript
const filters = {
  itemType: 'destination', // 'hotel', 'flight', 'package'
  priceRange: { min: 10000, max: 50000 },
  rating: 4.0,
  location: 'Bali',
  features: ['beach', 'luxury']
};

const recommendations = await recommendationsAPI.generateRecommendations({
  userId: 'user123',
  filters
});
```

### Custom Recommendation Categories
```javascript
// Available categories
const categories = [
  'personalized', // Based on user profile
  'trending',     // Popular destinations
  'deals',        // Price advantages
  'seasonal'      // Time-sensitive
];
```

## 🔍 Understanding Recommendations

### Recommendation Reasons
Each recommendation includes transparent explanations:

```javascript
const recommendation = {
  title: "Bali Beach Paradise",
  reasons: [
    {
      type: 'preference_match',
      description: 'Based on your interest in beach destinations',
      confidence: 0.9,
      details: {
        matchedPreferences: ['beach', 'international', 'culture']
      }
    }
  ]
};
```

### Reason Types
- **preference_match**: Matches user's explicit or learned preferences
- **collaborative**: Based on similar users' choices
- **trending**: Popular with high engagement
- **seasonal**: Best time to visit
- **price_match**: Significant discount or value
- **similar_users**: Liked by travelers with similar patterns

## 🚨 Troubleshooting

### No Recommendations Showing
1. Click "Initialize Sample Data" button
2. Check browser console for API errors
3. Verify MongoDB connection in `.env.local`

### Poor Recommendation Quality
1. Ensure user has interaction history
2. Try different categories (trending vs personalized)
3. Check if user profile was created properly

### API Errors
```javascript
try {
  const recommendations = await recommendationsAPI.generateRecommendations({
    userId: 'user123'
  });
} catch (error) {
  console.error('Recommendation error:', error);
  // Handle error appropriately
}
```

## 📱 Mobile Responsiveness

All components are fully responsive:
- Grid layout adapts to screen size
- Touch-friendly interaction buttons
- Optimized card layouts for mobile
- Swipe gestures for recommendation browsing

## 🔗 Navigation Integration

Add to your navigation:
```jsx
<nav>
  <Link href="/recommendations">AI Recommendations</Link>
  <Link href="/recommendations-demo">Try Demo</Link>
</nav>
```

## 🎯 Next Steps

1. **Explore the Demo**: Visit `/recommendations-demo` to see all features
2. **Customize Filters**: Try different filter combinations
3. **Test Feedback**: Like/dislike recommendations to see learning
4. **View Analytics**: Check the analytics panel for system insights
5. **Integration**: Add recommendation widgets to other pages

## 📚 Learn More

- **Full Documentation**: `AI_RECOMMENDATIONS_README.md`
- **Implementation Details**: `AI_RECOMMENDATIONS_IMPLEMENTATION_SUMMARY.md`
- **API Reference**: `/src/pages/api/recommendations.ts`
- **Component Source**: `/src/components/Recommendations/`

## 💡 Pro Tips

1. **User Onboarding**: Ask new users about travel preferences to bootstrap recommendations
2. **Feedback Incentives**: Encourage feedback with small rewards or gamification
3. **A/B Testing**: Test different explanation styles and recommendation counts
4. **Performance**: Cache recommendations for better user experience
5. **Privacy**: Always explain what data is being used and why