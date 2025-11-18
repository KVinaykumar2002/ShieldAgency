import React from 'react';
import AnimatedSection from './AnimatedSection';
import { StarIcon } from '../../constants';
import type { GoogleReview } from '../../types';

interface GoogleReviewsSectionProps {
    reviews: GoogleReview[];
}

const renderStars = (rating: number) => {
    return (
        <div className="flex">
            {[...Array(5)].map((_, index) => (
                <StarIcon
                    key={index}
                    className={`w-4 h-4 ${index < Math.round(rating) ? 'text-accent-gold' : 'text-gray-600'}`}
                />
            ))}
        </div>
    );
};

const GoogleReviewsSection: React.FC<GoogleReviewsSectionProps> = ({ reviews }) => {
    if (!reviews.length) return null;

    return (
        <section className="py-12 sm:py-16 md:py-20">
            <div className="container mx-auto px-4">
                <AnimatedSection className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        Our <span className="text-highlight-blue">Google Reviews</span>
                    </h2>
                    <p className="text-gray-300 mt-2 max-w-2xl mx-auto text-sm sm:text-base px-4">
                        Real feedback from customers who trusted Shield Agency for their safety.
                    </p>
                </AnimatedSection>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review) => (
                        <AnimatedSection key={review._id}>
                            <div className="bg-glass-bg border border-white/10 rounded-xl p-6 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                    <div>
                                        <p className="text-lg font-semibold text-white">{review.reviewerName}</p>
                                        {review.publishedAt && (
                                            <p className="text-xs text-gray-400">
                                                {new Date(review.publishedAt).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <span className="text-accent-gold font-bold">{review.rating.toFixed(1)}</span>
                                        </div>
                                        {renderStars(review.rating)}
                                    </div>
                                </div>
                                <p className="text-gray-200 text-sm flex-1 whitespace-pre-line">"{review.reviewText}"</p>
                                {review.reviewUrl && (
                                    <a
                                        href={review.reviewUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-highlight-blue text-sm mt-4 hover:underline"
                                    >
                                        View on Google
                                    </a>
                                )}
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GoogleReviewsSection;

