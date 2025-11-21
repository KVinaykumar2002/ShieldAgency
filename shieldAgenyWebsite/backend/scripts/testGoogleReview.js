const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const GoogleReview = require('../models/googleReviewModel');

const testReview = {
    reviewerName: 'John Smith',
    rating: 5,
    reviewText: 'Excellent service! Shield Agency provided outstanding security services for our corporate event. The guards were professional, punctual, and very attentive. Highly recommended!',
    reviewUrl: 'https://www.google.com/maps/place/shield+agency',
    profileImage: 'https://i.pravatar.cc/150?img=12',
    publishedAt: new Date()
};

async function createTestReview() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('❌ MONGO_URI not found in environment variables');
            process.exit(1);
        }

        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Check if test review already exists
        const existingReview = await GoogleReview.findOne({ 
            reviewerName: testReview.reviewerName,
            reviewText: testReview.reviewText.substring(0, 50)
        });

        if (existingReview) {
            console.log('⚠️  Test review already exists. Updating it...');
            Object.assign(existingReview, testReview);
            await existingReview.save();
            console.log('✅ Test review updated successfully!');
            console.log('📝 Review ID:', existingReview._id);
        } else {
            // Create new test review
            const review = await GoogleReview.create(testReview);
            console.log('✅ Test review created successfully!');
            console.log('📝 Review ID:', review._id);
        }

        // Fetch and display all reviews
        const allReviews = await GoogleReview.find().sort({ createdAt: -1 });
        console.log(`\n📊 Total reviews in database: ${allReviews.length}`);
        console.log('\n📋 All Reviews:');
        allReviews.forEach((review, index) => {
            console.log(`\n${index + 1}. ${review.reviewerName} - ${review.rating}⭐`);
            console.log(`   "${review.reviewText.substring(0, 60)}..."`);
            console.log(`   ID: ${review._id}`);
        });

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        await mongoose.disconnect();
        process.exit(1);
    }
}

createTestReview();

