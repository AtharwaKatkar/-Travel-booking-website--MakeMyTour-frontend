# Review & Rating System

A comprehensive review and rating system for hotels and flights with advanced features including photo uploads, content moderation, helpful voting, and intelligent sorting.

## 🌟 Features

### Core Functionality
- **1-5 Star Ratings**: Intuitive star rating system with visual feedback
- **Detailed Reviews**: Rich text reviews with titles and comprehensive content
- **Photo Uploads**: Multiple photo support with drag-and-drop interface
- **Review Tags**: Automatic and manual tagging for better categorization
- **Verified Reviews**: Badge system for verified bookings

### Advanced Features
- **Helpful Voting**: Community-driven helpful/not helpful voting system
- **Reply System**: Official replies from hotels/airlines to reviews
- **Content Moderation**: Comprehensive flagging system with multiple report categories
- **Smart Sorting**: Sort by newest, oldest, rating, and most helpful
- **Advanced Filtering**: Filter by rating, verified status, photos, and more
- **Search Functionality**: Search through review content and tags

### User Experience
- **Responsive Design**: Optimized for all devices and screen sizes
- **Real-time Updates**: Live updates for votes and new reviews
- **Progressive Enhancement**: Works without JavaScript for basic functionality
- **Accessibility**: Full keyboard navigation and screen reader support

## 📁 File Structure

```
src/
├── api/
│   └── reviews.js                    # Mock API with comprehensive review data
├── components/Reviews/
│   ├── ReviewCard.jsx               # Individual review display component
│   ├── ReviewForm.jsx               # Review submission form
│   ├── ReviewSummary.jsx            # Rating statistics and overview
│   ├── ReviewFilters.jsx            # Sorting and filtering controls
│   └── FlagReviewModal.jsx          # Content moderation interface
├── pages/
│   ├── reviews.tsx                  # Main reviews page (Next.js route)
│   ├── reviews-demo.tsx             # Interactive demo page
│   ├── ReviewsPage.jsx              # Core reviews page component
│   └── api/
│       ├── reviews.ts               # Reviews API endpoint
│       └── reviews/
│           └── [reviewId]/
│               ├── vote.ts          # Voting API endpoint
│               └── flag.ts          # Flagging API endpoint
```

## 🎯 Key Components

### ReviewCard
Displays individual reviews with:
- User information and verification badges
- Star ratings and review content
- Photo galleries with lightbox functionality
- Helpful voting buttons
- Reply threads with official responses
- Flag/report functionality
- Expandable content for long reviews

### ReviewForm
Comprehensive review submission form featuring:
- Interactive star rating selector
- Rich text input with character limits
- Photo upload with drag-and-drop
- Tag suggestions based on item type
- Form validation and error handling
- Preview functionality

### ReviewSummary
Statistical overview including:
- Average rating with visual indicators
- Rating distribution charts
- Total review counts
- Positive/negative percentages
- Trend indicators

### ReviewFilters
Advanced filtering and sorting with:
- Multiple sort options (newest, helpful, rating)
- Rating range filters
- Verified review filters
- Photo filter options
- Search functionality
- Active filter display

### FlagReviewModal
Content moderation system with:
- Multiple flag categories
- Custom reason input
- User education about appropriate flagging
- Confirmation and feedback system

## 🛠 Technical Implementation

### Mock Data System
The review system uses sophisticated mock data that simulates real-world scenarios:

```javascript
// Sample review structure
{
  id: "rev_001",
  type: "hotel", // or "flight"
  itemId: "hotel_001",
  itemName: "The Taj Mahal Palace Mumbai",
  userId: "user_001",
  userName: "Rajesh Kumar",
  rating: 5,
  title: "Exceptional luxury experience",
  content: "Detailed review content...",
  photos: ["/path/to/photo1.jpg", "/path/to/photo2.jpg"],
  helpful: 24,
  notHelpful: 2,
  replies: [...],
  tags: ["luxury", "service", "location"],
  verified: true,
  createdAt: "2025-12-28T14:20:00Z",
  flagged: false
}
```

### API Endpoints

#### GET /api/reviews
Fetch reviews with filtering and pagination:
```javascript
// Query parameters
{
  type: "hotel" | "flight",
  itemId: "hotel_001",
  sortBy: "newest" | "oldest" | "highest" | "lowest" | "helpful",
  page: 1,
  limit: 10
}
```

#### POST /api/reviews
Submit a new review:
```javascript
// Request body
{
  type: "hotel",
  itemId: "hotel_001",
  itemName: "Hotel Name",
  rating: 5,
  title: "Review title",
  content: "Review content",
  photos: [...],
  tags: [...]
}
```

#### POST /api/reviews/[reviewId]/vote
Vote on review helpfulness:
```javascript
// Request body
{
  voteType: "helpful" | "not-helpful",
  userId: "user_123"
}
```

#### POST /api/reviews/[reviewId]/flag
Flag inappropriate content:
```javascript
// Request body
{
  reason: "inappropriate" | "fake" | "spam" | "other",
  userId: "user_123"
}
```

### State Management
The system uses React hooks for state management:
- `useState` for component-level state
- `useEffect` for data fetching and side effects
- Custom hooks for reusable logic

### Photo Upload System
- Drag-and-drop interface
- Multiple file selection
- Image validation (type, size)
- Preview functionality
- Progress indicators

## 🎨 UI/UX Features

### Visual Design
- Clean, modern interface
- Consistent color scheme
- Intuitive iconography
- Responsive grid layouts
- Smooth animations and transitions

### Interactive Elements
- Hover effects on interactive elements
- Loading states for async operations
- Error handling with user-friendly messages
- Success confirmations
- Progressive disclosure for complex features

### Accessibility
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## 📊 Sample Data

### Review Categories
- **Hotels**: Luxury, business, budget accommodations
- **Flights**: Domestic and international airlines
- **Verified Reviews**: Based on actual bookings
- **Photo Reviews**: Reviews with uploaded images

### Rating Distribution
Realistic distribution patterns:
- 5 stars: 45% (excellent experiences)
- 4 stars: 30% (good experiences)
- 3 stars: 15% (average experiences)
- 2 stars: 7% (poor experiences)
- 1 star: 3% (terrible experiences)

### Review Types
- **Detailed Reviews**: Comprehensive experiences (200+ words)
- **Quick Reviews**: Brief feedback (50-100 words)
- **Photo Reviews**: Visual-focused reviews
- **Critical Reviews**: Constructive negative feedback
- **Positive Reviews**: Highlighting excellent service

## 🚀 Usage Examples

### Basic Review Display
```jsx
import ReviewsPage from './ReviewsPage';

<ReviewsPage
  itemType="hotel"
  itemId="hotel_001"
  itemName="The Taj Mahal Palace Mumbai"
/>
```

### Custom Review Integration
```jsx
import { getReviews, submitReview } from '../api/reviews';

// Fetch reviews
const reviews = await getReviews('hotel', 'hotel_001', 'helpful');

// Submit new review
await submitReview({
  type: 'hotel',
  itemId: 'hotel_001',
  rating: 5,
  title: 'Amazing stay!',
  content: 'Detailed review...'
});
```

## 🔧 Configuration Options

### Sorting Options
- **Newest**: Most recent reviews first
- **Oldest**: Oldest reviews first
- **Highest Rating**: 5-star reviews first
- **Lowest Rating**: 1-star reviews first
- **Most Helpful**: Community-voted helpful reviews

### Filter Options
- **Rating Range**: Filter by minimum rating
- **Verified Only**: Show only verified bookings
- **With Photos**: Reviews containing images
- **Recent**: Reviews from last 30 days
- **Detailed**: Reviews over 100 words

### Moderation Categories
- **Inappropriate Content**: Offensive language or material
- **Fake Review**: Suspected fake or spam reviews
- **Irrelevant Content**: Off-topic or unrelated content
- **Personal Information**: Privacy violations
- **Duplicate Review**: Repeated content
- **Promotional Content**: Advertising or spam

## 📱 Mobile Experience

### Responsive Design
- Touch-friendly interface
- Optimized for small screens
- Swipe gestures for photo galleries
- Collapsible sections for better navigation

### Performance Optimization
- Lazy loading for images
- Pagination for large datasets
- Optimized bundle sizes
- Progressive image loading

## 🔮 Future Enhancements

### Advanced Features
- **AI-Powered Insights**: Sentiment analysis and topic extraction
- **Review Verification**: Enhanced verification through booking integration
- **Multi-language Support**: Automatic translation capabilities
- **Video Reviews**: Support for video testimonials
- **Review Analytics**: Detailed analytics for businesses

### Integration Possibilities
- **Booking System**: Direct integration with reservation system
- **CRM Integration**: Customer relationship management
- **Social Media**: Share reviews on social platforms
- **Email Notifications**: Review alerts and summaries
- **API Access**: Third-party integration capabilities

## 🐛 Known Limitations

### Current Constraints
- **Mock Data**: Uses simulated review data
- **Photo Storage**: Photos are not actually stored
- **User Authentication**: Simplified user system
- **Real-time Updates**: Simulated real-time functionality
- **Moderation**: Automated moderation not implemented

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- JavaScript required for full functionality
- Progressive enhancement for basic features

## 📞 Support & Troubleshooting

### Common Issues
1. **Reviews not loading**: Check network connection and API endpoints
2. **Photo upload failing**: Verify file size and format requirements
3. **Voting not working**: Ensure user authentication
4. **Search not returning results**: Check search query formatting

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('reviewsDebug', 'true');
```

## 🎯 Testing Scenarios

### User Flows to Test
1. **Submit Review**: Complete review submission process
2. **Vote on Reviews**: Test helpful/not helpful voting
3. **Flag Content**: Report inappropriate reviews
4. **Filter Reviews**: Use various sorting and filtering options
5. **Photo Upload**: Test image upload functionality
6. **Reply System**: Test official reply functionality

### Test Data
Use the provided sample data to test various scenarios:
- High-rated luxury hotel reviews
- Mixed airline experience reviews
- Reviews with photos and without
- Flagged and moderated content examples

---

**Note**: This is a demonstration system using mock data. In production, integrate with real databases, authentication systems, and content moderation services.