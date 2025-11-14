

import React, { useState } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../ui/Button';
import { contactAPI } from '../../utils/api';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="pt-24 pb-12">
            <header className="text-center mb-16 px-4">
                <AnimatedSection>
                    <h1 className="text-5xl font-bold">Get In <span className="text-accent-gold">Touch</span></h1>
                    <p className="text-lg text-gray-300 mt-2">We're here to help. Contact us for a free security consultation.</p>
                </AnimatedSection>
            </header>

            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Info and Map */}
                    <AnimatedSection>
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-highlight-blue mb-4">Contact Details</h2>
                                <p className="text-gray-300"><strong>Address:</strong> Shop T 2 A 3rd floor Revankar complex court circle Hubli</p>
                                <p className="text-gray-300"><strong>Email:</strong> shieldagency01@gmail.com</p>
                                <p className="text-gray-300"><strong>Phone:</strong> 9886668368</p>
                                <p className="text-gray-300"><strong>Hours:</strong> Mon-Fri, 9am - 5pm</p>
                            </div>
                            <div className="h-96 rounded-lg overflow-hidden border-2 border-highlight-blue/50">
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
                        <div className="bg-glass-bg border border-white/10 rounded-lg p-8">
                            <h2 className="text-3xl font-bold text-highlight-blue mb-6">Send Us a Message</h2>
                             {formSubmitted ? (
                                <div className="text-center p-8">
                                    <h3 className="text-2xl font-bold text-accent-gold mb-4">Message Sent!</h3>
                                    <p className="text-gray-200">Thank you for contacting us. We will get back to you as soon as possible.</p>
                                    <Button className="mt-6" onClick={() => setFormSubmitted(false)}>Send Another Message</Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} required className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"/>
                                        <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleInputChange} required className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"/>
                                    </div>
                                    <input type="text" name="subject" placeholder="Subject" value={formData.subject} onChange={handleInputChange} required className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"/>
                                    <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleInputChange} rows={5} required className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue"></textarea>
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
        </div>
    );
};

export default ContactPage;