import React, { useEffect, useState } from 'react';
import { Page, GoogleReview } from '../../types';
import { ShieldCheckIcon, UserCheckIcon, LockIcon, TESTIMONIALS, SERVICES_DATA } from '../../constants';
import Button from '../ui/Button';
import AnimatedSection from '../ui/AnimatedSection';
import HeroCarousel from '../HeroCarousel';
import GalleryCarousel from '../GalleryCarousel';
import TestimonialScroller from '../ui/TestimonialScroller';
import OurClientsScroller from '../ui/OurClientsScroller';
import GoogleReviewsSection from '../ui/GoogleReviewsSection';
import { contactAPI, googleReviewsAPI } from '../../utils/api';

interface HomePageProps {
    setPage: (page: Page, subPageId?: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage }) => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [googleReviews, setGoogleReviews] = useState<GoogleReview[]>([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await contactAPI.submitEnquiry(formData);
            setFormSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err: any) {
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const loadReviews = async () => {
            setReviewsLoading(true);
            try {
                const response = await googleReviewsAPI.getPublic();
                if (response && response.data) {
                    setGoogleReviews(response.data);
                    console.log('✅ Google reviews loaded:', response.data.length);
                } else {
                    console.warn('⚠️ No reviews data in response');
                    setGoogleReviews([]);
                }
            } catch (err: any) {
                console.error('❌ Failed to load google reviews:', err);
                setGoogleReviews([]);
            } finally {
                setReviewsLoading(false);
            }
        };
        loadReviews();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <HeroCarousel setPage={setPage} />
            
            {/* Why Choose Us Section */}
            <section className="py-12 sm:py-16 md:py-20">
                 <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
                    <AnimatedSection>
                        <GalleryCarousel />
                    </AnimatedSection>
                    <AnimatedSection delay="delay-300">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Unmatched <span className="text-highlight-blue">Expertise & Reliability</span></h2>
                        <p className="text-gray-300 mb-6 text-sm sm:text-base">Shield Agency is built on a foundation of discipline, integrity, and rigorous training. Our commitment to excellence ensures we provide not just security, but confidence.</p>
                        <ul className="space-y-4">
                            <li className="flex items-start"><ShieldCheckIcon className="w-6 h-6 text-accent-gold mr-3 mt-1 flex-shrink-0" /><span><strong>Vetted Professionals:</strong> Every officer undergoes extensive background checks and an elite training program.</span></li>
                            <li className="flex items-start"><UserCheckIcon className="w-6 h-6 text-accent-gold mr-3 mt-1 flex-shrink-0" /><span><strong>Client-Centric Approach:</strong> We collaborate with you to develop a customized security strategy that fits your exact needs.</span></li>
                             <li className="flex items-start"><LockIcon className="w-6 h-6 text-accent-gold mr-3 mt-1 flex-shrink-0" /><span><strong>Cutting-Edge Technology:</strong> We leverage the latest surveillance and communication technology for optimal protection.</span></li>
                        </ul>
                         <div className="mt-8">
                            <Button onClick={() => setPage('About', 'why-us')} variant="secondary">Why Choose Us</Button>
                        </div>
                    </AnimatedSection>
                 </div>
            </section>

            {/* Core Services Section */}
            <section className="py-12 sm:py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <AnimatedSection className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Our Core <span className="text-highlight-blue">Services</span></h2>
                        <p className="text-gray-300 mt-2 max-w-2xl mx-auto text-sm sm:text-base px-4">Providing a comprehensive range of security solutions tailored to your needs.</p>
                    </AnimatedSection>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {SERVICES_DATA.map((service, index) => (
                            <AnimatedSection key={service.id} delay={`delay-${index * 100}`}>
                                <div className="bg-glass-bg border border-white/10 rounded-lg p-6 text-center h-full group transition-all duration-300 hover:-translate-y-2 hover:border-accent-gold/50">
                                    <service.icon className="w-12 h-12 text-accent-gold mx-auto mb-4 transition-transform duration-300 group-hover:scale-110" />
                                    <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                                    <p className="text-sm text-gray-400">{service.description}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                    <AnimatedSection className="text-center mt-12">
                        <Button onClick={() => setPage('Services')} variant="secondary">View All Services</Button>
                    </AnimatedSection>
                </div>
            </section>

            {/* Our Clients Section */}
            <OurClientsScroller />

            {/* Testimonials Section */}
            <TestimonialScroller testimonials={TESTIMONIALS} />

            {/* Google Reviews Section */}
            {!reviewsLoading && <GoogleReviewsSection reviews={googleReviews} />}

            {/* Contact Us Section */}
            <section className="py-12 sm:py-16 md:py-20">
                <div className="container mx-auto px-4">
                    <AnimatedSection className="text-center mb-8 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Enquiry <span className="text-highlight-blue">Now</span></h2>
                        <p className="text-gray-300 mt-2 max-w-2xl mx-auto text-sm sm:text-base px-4">We're here to help. Contact us for a free security consultation.</p>
                    </AnimatedSection>

                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
                        {/* Contact Info and Map */}
                        <AnimatedSection>
                            <div className="space-y-6 sm:space-y-8">
                                <div>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-highlight-blue mb-3 sm:mb-4">Contact Details</h3>
                                    <div className="space-y-2 sm:space-y-3 text-gray-300 text-sm sm:text-base">
                                        <p><strong>Address:</strong> Shop T 2 A 3rd floor Revankar complex court circle Hubli</p>
                                        <p><strong>Email:</strong> shieldagency01@gmail.com</p>
                                        <p><strong>Phone:</strong> 9886668368</p>
                                        <p><strong>Hours:</strong> Mon-Fri, 9am - 5pm</p>
                                    </div>
                                </div>
                                <div className="h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden border-2 border-highlight-blue/50">
                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3847.464742206035!2d75.1374323!3d15.351296800000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb8d770ed604311%3A0xdd85fbe6955be63b!2sShield%20Agency!5e0!3m2!1sen!2sin!4v1762890496601!5m2!1sen!2sin" 
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        allowFullScreen={true}
                                        loading="lazy"
                                        title="Company Location"
                                    ></iframe>
                                </div>
                            </div>
                        </AnimatedSection>

                        {/* Contact Form */}
                        <AnimatedSection delay="delay-300">
                            <div className="bg-glass-bg border border-white/10 rounded-lg p-4 sm:p-6 md:p-8">
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-highlight-blue mb-4 sm:mb-6">Send Us a Message</h3>
                                {formSubmitted ? (
                                    <div className="text-center p-8">
                                        <h4 className="text-2xl font-bold text-accent-gold mb-4">Message Sent!</h4>
                                        <p className="text-gray-200">Thank you for contacting us. We will get back to you as soon as possible.</p>
                                        <Button className="mt-6" onClick={() => setFormSubmitted(false)}>Send Another Message</Button>
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
                                        ></textarea>
                                        {error && <p className="text-sm text-red-400">{error}</p>}
                                        <div className="text-right">
                                            <Button onClick={() => {}} type="submit" disabled={submitting}>
                                                {submitting ? 'Sending...' : 'Send Message'}
                                            </Button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </AnimatedSection>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default HomePage;