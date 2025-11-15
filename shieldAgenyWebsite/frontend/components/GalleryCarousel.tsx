import React, { useState, useEffect, useCallback, useRef } from 'react';
import { galleryAPI, GalleryItem } from '../utils/api';

const GalleryCarousel: React.FC = () => {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await galleryAPI.getAll();
                setGalleryItems(response.data || []);
            } catch (error) {
                console.error('Failed to load gallery images:', error);
            }
        };
        fetchGallery();
    }, []);

    const nextSlide = useCallback(() => {
        if (galleryItems.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
    }, [galleryItems.length]);

    const prevSlide = () => {
        if (galleryItems.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
    };
    
    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (!isHovered && galleryItems.length > 0) {
            timeoutRef.current = setTimeout(() => {
                nextSlide();
            }, 5000);
        }
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentIndex, isHovered, nextSlide, galleryItems.length]);

    const kenburnsClasses = ['animate-kenburns-top-left', 'animate-kenburns-bottom-right'];

    return (
        <div 
            className="relative w-full h-[400px] md:h-[500px] rounded-lg shadow-2xl overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gallery Images */}
            {galleryItems.length > 0 && galleryItems.map((item, index) => (
                <div 
                    key={item._id} 
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center bg-black/20 ${
                        currentIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                >
                    <img 
                        src={item.imageUrl} 
                        alt={item.title || 'Gallery Image'} 
                        loading={index === 0 || index === currentIndex ? "eager" : "lazy"}
                        className={`max-w-full max-h-full w-auto h-auto object-contain ${
                            currentIndex === index ? kenburnsClasses[index % kenburnsClasses.length] : ''
                        }`}
                        key={currentIndex}
                    />
                </div>
            ))}

            {/* Navigation Arrows */}
            {galleryItems.length > 1 && (
                <>
                    <button 
                        onClick={prevSlide} 
                        className="absolute z-30 top-1/2 left-4 transform -translate-y-1/2 bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-white/10"
                        aria-label="Previous image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={nextSlide} 
                        className="absolute z-30 top-1/2 right-4 transform -translate-y-1/2 bg-white/10 p-3 rounded-full hover:bg-white/20 transition-all duration-300 backdrop-blur-sm hover:shadow-lg hover:shadow-white/10"
                        aria-label="Next image"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Pagination Dots */}
                    <div className="absolute z-30 bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                        {galleryItems.map((_, index) => (
                            <button 
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`h-2 rounded-full transition-all duration-300 ${
                                    currentIndex === index
                                        ? 'w-8 bg-accent-gold'
                                        : 'w-2 bg-white/40 hover:bg-white/70'
                                }`}
                                aria-label={`Go to image ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default GalleryCarousel;

