# Google Reviews API Testing Guide

## Overview
This document provides instructions for testing the Google Reviews API and verifying that reviews display correctly in the frontend.

## Test Reviews Created
The test script has created 5 sample reviews:
1. John Smith - 5⭐
2. Sarah Johnson - 5⭐
3. Michael Chen - 4⭐
4. Emily Rodriguez - 5⭐
5. David Williams - 5⭐

## API Endpoints

### Public Endpoint (Get All Reviews)
- **URL**: `GET /api/google-reviews`
- **Authentication**: Not required
- **Response Format**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "reviewerName": "John Smith",
      "rating": 5,
      "reviewText": "Excellent service!...",
      "reviewUrl": "https://www.google.com/maps/place/shield+agency",
      "profileImage": "https://i.pravatar.cc/150?img=12",
      "publishedAt": "2025-11-19T05:23:42.550Z",
      "createdAt": "2025-11-19T05:23:45.896Z"
    }
  ]
}
```

### Admin Endpoints (Require Authentication)
- **Create**: `POST /api/admin/google-reviews`
- **Update**: `PUT /api/admin/google-reviews/:id`
- **Delete**: `DELETE /api/admin/google-reviews/:id`
- **Get All (Admin)**: `GET /api/admin/google-reviews`

## Testing Steps

### 1. Test Backend API
```bash
# Start the backend server
cd shieldAgenyWebsite/backend
npm start

# In another terminal, test the API
curl http://localhost:5001/api/google-reviews
```

### 2. Test Frontend Display
1. Start the frontend development server:
```bash
cd shieldAgenyWebsite/frontend
npm run dev
```

2. Open the browser and navigate to the homepage
3. Scroll down to the "Google Reviews" section
4. Verify that all 5 test reviews are displayed correctly

### 3. Check Browser Console
Open browser DevTools (F12) and check the console for:
- ✅ `Google reviews loaded: 5` - Success message
- ❌ Any error messages related to API calls

### 4. Verify Review Display
Each review should display:
- Reviewer name
- Star rating (visual stars)
- Review text
- Published date
- "View on Google" link (if reviewUrl is provided)

## Troubleshooting

### Issue: Reviews not displaying
1. **Check API endpoint**: Verify the backend server is running and accessible
2. **Check API URL**: Verify `VITE_API_URL` in frontend `.env` file
3. **Check CORS**: Ensure CORS is properly configured in backend
4. **Check Console**: Look for errors in browser console
5. **Check Network Tab**: Verify the API request is successful (status 200)

### Issue: API returns 404
- Verify the route is registered in `server.js`:
  ```javascript
  app.use('/api/google-reviews', googleReviewRoutes);
  ```

### Issue: API returns 503
- Check MongoDB connection
- Verify `MONGO_URI` is set correctly
- Check database connection status

### Issue: Reviews display but data is wrong
- Check the API response format matches the expected structure
- Verify the `GoogleReview` type definition in `types.ts`
- Check the component props and data mapping

## Test Scripts

### Create Test Reviews
```bash
cd shieldAgenyWebsite/backend
node scripts/testGoogleReviewsAPI.js
```

### Create Single Test Review
```bash
cd shieldAgenyWebsite/backend
node scripts/testGoogleReview.js
```

## Expected Behavior

1. **Homepage Load**: When the homepage loads, it should automatically fetch reviews from `/api/google-reviews`
2. **Loading State**: While loading, `reviewsLoading` should be `true`
3. **Display**: Once loaded, the `GoogleReviewsSection` component should render all reviews
4. **Empty State**: If no reviews exist, the section should not be displayed (returns `null`)

## API Response Validation

The frontend expects:
- `response.success === true`
- `response.data` is an array
- Each review has:
  - `_id` (string)
  - `reviewerName` (string)
  - `rating` (number, 1-5)
  - `reviewText` (string)
  - `reviewUrl` (optional string)
  - `profileImage` (optional string)
  - `publishedAt` (optional string/Date)
  - `createdAt` (string/Date)

## Frontend Components

- **HomePage.tsx**: Fetches reviews on mount using `googleReviewsAPI.getPublic()`
- **GoogleReviewsSection.tsx**: Displays the reviews in a responsive grid layout
- **api.ts**: Contains the `googleReviewsAPI` with `getPublic()` method

## Notes

- Reviews are sorted by `createdAt` in descending order (newest first)
- The component only displays if `reviews.length > 0`
- Reviews are displayed in a responsive grid (1 column on mobile, 2 on tablet, 3 on desktop)
- Each review card shows rating, name, date, text, and optional Google link

