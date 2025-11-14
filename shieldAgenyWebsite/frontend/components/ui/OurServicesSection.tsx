import React from 'react';
import { SECURITY_SERVICES, HOUSEKEEPING_SERVICES } from '../../constants';
import AnimatedSection from './AnimatedSection';

interface ServiceItemProps {
    icon: React.ElementType;
    title: string;
    description: string;
}

const ServiceCard: React.FC<ServiceItemProps> = ({ icon: Icon, title, description }) => (
    <div className="bg-glass-bg border border-white/10 rounded-lg p-6 group transition-all duration-300 ease-in-out hover:border-accent-gold/50 hover:bg-shadow-glow hover:-translate-y-1 h-full">
        <Icon className="w-8 h-8 text-accent-gold mb-4 transition-transform duration-300 ease-in-out group-hover:scale-110" />
        <h3 className="text-xl font-bold text-white mb-2" style={{ color: '#FFFFFF' }}>{title}</h3>
        <p className="text-gray-300 text-sm leading-relaxed" style={{ color: '#CFCFCF' }}>{description}</p>
    </div>
);

const OurServicesSection: React.FC = () => {
    return (
        <section className="pt-32 pb-20 bg-primary-black">
            <div className="container mx-auto px-4">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sticky Heading */}
                    <div className="lg:col-span-4 lg:sticky lg:top-0 lg:h-screen flex items-center mb-12 lg:mb-0">
                        <AnimatedSection animation="slide-in-from-left" className="w-full">
                            <h2 className="text-5xl font-bold text-white">Our <span className="text-highlight-blue">Services</span></h2>
                            <p className="text-gray-300 mt-4 leading-relaxed">
                                From elite on-site security to meticulous housekeeping, Shield Agency provides a comprehensive suite of services to ensure your environment is safe, clean, and professional.
                            </p>
                        </AnimatedSection>
                    </div>

                    {/* Right Scrollable Content */}
                    <div className="lg:col-span-8 lg:h-screen lg:overflow-y-auto lg:py-20 no-scrollbar">
                        <div className="space-y-12">
                            {/* Security Services */}
                            <div>
                                <AnimatedSection animation="slide-in-from-right">
                                    <h3 className="text-3xl font-bold text-accent-gold mb-2">Security Services</h3>
                                    <p className="text-gray-400 mb-6">Professional and reliable protection services tailored for personal, commercial, and high-security environments.</p>
                                </AnimatedSection>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {SECURITY_SERVICES.map((service, index) => (
                                        <AnimatedSection key={service.title} animation="slide-in-from-right" delay={`delay-${(index * 100)}`}>
                                            <ServiceCard {...service} />
                                        </AnimatedSection>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Housekeeping Services */}
                            <div>
                                <AnimatedSection animation="slide-in-from-right">
                                    <h3 className="text-3xl font-bold text-accent-gold mb-2">Housekeeping Services</h3>
                                    <p className="text-gray-400 mb-6">Hygienic and high-quality maintenance solutions for residential and commercial properties.</p>
                                </AnimatedSection>
                                <div className="grid md:grid-cols-2 gap-6">
                                    {HOUSEKEEPING_SERVICES.map((service, index) => (
                                        <AnimatedSection key={service.title} animation="slide-in-from-right" delay={`delay-${(index * 100)}`}>
                                            <ServiceCard {...service} />
                                        </AnimatedSection>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
                /* For custom scrollbar on right side */
                @media (min-width: 1024px) {
                    .no-scrollbar::-webkit-scrollbar {
                        width: 4px;
                    }
                    .no-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .no-scrollbar::-webkit-scrollbar-thumb {
                        background: #3B82F6;
                        border-radius: 4px;
                    }
                    .no-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #2563EB;
                    }
                    .no-scrollbar {
                        scrollbar-width: thin;
                        scrollbar-color: #3B82F6 transparent;
                    }
                }
            `}</style>
        </section>
    );
};

export default OurServicesSection;