# Google Reviews API Tests

This directory contains test files for the Google Reviews API endpoints.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure you have a test database configured. You can either:
   - Use a separate test MongoDB database
   - Use the same database (tests will clean up after themselves)
   - Set `MONGO_URI` in your environment variables

## Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode (for development):
```bash
npm run test:watch
```

Run tests with coverage report:
```bash
npm test -- --coverage
```

## Test Coverage

The tests cover:

### GET /api/google-reviews (Public Route)
- ✅ Getting all reviews
- ✅ Empty array when no reviews exist
- ✅ Database connection error handling
- ✅ Reviews sorted by creation date (newest first)

### POST /api/google-reviews (Admin Route)
- ✅ Creating a new review
- ✅ Required field validation
- ✅ Rating range validation (1-5)
- ✅ Handling optional fields

### PUT /api/google-reviews/:id (Admin Route)
- ✅ Updating an existing review
- ✅ 404 for non-existent reviews
- ✅ Invalid ID format handling

### DELETE /api/google-reviews/:id (Admin Route)
- ✅ Deleting a review
- ✅ 404 for non-existent reviews

### Edge Cases
- ✅ Special characters in review text
- ✅ Long review text
- ✅ Missing optional fields

## Test Structure

Each test file follows this structure:
1. Setup: Connect to test database
2. Before each test: Clean up test data
3. Test cases: Individual test scenarios
4. After all tests: Clean up and close connections

## Notes

- Tests automatically clean up test data after each test
- The test database connection is handled automatically
- If the database is unavailable, some tests will use mocks
- All tests are isolated and can run independently

