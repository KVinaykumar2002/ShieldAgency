
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Page } from '../types';
import { CAROUSEL_SLIDES } from '../constants';
import Button from './ui/Button';

interface HeroCarouselProps {
    setPage: (page: Page, subPageId?: string) => void;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ setPage }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
    };
    
    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (!isHovered) {
            timeoutRef.current = setTimeout(() => {
                nextSlide();
            }, 5000);
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentIndex, isHovered, nextSlide]);

    const kenburnsClasses = ['animate-kenburns-top-left', 'animate-kenburns-bottom-right'];

    return (
        <section 
            className="relative min-h-[70vh] md:h-screen w-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slides */}
            {CAROUSEL_SLIDES.map((slide, index) => (
                <div 
                    key={index} 
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <img 
                        src={slide.image} 
                        alt="Security Agency Professionals" 
                        loading="lazy"
                        className={`w-full h-full object-cover ${currentIndex === index ? kenburnsClasses[index % kenburnsClasses.length] : ''}`}
                        key={currentIndex} // Force re-render to restart animation
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-black/80 via-black/60 to-transparent"></div>
                </div>
            ))}

            {/* Content Overlay */}
            <div className="relative z-20 h-full flex items-start md:items-center justify-start md:justify-center text-white px-6 sm:px-8 md:px-12 pt-24 sm:pt-28 md:pt-0 pb-16">
                 <div 
                    key={currentIndex} // Re-trigger animation on slide change
                    className="relative max-w-2xl md:max-w-3xl w-full animate-slide-up-fade-in text-left md:text-center space-y-5"
                 >
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                       {CAROUSEL_SLIDES[currentIndex].title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg md:max-w-2xl md:mx-auto text-gray-200" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                        {CAROUSEL_SLIDES[currentIndex].description}
                    </p>
                    <div className="flex md:justify-center">
                        <Button 
                            onClick={() => setPage(CAROUSEL_SLIDES[currentIndex].ctaPage, CAROUSEL_SLIDES[currentIndex].ctaSubPageId)} 
                            variant="secondary"
                            className="min-w-[10rem] py-3 text-sm sm:text-base"
                        >
                            {CAROUSEL_SLIDES[currentIndex].ctaText}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={prevSlide} 
                className="hidden sm:flex absolute z-30 top-1/2 left-4 md:left-8 transform -translate-y-1/2 bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-white/10"
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
                onClick={nextSlide} 
                className="hidden sm:flex absolute z-30 top-1/2 right-4 md:right-8 transform -translate-y-1/2 bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-white/10"
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Pagination Dots */}
            <div className="absolute z-30 bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3">
                {CAROUSEL_SLIDES.map((_, index) => (
                    <button 
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-accent-gold scale-125 shadow-lg shadow-accent-gold/50' : 'bg-white/40 hover:bg-white/70'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;