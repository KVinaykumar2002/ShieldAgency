
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
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const preloadingRef = useRef<Set<string>>(new Set());

    // Preload hero images
    useEffect(() => {
        const preloadImage = (url: string) => {
            if (preloadingRef.current.has(url)) return;
            preloadingRef.current.add(url);
            
            const img = new Image();
            img.onload = () => {
                setLoadedImages(prev => new Set(prev).add(url));
                preloadingRef.current.delete(url);
            };
            img.onerror = () => {
                setImageErrors(prev => new Set(prev).add(url));
                preloadingRef.current.delete(url);
            };
            img.src = url;
        };

        // Preload all hero images immediately (they're above the fold)
        CAROUSEL_SLIDES.forEach(slide => {
            preloadImage(slide.image);
        });
    }, []);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => {
            const next = (prev + 1) % CAROUSEL_SLIDES.length;
            // Preload next image
            const nextNext = (next + 1) % CAROUSEL_SLIDES.length;
            if (CAROUSEL_SLIDES[nextNext]) {
                const img = new Image();
                img.src = CAROUSEL_SLIDES[nextNext].image;
            }
            return next;
        });
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => {
            const next = (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length;
            // Preload previous image
            const prevPrev = (next - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length;
            if (CAROUSEL_SLIDES[prevPrev]) {
                const img = new Image();
                img.src = CAROUSEL_SLIDES[prevPrev].image;
            }
            return next;
        });
    }, []);
    
    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
        // Preload adjacent images
        const next = (index + 1) % CAROUSEL_SLIDES.length;
        const prev = (index - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length;
        if (CAROUSEL_SLIDES[next]) {
            const img = new Image();
            img.src = CAROUSEL_SLIDES[next].image;
        }
        if (CAROUSEL_SLIDES[prev]) {
            const img = new Image();
            img.src = CAROUSEL_SLIDES[prev].image;
        }
    }, []);

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
            className="relative h-screen w-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Slides */}
            {CAROUSEL_SLIDES.map((slide, index) => {
                const isActive = currentIndex === index;
                const isLoaded = loadedImages.has(slide.image);
                const hasError = imageErrors.has(slide.image);
                
                return (
                    <div 
                        key={index} 
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    >
                        {/* Loading placeholder */}
                        {!isLoaded && !hasError && isActive && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-black to-black flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
                            </div>
                        )}
                        
                        {/* Error placeholder */}
                        {hasError && isActive && (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-black to-black flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm">Failed to load image</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Actual image */}
                        <img 
                            src={slide.image} 
                            alt="Security Agency Professionals" 
                            loading={index === 0 ? "eager" : "lazy"}
                            fetchPriority={index === 0 ? "high" : index === 1 ? "high" : "auto"}
                            decoding="async"
                            className={`w-full h-full object-cover transition-opacity duration-500 ${
                                isLoaded ? 'opacity-100' : 'opacity-0'
                            } ${isActive ? kenburnsClasses[index % kenburnsClasses.length] : ''}`}
                            onLoad={(e) => {
                                const img = e.currentTarget;
                                setLoadedImages(prev => new Set(prev).add(slide.image));
                                img.style.opacity = '1';
                                // Prefetch next image
                                if (index < CAROUSEL_SLIDES.length - 1) {
                                    const nextSlide = CAROUSEL_SLIDES[index + 1];
                                    if (nextSlide && !loadedImages.has(nextSlide.image)) {
                                        const link = document.createElement('link');
                                        link.rel = 'prefetch';
                                        link.href = nextSlide.image;
                                        document.head.appendChild(link);
                                    }
                                }
                            }}
                            onError={() => {
                                setImageErrors(prev => new Set(prev).add(slide.image));
                            }}
                            style={{
                                willChange: isActive ? 'transform, opacity' : 'opacity',
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-black/80 via-black/60 to-transparent"></div>
                    </div>
                );
            })}

            {/* Content Overlay */}
            <div className="relative z-20 h-full flex items-center justify-center text-white px-4 sm:px-6 md:px-8 lg:px-12 py-16 sm:py-20 md:py-0">
                 <div 
                    key={currentIndex} // Re-trigger animation on slide change
                    className="relative max-w-2xl md:max-w-3xl w-full animate-slide-up-fade-in text-center space-y-4 sm:space-y-5 md:space-y-6"
                 >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                       {CAROUSEL_SLIDES[currentIndex].title}
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto text-gray-200 px-2 sm:px-0" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                        {CAROUSEL_SLIDES[currentIndex].description}
                    </p>
                    <div className="flex justify-center">
                        <Button 
                            onClick={() => setPage(CAROUSEL_SLIDES[currentIndex].ctaPage, CAROUSEL_SLIDES[currentIndex].ctaSubPageId)} 
                            variant="secondary"
                            className="min-w-[10rem] sm:min-w-[12rem] md:min-w-[14rem]"
                        >
                            {CAROUSEL_SLIDES[currentIndex].ctaText}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            <button 
                onClick={prevSlide} 
                className="absolute z-30 top-1/2 left-2 sm:left-4 md:left-8 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 active:bg-white/30 p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-white/10 touch-manipulation"
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button 
                onClick={nextSlide} 
                className="absolute z-30 top-1/2 right-2 sm:right-4 md:right-8 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 active:bg-white/30 p-2 sm:p-2.5 md:p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-white/10 touch-manipulation"
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Pagination Dots */}
            <div className="absolute z-30 bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex space-x-2 sm:space-x-3">
                {CAROUSEL_SLIDES.map((_, index) => (
                    <button 
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full transition-all duration-300 touch-manipulation ${currentIndex === index ? 'bg-accent-gold scale-125 shadow-lg shadow-accent-gold/50' : 'bg-white/40 hover:bg-white/70 active:bg-white/90'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
};

export default HeroCarousel;