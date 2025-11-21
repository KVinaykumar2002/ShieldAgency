# Google Reviews API Routes

## Overview

A dedicated route file has been created for Google Reviews API endpoints at `/api/google-reviews`.

## Route Structure

### Public Routes (No Authentication Required)

#### GET `/api/google-reviews`
Get all Google reviews (publicly accessible)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "reviewerName": "John Doe",
      "rating": 5,
      "reviewText": "Excellent service!",
      "reviewUrl": "https://example.com/review",
      "profileImage": "https://example.com/image.jpg",
      "publishedAt": "2024-01-01T00:00:00.000Z",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Admin Routes (Authentication Required)

#### POST `/api/google-reviews`
Create a new Google review

**Request Body:**
```json
{
  "reviewerName": "John Doe",
  "rating": 5,
  "reviewText": "Excellent service!",
  "reviewUrl": "https://example.com/review",
  "profileImage": "https://example.com/image.jpg",
  "publishedAt": "2024-01-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "reviewerName": "John Doe",
    "rating": 5,
    "reviewText": "Excellent service!",
    ...
  }
}
```

#### PUT `/api/google-reviews/:id`
Update an existing Google review

**Request Body:**
```json
{
  "reviewerName": "Updated Name",
  "rating": 4,
  "reviewText": "Updated review text"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "reviewerName": "Updated Name",
    ...
  }
}
```

#### DELETE `/api/google-reviews/:id`
Delete a Google review

**Response:**
```json
{
  "success": true,
  "data": {}
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Review not found"
}
```

### 503 Service Unavailable
```json
{
  "success": false,
  "message": "Database connection unavailable. Please try again later."
}
```

## File Structure

```
backend/
├── routes/
│   └── googleReviewRoutes.js    # Dedicated route file
├── controllers/
│   └── googleReviewController.js
├── models/
│   └── googleReviewModel.js
└── tests/
    └── googleReviews.test.js     # Test file
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Notes

- The GET route is public and doesn't require authentication
- POST, PUT, and DELETE routes require admin authentication
- All routes include database connection checks
- Reviews are sorted by creation date (newest first)
- Rating must be between 1 and 5
- `reviewerName`, `rating`, and `reviewText` are required fields
- `reviewUrl`, `profileImage`, and `publishedAt` are optional fields

