import React from 'react';
import { Page } from '../../types';
import { ShieldCheckIcon, UserCheckIcon, LockIcon, TESTIMONIALS, SERVICES_DATA } from '../../constants';
import Button from '../ui/Button';
import AnimatedSection from '../ui/AnimatedSection';
import HeroCarousel from '../HeroCarousel';
import TestimonialScroller from '../ui/TestimonialScroller';

interface HomePageProps {
    setPage: (page: Page, subPageId?: string) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage }) => {

    return (
        <div>
            {/* Hero Section */}
            <HeroCarousel setPage={setPage} />
            
            {/* Why Choose Us Section */}
            <section className="py-20">
                 <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
                    <AnimatedSection>
                        <img src="https://aissecure.in/wp-content/uploads/2025/04/best-security-guards-in-india.jpg" alt="Security Team" className="rounded-lg shadow-2xl"/>
                    </AnimatedSection>
                    <AnimatedSection delay="delay-300">
                        <h2 className="text-4xl font-bold mb-4">Unmatched <span className="text-highlight-blue">Expertise & Reliability</span></h2>
                        <p className="text-gray-300 mb-6">Shield Agency is built on a foundation of discipline, integrity, and rigorous training. Our commitment to excellence ensures we provide not just security, but confidence.</p>
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
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="text-4xl font-bold">Our Core <span className="text-highlight-blue">Services</span></h2>
                        <p className="text-gray-300 mt-2 max-w-2xl mx-auto">Providing a comprehensive range of security solutions tailored to your needs.</p>
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


            {/* Testimonials Section */}
            <TestimonialScroller testimonials={TESTIMONIALS} />

        </div>
    );
};

export default HomePage;