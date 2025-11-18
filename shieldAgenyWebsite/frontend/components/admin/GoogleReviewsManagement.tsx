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
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [editingReview, setEditingReview] = useState<GoogleReview | null>(null);

    const loadReviews = async () => {
        try {
            const response = await googleReviewsAPI.getAll();
            setReviews(response.data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load Google reviews.');
        }
    };

    useEffect(() => {
        loadReviews();
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
            loadReviews();
        } catch (err: any) {
            setError(err.message || 'Failed to save review.');
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
        const confirmed = window.confirm('Are you sure you want to delete this review?');
        if (!confirmed) return;
        setError(null);
        setSuccessMessage(null);

        try {
            await googleReviewsAPI.remove(id);
            setSuccessMessage('Review deleted successfully.');
            loadReviews();
        } catch (err: any) {
            setError(err.message || 'Failed to delete review.');
        }
    };

    return (
        <AnimatedSection>
            <div className="space-y-6">
                <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Google Reviews</h1>
                        <p className="text-gray-300">Add or curate reviews showcased on the website.</p>
                        {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
                        {successMessage && <p className="text-sm text-emerald-400 mt-2">{successMessage}</p>}
                    </div>
                </header>

                <section className="bg-glass-bg border border-white/10 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">{editingReview ? 'Edit Review' : 'Add New Review'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Reviewer Name</label>
                                <input
                                    type="text"
                                    name="reviewerName"
                                    value={formData.reviewerName}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Rating (1-5)</label>
                                <input
                                    type="number"
                                    name="rating"
                                    min={1}
                                    max={5}
                                    value={formData.rating}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Review URL (optional)</label>
                                <input
                                    type="url"
                                    name="reviewUrl"
                                    value={formData.reviewUrl}
                                    onChange={handleInputChange}
                                    placeholder="https://maps.app.goo.gl/..."
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-300 mb-1">Profile Image URL (optional)</label>
                                <input
                                    type="url"
                                    name="profileImage"
                                    value={formData.profileImage}
                                    onChange={handleInputChange}
                                    placeholder="https://..."
                                    className="w-full p-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Published Date (optional)</label>
                            <input
                                type="date"
                                name="publishedAt"
                                value={formData.publishedAt}
                                onChange={handleInputChange}
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">Review Text</label>
                            <textarea
                                name="reviewText"
                                value={formData.reviewText}
                                onChange={handleInputChange}
                                rows={4}
                                required
                                className="w-full p-3 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"
                            ></textarea>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button type="submit" disabled={loading}>
                                {loading ? (editingReview ? 'Updating...' : 'Adding...') : editingReview ? 'Update Review' : 'Add Review'}
                            </Button>
                            {editingReview && (
                                <Button type="button" variant="secondary" onClick={resetForm}>
                                    Cancel Edit
                                </Button>
                            )}
                        </div>
                    </form>
                </section>

                <section className="border border-white/10 rounded-lg overflow-hidden">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="text-lg font-semibold">Existing Reviews</h2>
                    </div>
                    {reviews.length === 0 ? (
                        <p className="p-6 text-gray-300 text-center">No reviews found.</p>
                    ) : (
                        <ul className="divide-y divide-white/10">
                            {reviews.map((review) => (
                                <li key={review._id} className="p-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4 hover:bg-white/5 transition-colors">
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <h3 className="text-xl font-semibold text-white">{review.reviewerName}</h3>
                                            <span className="px-2 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-300 rounded-full">{review.rating} ★</span>
                                            {review.publishedAt && (
                                                <span className="text-xs text-gray-400">Published {new Date(review.publishedAt).toLocaleDateString()}</span>
                                            )}
                                        </div>
                                        <p className="text-gray-200 whitespace-pre-line">{review.reviewText}</p>
                                        <div className="flex items-center gap-4 flex-wrap text-sm">
                                            {review.reviewUrl && (
                                                <a href={review.reviewUrl} target="_blank" rel="noopener noreferrer" className="text-highlight-blue hover:underline">
                                                    View on Google
                                                </a>
                                            )}
                                            {review.profileImage && (
                                                <span className="text-gray-400">Profile Image: <a className="hover:underline" href={review.profileImage} target="_blank" rel="noopener noreferrer">Link</a></span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="primary" className="!px-4 !py-2 text-sm" onClick={() => handleEdit(review)}>
                                            Edit
                                        </Button>
                                        <Button variant="danger" className="!px-4 !py-2 text-sm" onClick={() => handleDelete(review._id)}>
                                            Delete
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

