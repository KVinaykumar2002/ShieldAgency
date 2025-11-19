import React, { useState, useEffect, useRef, useCallback } from 'react';
import { contactAPI } from '../utils/api';
import Button from './ui/Button';

interface WelcomePopupFormProps {
    onClose?: () => void;
}

const WelcomePopupForm: React.FC<WelcomePopupFormProps> = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const autoCloseTimeoutRef = useRef<number | null>(null);
    const popupRef = useRef<HTMLDivElement>(null);

    // Close popup with animation
    const handleClose = useCallback(() => {
        if (autoCloseTimeoutRef.current) {
            clearTimeout(autoCloseTimeoutRef.current);
            autoCloseTimeoutRef.current = null;
        }
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            if (onClose) {
                onClose();
            }
        }, 300); // Match animation duration
    }, [onClose]);

    // Show popup with animation on mount
    useEffect(() => {
        console.log('🚀 WelcomePopupForm mounted, setting up timers');
        // Small delay to ensure smooth animation
        const showTimer = setTimeout(() => {
            console.log('✅ Setting isVisible to true');
            setIsVisible(true);
        }, 300); // Slightly longer delay for smoother animation

        // Auto-close after 5 seconds
        autoCloseTimeoutRef.current = window.setTimeout(() => {
            console.log('⏰ Auto-closing popup after 5 seconds');
            handleClose();
        }, 5000);

        return () => {
            clearTimeout(showTimer);
            if (autoCloseTimeoutRef.current) {
                clearTimeout(autoCloseTimeoutRef.current);
            }
        };
    }, [handleClose]);

    // Prevent auto-close when user interacts with form
    const handleFormInteraction = () => {
        if (autoCloseTimeoutRef.current) {
            clearTimeout(autoCloseTimeoutRef.current);
            autoCloseTimeoutRef.current = null;
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        handleFormInteraction();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        handleFormInteraction(); // Prevent auto-close during submission
        
        try {
            await contactAPI.submitEnquiry(formData);
            setFormSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
            // Close after showing success message
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isVisible) {
                handleClose();
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [isVisible]);

    // Debug log
    useEffect(() => {
        console.log('🎬 WelcomePopupForm state:', { isVisible, isClosing });
    }, [isVisible, isClosing]);

    // Always render the container, but control visibility with classes
    // This ensures the component is in the DOM for debugging

    // Don't render if not visible and not closing
    if (!isVisible && !isClosing) {
        return null;
    }

    return (
        <div
            className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-opacity duration-300 ${
                isVisible && !isClosing ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={handleClose}
            style={{ zIndex: 9999 }}
        >
            {/* Backdrop */}
            <div
                className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
                    isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
                }`}
            />

            {/* Popup Content */}
            <div
                ref={popupRef}
                onClick={(e) => e.stopPropagation()}
                className={`relative bg-glass-bg backdrop-blur-xl border-2 border-accent-gold/50 rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 ${
                    isVisible && !isClosing
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-10'
                }`}
                onMouseEnter={handleFormInteraction}
                onFocus={handleFormInteraction}
            >
                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 group"
                    aria-label="Close popup"
                >
                    <svg
                        className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                {/* Content */}
                <div className="p-6 sm:p-8">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-gold/20 rounded-full mb-4">
                            <svg
                                className="w-8 h-8 text-accent-gold"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            Welcome to <span className="text-accent-gold">Shield Agency</span>
                        </h2>
                        <p className="text-gray-300 text-sm sm:text-base">
                            Get in touch with us for a free security consultation
                        </p>
                    </div>

                    {/* Form - Matching ContactPage enquiry form exactly */}
                    {formSubmitted ? (
                        <div className="text-center p-6 sm:p-8">
                            <h3 className="text-xl sm:text-2xl font-bold text-accent-gold mb-4">Message Sent!</h3>
                            <p className="text-gray-200 text-sm sm:text-base">Thank you for contacting us. We will get back to you as soon as possible.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-white placeholder-gray-400 text-sm sm:text-base"
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-white placeholder-gray-400 text-sm sm:text-base"
                                />
                            </div>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleInputChange}
                                required
                                className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-white placeholder-gray-400 text-sm sm:text-base"
                            />
                            <textarea
                                name="message"
                                placeholder="Your Message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={5}
                                required
                                className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-white placeholder-gray-400 text-sm sm:text-base resize-y"
                            />
                            {error && <p className="text-sm text-red-400">{error}</p>}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full sm:w-auto"
                                >
                                    {submitting ? 'Sending...' : 'Send Message'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={handleClose}
                                    className="w-full sm:w-auto"
                                >
                                    Maybe Later
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WelcomePopupForm;

