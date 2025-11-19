import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { SECURITY_SERVICES, HOUSEKEEPING_SERVICES } from '../../constants';
import AnimatedSection from './AnimatedSection';

interface ServiceItemProps {
    id: string;
    icon: React.ElementType;
    title: string;
    description: string;
    isActive?: boolean;
}

const ServiceCard: React.FC<ServiceItemProps> = ({ id, icon: Icon, title, description, isActive }) => (
    <div 
        id={id}
        className={`bg-glass-bg border rounded-lg p-4 sm:p-5 md:p-6 group transition-all duration-500 ease-in-out hover:border-accent-gold/50 hover:bg-shadow-glow hover:-translate-y-1 h-full scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-32 ${
            isActive 
                ? 'border-accent-gold border-2 bg-shadow-glow shadow-lg shadow-accent-gold/30 animate-pulse-glow' 
                : 'border-white/10'
        }`}
        style={isActive ? {
            animation: 'pulseGlow 2s ease-in-out infinite',
        } : {}}
    >
        <Icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 mb-3 sm:mb-4 transition-transform duration-300 ease-in-out group-hover:scale-110 ${
            isActive ? 'text-accent-gold' : 'text-accent-gold'
        }`} />
        <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2" style={{ color: '#FFFFFF' }}>{title}</h3>
        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed" style={{ color: '#CFCFCF' }}>{description}</p>
    </div>
);

interface OurServicesSectionProps {
    activeServiceId?: string | null;
    highlightedServiceId?: string | null;
}

const OurServicesSection: React.FC<OurServicesSectionProps> = ({ activeServiceId, highlightedServiceId }) => {
    const scrollTimeoutRef = useRef<number | null>(null);
    const hasScrolledRef = useRef(false);

    // Function to scroll to service
    const scrollToService = (retries = 15, delay = 50) => {
        if (!activeServiceId) return;
        
        const element = document.getElementById(activeServiceId);
        if (element) {
            // Element found, scroll to it immediately
            const header = document.querySelector('header > nav');
            const headerHeight = header ? header.getBoundingClientRect().height : 100;
            const y = element.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
            window.scrollTo({ top: y, behavior: 'smooth' });
            hasScrolledRef.current = true;
        } else if (retries > 0) {
            // Element not found yet, retry after delay
            scrollTimeoutRef.current = window.setTimeout(() => scrollToService(retries - 1, delay), delay);
        }
    };

    // Use useLayoutEffect for immediate scroll on mount (runs synchronously before paint)
    useLayoutEffect(() => {
        if (activeServiceId) {
            // Always reset scroll flag when activeServiceId changes
            hasScrolledRef.current = false;
            // Try immediately on first render
            scrollToService();
        }
    }, [activeServiceId]);

    // Use useEffect for subsequent changes and to ensure scroll happens
    useEffect(() => {
        // Scroll to the active service when activeServiceId changes
        if (activeServiceId) {
            // Clear any existing timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            // Reset scroll flag when activeServiceId changes to ensure scroll happens
            hasScrolledRef.current = false;

            // Try scrolling immediately with multiple attempts
            const attemptScroll = () => {
                requestAnimationFrame(() => {
                    scrollToService();
                    // Also try again after a short delay to ensure it works
                    setTimeout(() => {
                        if (!hasScrolledRef.current) {
                            scrollToService();
                        }
                    }, 100);
                });
            };

            attemptScroll();
        }

        // Cleanup timeout on unmount or when activeServiceId changes
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, [activeServiceId]);

    return (
        <section className="pt-16 sm:pt-20 md:pt-24 lg:pt-32 pb-12 sm:pb-16 md:pb-20 bg-primary-black">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Left Sticky Heading */}
                    <div className="lg:col-span-4 lg:sticky lg:top-0 lg:h-screen flex items-center mb-6 sm:mb-8 md:mb-12 lg:mb-0">
                        <AnimatedSection animation="slide-in-from-left" className="w-full">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">Our <span className="text-highlight-blue">Services</span></h2>
                            <p className="text-gray-300 mt-3 sm:mt-4 leading-relaxed text-xs sm:text-sm md:text-base">
                                From elite on-site security to meticulous housekeeping, Shield Agency provides a comprehensive suite of services to ensure your environment is safe, clean, and professional.
                            </p>
                        </AnimatedSection>
                    </div>

                    {/* Right Scrollable Content */}
                    <div className="lg:col-span-8 lg:h-screen lg:overflow-y-auto lg:py-20 no-scrollbar">
                        <div className="space-y-8 sm:space-y-10 md:space-y-12">
                            {/* Security Services */}
                            <div id="security-services" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-32">
                                <AnimatedSection animation="slide-in-from-right">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-accent-gold mb-2 sm:mb-3">Security Services</h3>
                                    <p className="text-gray-400 mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm md:text-base">Professional and reliable protection services tailored for personal, commercial, and high-security environments.</p>
                                </AnimatedSection>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                                    {SECURITY_SERVICES.map((service, index) => (
                                        <AnimatedSection key={service.id} animation="slide-in-from-right" delay={`delay-${(index * 100)}`}>
                                            <ServiceCard {...service} isActive={highlightedServiceId === service.id} />
                                        </AnimatedSection>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Housekeeping Services */}
                            <div id="housekeeping-services" className="scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-32">
                                <AnimatedSection animation="slide-in-from-right">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-accent-gold mb-2 sm:mb-3">Housekeeping Services</h3>
                                    <p className="text-gray-400 mb-4 sm:mb-5 md:mb-6 text-xs sm:text-sm md:text-base">Hygienic and high-quality maintenance solutions for residential and commercial properties.</p>
                                </AnimatedSection>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                                    {HOUSEKEEPING_SERVICES.map((service, index) => (
                                        <AnimatedSection key={service.id} animation="slide-in-from-right" delay={`delay-${(index * 100)}`}>
                                            <ServiceCard {...service} isActive={highlightedServiceId === service.id} />
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
                
                /* Pulse glow animation for highlighted services */
                @keyframes pulseGlow {
                    0%, 100% {
                        box-shadow: 0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.2);
                    }
                    50% {
                        box-shadow: 0 0 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.3);
                    }
                }
            `}</style>
        </section>
    );
};

export default OurServicesSection;