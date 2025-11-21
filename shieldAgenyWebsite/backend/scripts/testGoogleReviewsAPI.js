const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const GoogleReview = require('../models/googleReviewModel');

const testReviews = [
    {
        reviewerName: 'John Smith',
        rating: 5,
        reviewText: 'Excellent service! Shield Agency provided outstanding security services for our corporate event. The guards were professional, punctual, and very attentive. Highly recommended!',
        reviewUrl: 'https://www.google.com/maps/place/shield+agency',
        profileImage: 'https://i.pravatar.cc/150?img=12',
        publishedAt: new Date()
    },
    {
        reviewerName: 'Sarah Johnson',
        rating: 5,
        reviewText: 'Outstanding security team! They handled our high-profile event with utmost professionalism. The guards were well-trained and maintained excellent communication throughout. Will definitely use their services again.',
        reviewUrl: 'https://www.google.com/maps/place/shield+agency',
        profileImage: 'https://i.pravatar.cc/150?img=47',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    },
    {
        reviewerName: 'Michael Chen',
        rating: 4,
        reviewText: 'Very professional security services. The team was responsive and well-organized. Minor delay in initial setup, but overall excellent service. Would recommend for corporate events.',
        reviewUrl: 'https://www.google.com/maps/place/shield+agency',
        profileImage: 'https://i.pravatar.cc/150?img=33',
        publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
    },
    {
        reviewerName: 'Emily Rodriguez',
        rating: 5,
        reviewText: 'Best security agency in town! They provided 24/7 security for our facility and we felt completely safe. The guards are highly trained and always alert. Thank you Shield Agency!',
        reviewUrl: 'https://www.google.com/maps/place/shield+agency',
        profileImage: 'https://i.pravatar.cc/150?img=20',
        publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) // 21 days ago
    },
    {
        reviewerName: 'David Williams',
        rating: 5,
        reviewText: 'Exceptional service from start to finish. The team was professional, courteous, and very knowledgeable. They went above and beyond to ensure our event was secure. Highly satisfied!',
        reviewUrl: 'https://www.google.com/maps/place/shield+agency',
        profileImage: 'https://i.pravatar.cc/150?img=51',
        publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
    }
];

async function testGoogleReviewsAPI() {
    try {
        // Connect to MongoDB
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error('❌ MONGO_URI not found in environment variables');
            process.exit(1);
        }

        console.log('🔌 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing test reviews (optional - comment out if you want to keep them)
        // await GoogleReview.deleteMany({ reviewerName: { $in: testReviews.map(r => r.reviewerName) } });
        // console.log('🗑️  Cleared existing test reviews\n');

        // Create test reviews
        console.log('📝 Creating test reviews...\n');
        const createdReviews = [];
        
        for (const reviewData of testReviews) {
            // Check if review already exists
            const existingReview = await GoogleReview.findOne({ 
                reviewerName: reviewData.reviewerName
            });

            if (existingReview) {
                console.log(`⚠️  Review by ${reviewData.reviewerName} already exists. Updating...`);
                Object.assign(existingReview, reviewData);
                await existingReview.save();
                createdReviews.push(existingReview);
            } else {
                const review = await GoogleReview.create(reviewData);
                createdReviews.push(review);
                console.log(`✅ Created review by ${reviewData.reviewerName} (${reviewData.rating}⭐)`);
            }
        }

        // Fetch and display all reviews
        const allReviews = await GoogleReview.find().sort({ createdAt: -1 });
        console.log(`\n📊 Total reviews in database: ${allReviews.length}`);
        console.log('\n📋 All Reviews:');
        allReviews.forEach((review, index) => {
            console.log(`\n${index + 1}. ${review.reviewerName} - ${review.rating}⭐`);
            console.log(`   "${review.reviewText.substring(0, 80)}..."`);
            console.log(`   Published: ${new Date(review.publishedAt).toLocaleDateString()}`);
            console.log(`   ID: ${review._id}`);
        });

        // Test API endpoint structure
        console.log('\n🔍 API Endpoint Test:');
        console.log('   GET /api/google-reviews');
        console.log('   Expected response format:');
        console.log('   {');
        console.log('     "success": true,');
        console.log('     "data": [');
        console.log('       {');
        console.log('         "_id": "...",');
        console.log('         "reviewerName": "...",');
        console.log('         "rating": 5,');
        console.log('         "reviewText": "...",');
        console.log('         "reviewUrl": "...",');
        console.log('         "profileImage": "...",');
        console.log('         "publishedAt": "...",');
        console.log('         "createdAt": "..."');
        console.log('       }');
        console.log('     ]');
        console.log('   }');

        console.log('\n✅ Test reviews setup complete!');
        console.log('\n📌 Next steps:');
        console.log('   1. Start your backend server: npm start (in backend directory)');
        console.log('   2. Start your frontend: npm run dev (in frontend directory)');
        console.log('   3. Visit the homepage to see the reviews displayed');
        console.log('   4. Check browser console for review loading logs');

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error.stack);
        await mongoose.disconnect();
        process.exit(1);
    }
}

testGoogleReviewsAPI();

