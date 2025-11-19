import React, { useEffect, useState } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../ui/Button';
import { googleReviewsAPI, type GoogleReview } from '../../utils/api';

const initialForm = {
    reviewerName: '',
    rating: 5,
    reviewText: '',
    reviewUrl: '',
    profileImage: '',
    publishedAt: '',
};

const GoogleReviewsManagement: React.FC = () => {
    const [reviews, setReviews] = useState<GoogleReview[]>([]);
    const [formData, setFormData] = useState(initialForm);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [editingReview, setEditingReview] = useState<GoogleReview | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const loadReviews = async () => {
        setFetching(true);
        setError(null);
        try {
            const response = await googleReviewsAPI.getAll();
            setReviews(response.data || []);
            console.log('✅ Loaded reviews:', response.data?.length || 0);
        } catch (err: any) {
            setError(err.message || 'Failed to load Google reviews.');
            console.error('❌ Error loading reviews:', err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        loadReviews();
        
        // Auto-refresh every 2 minutes
        const refreshInterval = setInterval(() => {
            loadReviews();
        }, 2 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'rating' ? Number(value) : value,
        }));
    };

    const resetForm = () => {
        setFormData(initialForm);
        setEditingReview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        const payload = {
            reviewerName: formData.reviewerName.trim(),
            rating: formData.rating,
            reviewText: formData.reviewText.trim(),
            reviewUrl: formData.reviewUrl.trim() || undefined,
            profileImage: formData.profileImage.trim() || undefined,
            publishedAt: formData.publishedAt ? new Date(formData.publishedAt).toISOString() : undefined,
        };

        try {
            if (editingReview) {
                await googleReviewsAPI.update(editingReview._id, payload);
                setSuccessMessage('Review updated successfully.');
            } else {
                await googleReviewsAPI.create(payload);
                setSuccessMessage('Review added successfully.');
            }
            resetForm();
            await loadReviews();
            // Clear success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err: any) {
            setError(err.message || 'Failed to save review.');
            console.error('Error saving review:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (review: GoogleReview) => {
        setEditingReview(review);
        setFormData({
            reviewerName: review.reviewerName,
            rating: review.rating,
            reviewText: review.reviewText,
            reviewUrl: review.reviewUrl || '',
            profileImage: review.profileImage || '',
            publishedAt: review.publishedAt ? review.publishedAt.substring(0, 10) : '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this review? This action cannot be undone.');
        if (!confirmed) return;
        
        setDeletingId(id);
        setError(null);
        setSuccessMessage(null);

        try {
            await googleReviewsAPI.remove(id);
            setSuccessMessage('Review deleted successfully.');
            await loadReviews();
            // Clear success message after 5 seconds
            setTimeout(() => setSuccessMessage(null), 5000);
        } catch (err: any) {
            setError(err.message || 'Failed to delete review.');
            console.error('Error deleting review:', err);
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <AnimatedSection>
            <div className="space-y-4 sm:space-y-6">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                        <h1 className="text-2xl sm:text-3xl font-bold">Google Reviews</h1>
                        <p className="text-sm sm:text-base text-gray-300 mt-1">Add or curate reviews showcased on the website.</p>
                        {error && (
                            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                <p className="text-xs sm:text-sm text-red-400">{error}</p>
                            </div>
                        )}
                        {successMessage && (
                            <div className="mt-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                                <p className="text-xs sm:text-sm text-emerald-400">{successMessage}</p>
                            </div>
                        )}
                    </div>
                </header>

                <section className="bg-glass-bg border border-white/10 rounded-lg p-4 sm:p-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{editingReview ? 'Edit Review' : 'Add New Review'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm text-gray-300 mb-1">Reviewer Name *</label>
                                <input
                                    type="text"
                                    name="reviewerName"
                                    value={formData.reviewerName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm text-gray-300 mb-1">Rating (1-5) *</label>
                                <input
                                    type="number"
                                    name="rating"
                                    min={1}
                                    max={5}
                                    value={formData.rating}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-sm sm:text-base"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm text-gray-300 mb-1">Review URL (optional)</label>
                                <input
                                    type="url"
                                    name="reviewUrl"
                                    value={formData.reviewUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://maps.app.goo.gl/..."
                                    className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-sm sm:text-base"
                                />
                            </div>
                            <div>
                                <label className="block text-xs sm:text-sm text-gray-300 mb-1">Profile Image URL (optional)</label>
                                <input
                                    type="url"
                                    name="profileImage"
                                    value={formData.profileImage}
                                    onChange={handleInputChange}
                                    placeholder="https://..."
                                    className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-sm sm:text-base"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm text-gray-300 mb-1">Published Date (optional)</label>
                            <input
                                type="date"
                                name="publishedAt"
                                value={formData.publishedAt}
                                onChange={handleInputChange}
                                className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-sm sm:text-base"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm text-gray-300 mb-1">Review Text *</label>
                            <textarea
                                name="reviewText"
                                value={formData.reviewText}
                                onChange={handleInputChange}
                                rows={4}
                                required
                                className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-sm sm:text-base resize-y"
                            ></textarea>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                {loading ? (editingReview ? 'Updating...' : 'Adding...') : editingReview ? 'Update Review' : 'Add Review'}
                            </Button>
                            {editingReview && (
                                <Button type="button" variant="secondary" onClick={resetForm} className="w-full sm:w-auto">
                                    Cancel Edit
                                </Button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="border border-white/10 rounded-lg overflow-hidden">
                    <div className="p-3 sm:p-4 border-b border-white/10 flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-semibold">Existing Reviews ({reviews.length})</h2>
                        <button
                            onClick={loadReviews}
                            disabled={fetching}
                            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-xs sm:text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {fetching ? (
                                <>
                                    <div className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-accent-gold"></div>
                                    <span className="hidden sm:inline">Refreshing...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="hidden sm:inline">Refresh</span>
                                </>
                            )}
                        </button>
                    </div>
                    {fetching ? (
                        <div className="p-8 sm:p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold mb-4"></div>
                            <p className="text-gray-300">Loading reviews...</p>
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="p-6 sm:p-8 text-center">
                            <p className="text-gray-300">No reviews found. Add your first review above.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-white/10">
                            {reviews.map((review) => (
                                <li key={review._id} className="p-4 sm:p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4 hover:bg-white/5 transition-colors">
                                    <div className="space-y-2 flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 flex-wrap">
                                            <h3 className="text-lg sm:text-xl font-semibold text-white truncate">{review.reviewerName}</h3>
                                            <span className="px-2 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-300 rounded-full flex-shrink-0">{review.rating} ★</span>
                                            {review.publishedAt && (
                                                <span className="text-xs text-gray-400 flex-shrink-0">Published {new Date(review.publishedAt).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                        <p className="text-sm sm:text-base text-gray-200 whitespace-pre-line break-words">"{review.reviewText}"</p>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                                            {review.reviewUrl && (
                                                <a href={review.reviewUrl} target="_blank" rel="noopener noreferrer" className="text-highlight-blue hover:underline truncate">
                                                    View on Google →
                                                </a>
                                            )}
                                            {review.profileImage && (
                                                <span className="text-gray-400 truncate">
                                                    Profile: <a className="hover:underline break-all" href={review.profileImage} target="_blank" rel="noopener noreferrer">Image Link</a>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
                                        <Button 
                                            variant="primary" 
                                            className="!px-3 sm:!px-4 !py-2 text-xs sm:text-sm w-full sm:w-auto touch-manipulation" 
                                            onClick={() => handleEdit(review)}
                                            disabled={loading || deletingId !== null}
                                        >
                                            Edit
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            className="!px-3 sm:!px-4 !py-2 text-xs sm:text-sm w-full sm:w-auto touch-manipulation" 
                                            onClick={() => handleDelete(review._id)}
                                            disabled={loading || deletingId === review._id || deletingId !== null}
                                        >
                                            {deletingId === review._id ? 'Deleting...' : 'Delete'}
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </AnimatedSection>
    );
};

export default GoogleReviewsManagement;

