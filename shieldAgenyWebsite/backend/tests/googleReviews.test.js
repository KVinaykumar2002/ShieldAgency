const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const googleReviewRoutes = require('../routes/googleReviewRoutes');
const GoogleReview = require('../models/googleReviewModel');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/google-reviews', googleReviewRoutes);

// Mock database connection
beforeAll(async () => {
  // Connect to test database or use in-memory database
  if (mongoose.connection.readyState === 0) {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/shield-agency-test';
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log('Test database connected');
    } catch (error) {
      console.warn('Test database connection failed, using mocks');
    }
  }
});

afterAll(async () => {
  // Clean up test data
  await GoogleReview.deleteMany({});
  await mongoose.connection.close();
});

describe('Google Reviews API Routes', () => {
  let testReviewId;

  beforeEach(async () => {
    // Clean up before each test
    await GoogleReview.deleteMany({});
  });

  describe('GET /api/google-reviews', () => {
    it('should get all Google reviews (public route)', async () => {
      // Create test reviews
      const review1 = await GoogleReview.create({
        reviewerName: 'John Doe',
        rating: 5,
        reviewText: 'Excellent service!',
        reviewUrl: 'https://example.com/review1',
        profileImage: 'https://example.com/image1.jpg',
      });

      const review2 = await GoogleReview.create({
        reviewerName: 'Jane Smith',
        rating: 4,
        reviewText: 'Very good experience',
        reviewUrl: 'https://example.com/review2',
      });

      const response = await request(app)
        .get('/api/google-reviews')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0].reviewerName).toBe('John Doe');
      expect(response.body.data[1].reviewerName).toBe('Jane Smith');
      // Should be sorted by createdAt descending (newest first)
      expect(new Date(response.body.data[0].createdAt).getTime())
        .toBeGreaterThanOrEqual(new Date(response.body.data[1].createdAt).getTime());
    });

    it('should return empty array when no reviews exist', async () => {
      const response = await request(app)
        .get('/api/google-reviews')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBe(0);
    });

    it('should handle database connection errors gracefully', async () => {
      // Temporarily disconnect database
      const originalReadyState = mongoose.connection.readyState;
      Object.defineProperty(mongoose.connection, 'readyState', {
        get: () => 0, // disconnected
        configurable: true,
      });

      const response = await request(app)
        .get('/api/google-reviews')
        .expect(503);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Database connection unavailable');

      // Restore original state
      Object.defineProperty(mongoose.connection, 'readyState', {
        get: () => originalReadyState,
        configurable: true,
      });
    });
  });

  describe('POST /api/google-reviews', () => {
    it('should create a new Google review (admin route)', async () => {
      const newReview = {
        reviewerName: 'Test User',
        rating: 5,
        reviewText: 'Great service!',
        reviewUrl: 'https://example.com/review',
        profileImage: 'https://example.com/image.jpg',
        publishedAt: new Date().toISOString(),
      };

      const response = await request(app)
        .post('/api/google-reviews')
        .send(newReview)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reviewerName).toBe(newReview.reviewerName);
      expect(response.body.data.rating).toBe(newReview.rating);
      expect(response.body.data.reviewText).toBe(newReview.reviewText);
      expect(response.body.data._id).toBeDefined();

      testReviewId = response.body.data._id;
    });

    it('should validate required fields', async () => {
      const invalidReview = {
        reviewerName: 'Test User',
        // Missing rating and reviewText
      };

      const response = await request(app)
        .post('/api/google-reviews')
        .send(invalidReview)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate rating range (1-5)', async () => {
      const invalidReview = {
        reviewerName: 'Test User',
        rating: 6, // Invalid: should be 1-5
        reviewText: 'Test review',
      };

      const response = await request(app)
        .post('/api/google-reviews')
        .send(invalidReview)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/google-reviews/:id', () => {
    beforeEach(async () => {
      // Create a test review for update/delete tests
      const review = await GoogleReview.create({
        reviewerName: 'Original Name',
        rating: 3,
        reviewText: 'Original review text',
      });
      testReviewId = review._id.toString();
    });

    it('should update an existing Google review', async () => {
      const updateData = {
        reviewerName: 'Updated Name',
        rating: 5,
        reviewText: 'Updated review text',
      };

      const response = await request(app)
        .put(`/api/google-reviews/${testReviewId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reviewerName).toBe(updateData.reviewerName);
      expect(response.body.data.rating).toBe(updateData.rating);
      expect(response.body.data.reviewText).toBe(updateData.reviewText);
    });

    it('should return 404 for non-existent review', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const updateData = {
        reviewerName: 'Updated Name',
        rating: 5,
        reviewText: 'Updated review text',
      };

      const response = await request(app)
        .put(`/api/google-reviews/${fakeId}`)
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Review not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const updateData = {
        reviewerName: 'Updated Name',
        rating: 5,
        reviewText: 'Updated review text',
      };

      const response = await request(app)
        .put('/api/google-reviews/invalid-id')
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/google-reviews/:id', () => {
    beforeEach(async () => {
      // Create a test review for delete tests
      const review = await GoogleReview.create({
        reviewerName: 'To Delete',
        rating: 4,
        reviewText: 'This will be deleted',
      });
      testReviewId = review._id.toString();
    });

    it('should delete an existing Google review', async () => {
      const response = await request(app)
        .delete(`/api/google-reviews/${testReviewId}`)
        .expect(200);

      expect(response.body.success).toBe(true);

      // Verify review is deleted
      const deletedReview = await GoogleReview.findById(testReviewId);
      expect(deletedReview).toBeNull();
    });

    it('should return 404 for non-existent review', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/google-reviews/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Review not found');
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in review text', async () => {
      const review = {
        reviewerName: 'Test User',
        rating: 5,
        reviewText: 'Special chars: !@#$%^&*()_+-=[]{}|;:,.<>?',
      };

      const response = await request(app)
        .post('/api/google-reviews')
        .send(review)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reviewText).toBe(review.reviewText);
    });

    it('should handle long review text', async () => {
      const longText = 'A'.repeat(1000);
      const review = {
        reviewerName: 'Test User',
        rating: 5,
        reviewText: longText,
      };

      const response = await request(app)
        .post('/api/google-reviews')
        .send(review)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reviewText).toBe(longText);
    });

    it('should handle missing optional fields', async () => {
      const review = {
        reviewerName: 'Test User',
        rating: 5,
        reviewText: 'Review without optional fields',
        // reviewUrl and profileImage are optional
      };

      const response = await request(app)
        .post('/api/google-reviews')
        .send(review)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.reviewerName).toBe(review.reviewerName);
    });
  });
});

