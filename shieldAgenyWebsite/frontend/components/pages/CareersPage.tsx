
import React, { useState, useEffect } from 'react';
import { Page } from '../../types';
import { JOB_OPENINGS } from '../../constants';
import AnimatedSection from '../ui/AnimatedSection';
import Button from '../ui/Button';
import RecruitmentProcedure from '../RecruitmentProcedure';
import { applicationAPI } from '../../utils/api';

interface CareersPageProps {
    subPageId: string;
    setPage: (page: Page, subPageId?: string) => void;
    isAuthenticated: boolean;
}

const CareersPage: React.FC<CareersPageProps> = ({ subPageId, setPage, isAuthenticated }) => {
    const [expandedJob, setExpandedJob] = useState<number | null>(0);
    const [selectedJobIndex, setSelectedJobIndex] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [resume, setResume] = useState<File | null>(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [showAuthPrompt, setShowAuthPrompt] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Hide auth prompt when user becomes authenticated
    useEffect(() => {
        if (isAuthenticated) {
            setShowAuthPrompt(false);
        }
    }, [isAuthenticated]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            setResume(e.target.files[0]);
        }
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check if user is authenticated
        if (!isAuthenticated) {
            setShowAuthPrompt(true);
            return;
        }

        // Check if resume is uploaded
        if (!resume) {
            setError('Please upload your resume');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            // Create FormData for file upload
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);
            formDataToSend.append('phone', formData.phone);
            if (formData.message) {
                formDataToSend.append('message', formData.message);
            }
            formDataToSend.append('resume', resume);
            
            // Add job title if a job is selected
            if (selectedJobIndex !== null && JOB_OPENINGS[selectedJobIndex]) {
                formDataToSend.append('jobTitle', JOB_OPENINGS[selectedJobIndex].title);
            }

            await applicationAPI.create(formDataToSend);
            
            setFormSubmitted(true);
            setFormData({ name: '', email: '', phone: '', message: '' });
            setResume(null);
            setSelectedJobIndex(null);
        } catch (err: any) {
            setError(err.message || 'Failed to submit application. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleApplyNowClick = (page: Page, subPageId?: string) => {
        if (!isAuthenticated) {
            setShowAuthPrompt(true);
            // Scroll to apply section after a brief delay
            setTimeout(() => {
                const element = document.getElementById('apply');
                if (element) {
                    const header = document.querySelector('header > nav');
                    const headerHeight = header ? header.getBoundingClientRect().height : 100;
                    const y = element.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 100);
        } else {
            setPage(page, subPageId);
        }
    };

    return (
        <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
            <header className="text-center mb-12 sm:mb-16 px-4">
                <AnimatedSection>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Join <span className="text-accent-gold">Shield Agency</span></h1>
                    <p className="text-base sm:text-lg text-gray-300 mt-2">Build a rewarding career protecting what matters most.</p>
                </AnimatedSection>
            </header>

            <div className="container mx-auto px-4">
                {/* Job Openings */}
                <section id="openings" className="mb-12 sm:mb-16 md:mb-20">
                    <AnimatedSection>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"><span className="text-highlight-blue">Current</span> Openings</h2>
                        <div className="max-w-4xl mx-auto space-y-4">
                            {JOB_OPENINGS.map((job, index) => (
                                <div key={index} className="bg-glass-bg border border-white/10 rounded-lg overflow-hidden">
                                    <button onClick={() => {
                                        setExpandedJob(expandedJob === index ? null : index);
                                        if (expandedJob !== index) {
                                            setSelectedJobIndex(index);
                                        }
                                    }} className="w-full p-6 text-left flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{job.title}</h3>
                                            <p className="text-gray-400">{job.location} | <span className="text-accent-gold">{job.type}</span></p>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-300 ${expandedJob === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    {expandedJob === index && (
                                        <div className="p-6 border-t border-white/10 bg-primary-black/30">
                                            <ul className="list-disc list-inside space-y-2 text-gray-300 mb-4">
                                               {job.description.map((desc, i) => <li key={i}>{desc}</li>)}
                                            </ul>
                                            <Button 
                                                onClick={() => {
                                                    setSelectedJobIndex(index);
                                                    setTimeout(() => {
                                                        const element = document.getElementById('apply');
                                                        if (element) {
                                                            const header = document.querySelector('header > nav');
                                                            const headerHeight = header ? header.getBoundingClientRect().height : 100;
                                                            const y = element.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                                                            window.scrollTo({ top: y, behavior: 'smooth' });
                                                        }
                                                    }, 100);
                                                }}
                                                variant="secondary"
                                                className="mt-4"
                                            >
                                                Apply Now
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </AnimatedSection>
                </section>
                
                {/* Recruitment Procedure */}
                <RecruitmentProcedure setPage={handleApplyNowClick} />

                {/* Apply Now Form */}
                <section id="apply" className="mb-12">
                     <AnimatedSection>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"><span className="text-highlight-blue">Apply</span> Now</h2>
                        <div className="max-w-2xl mx-auto bg-glass-bg border border-white/10 rounded-lg p-4 sm:p-6 md:p-8">
                            {showAuthPrompt && !isAuthenticated ? (
                                <div className="text-center p-8">
                                    <div className="mb-6">
                                        <svg className="w-16 h-16 mx-auto text-accent-gold mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Authentication Required</h3>
                                    <p className="text-gray-300 mb-6">
                                        Please sign up and sign in to your account before submitting an application.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <Button onClick={() => { setShowAuthPrompt(false); setPage('SignUp'); }} variant="secondary">
                                            Sign Up
                                        </Button>
                                        <Button onClick={() => { setShowAuthPrompt(false); setPage('Login'); }} variant="primary">
                                            Sign In
                                        </Button>
                                    </div>
                                </div>
                            ) : formSubmitted ? (
                                <div className="text-center p-8">
                                    <h3 className="text-2xl font-bold text-accent-gold mb-4">Thank You!</h3>
                                    <p className="text-gray-200">Your application has been submitted successfully. We will be in touch if your qualifications match our needs.</p>
                                </div>
                            ) : (
                            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                {selectedJobIndex !== null && (
                                    <div className="bg-highlight-blue/10 border border-highlight-blue/30 rounded-lg p-3">
                                        <p className="text-sm text-gray-300">
                                            <span className="font-semibold text-highlight-blue">Applying for:</span> {JOB_OPENINGS[selectedJobIndex].title}
                                        </p>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} required className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-white placeholder-gray-400 text-sm sm:text-base"/>
                                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} required className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-white placeholder-gray-400 text-sm sm:text-base"/>
                                </div>
                                <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleInputChange} required className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-white placeholder-gray-400 text-sm sm:text-base"/>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Upload Resume <span className="text-red-400">*</span></label>
                                    <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} required className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-highlight-blue file:text-white hover:file:bg-blue-500 cursor-pointer"/>
                                    {resume && <p className="text-xs text-green-400 mt-1">{resume.name}</p>}
                                </div>
                                <textarea name="message" placeholder="Cover Letter or Message (Optional)" value={formData.message} onChange={handleInputChange} rows={4} className="w-full p-2.5 sm:p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue text-white placeholder-gray-400 text-sm sm:text-base resize-y"></textarea>
                                {error && <p className="text-sm text-red-400">{error}</p>}
                                <div className="text-center">
                                    <Button onClick={() => {}} className="w-full md:w-auto" type="submit" disabled={submitting}>
                                        {submitting ? 'Submitting...' : 'Submit Application'}
                                    </Button>
                                </div>
                            </form>
                            )}
                        </div>
                    </AnimatedSection>
                </section>
            </div>
        </div>
    );
};

export default CareersPage;