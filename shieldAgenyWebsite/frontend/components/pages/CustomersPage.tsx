

import React, { useState, useEffect, useCallback } from 'react';
import { TESTIMONIALS } from '../../constants';
import AnimatedSection from '../ui/AnimatedSection';

interface CustomersPageProps {
    isHomePageSection?: boolean;
}

const CustomersPage: React.FC<CustomersPageProps> = ({ isHomePageSection = false }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextTestimonial = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % TESTIMONIALS.length);
    }, []);

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextTestimonial();
        }, 5000);
        return () => clearInterval(interval);
    }, [nextTestimonial]);

    const clientLogos = [
        'https://tailwindui.com/img/logos/158x48/transistor-logo-white.svg',
        'https://tailwindui.com/img/logos/158x48/reform-logo-white.svg',
        'https://tailwindui.com/img/logos/158x48/tuple-logo-white.svg',
        'https://tailwindui.com/img/logos/158x48/savvycal-logo-white.svg',
        'https://tailwindui.com/img/logos/158x48/statamic-logo-white.svg',
    ];

    const testimonialSection = (
        <section className={`py-20 ${isHomePageSection ? '' : 'pt-28'}`}>
            <div className="container mx-auto px-4">
                <AnimatedSection className="text-center mb-12">
                    <h2 className="text-4xl font-bold">Trusted by <span className="text-highlight-blue">Industry Leaders</span></h2>
                    <p className="text-gray-400 mt-2 max-w-2xl mx-auto">We are proud to be the chosen security partner for a diverse range of clients.</p>
                </AnimatedSection>
                
                <AnimatedSection>
                    <div className="relative bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg p-8 md:p-12 max-w-4xl mx-auto overflow-hidden">
                        {TESTIMONIALS.map((testimonial, index) => (
                            <div key={index} className={`transition-opacity duration-500 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0 absolute inset-0 p-8 md:p-12'}`}>
                                <p className="text-lg md:text-xl italic text-center text-gray-200 mb-6">"{testimonial.quote}"</p>
                                <div className="flex items-center justify-center">
                                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4 border-2 border-accent-gold" />
                                    <div>
                                        <p className="font-bold text-white">{testimonial.name}</p>
                                        <p className="text-accent-gold">{testimonial.company}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                         <button onClick={prevTestimonial} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button onClick={nextTestimonial} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );

    if (isHomePageSection) {
        return testimonialSection;
    }

    return (
        <>
            {testimonialSection}
             <section className="py-16 bg-primary-black/50">
                <div className="container mx-auto px-4">
                     <AnimatedSection>
                        <h3 className="text-center text-2xl font-semibold text-gray-300 mb-8">Our Valued Partners</h3>
                        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6">
                            {clientLogos.map((logo, index) => (
                                <img key={index} src={logo} alt={`Client Logo ${index+1}`} className="h-10 opacity-60 hover:opacity-100 transition-opacity duration-300"/>
                            ))}
                        </div>
                    </AnimatedSection>
                </div>
            </section>
        </>
    );
};

export default CustomersPage;