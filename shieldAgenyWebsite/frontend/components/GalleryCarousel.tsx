import React, { useState, useEffect, useCallback, useRef } from 'react';
import { galleryAPI, GalleryItem } from '../utils/api';

const GalleryCarousel: React.FC = () => {
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const imageRefs = useRef<Map<string, HTMLImageElement>>(new Map());
    const preloadingRef = useRef<Set<string>>(new Set());
    const loadedImagesRef = useRef<Set<string>>(new Set());
    const imageErrorsRef = useRef<Set<string>>(new Set());

    // Sync refs with state
    useEffect(() => {
        loadedImagesRef.current = loadedImages;
    }, [loadedImages]);

    useEffect(() => {
        imageErrorsRef.current = imageErrors;
    }, [imageErrors]);

    // Preload images
    const preloadImage = useCallback((url: string) => {
        // Check if already loaded, errored, or currently preloading
        if (loadedImagesRef.current.has(url) || imageErrorsRef.current.has(url) || preloadingRef.current.has(url)) {
            return;
        }
        
        preloadingRef.current.add(url);
        
        const img = new Image();
        img.onload = () => {
            setLoadedImages(prev => {
                const newSet = new Set(prev);
                newSet.add(url);
                loadedImagesRef.current = newSet;
                return newSet;
            });
            preloadingRef.current.delete(url);
        };
        img.onerror = () => {
            setImageErrors(prev => {
                const newSet = new Set(prev);
                newSet.add(url);
                imageErrorsRef.current = newSet;
                return newSet;
            });
            preloadingRef.current.delete(url);
        };
        img.src = url;
    }, []);

    useEffect(() => {
        const fetchGallery = async () => {
            try {
                const response = await galleryAPI.getAll();
                const items = response.data || [];
                setGalleryItems(items);
                
                // Preload first 5 images immediately (more aggressive preloading)
                if (items.length > 0) {
                    items.slice(0, Math.min(5, items.length)).forEach(item => {
                        preloadImage(item.imageUrl);
                    });
                }
            } catch (error) {
                console.error('Failed to load gallery images:', error);
            }
        };
        fetchGallery();
    }, [preloadImage]);

    const nextSlide = useCallback(() => {
        if (galleryItems.length === 0) return;
        setCurrentIndex((prev) => {
            const next = (prev + 1) % galleryItems.length;
            // Preload next and previous images
            const nextIndex = (next + 1) % galleryItems.length;
            const prevIndex = (next - 1 + galleryItems.length) % galleryItems.length;
            if (galleryItems[nextIndex]) preloadImage(galleryItems[nextIndex].imageUrl);
            if (galleryItems[prevIndex]) preloadImage(galleryItems[prevIndex].imageUrl);
            return next;
        });
    }, [galleryItems, preloadImage]);

    const prevSlide = useCallback(() => {
        if (galleryItems.length === 0) return;
        setCurrentIndex((prev) => {
            const next = (prev - 1 + galleryItems.length) % galleryItems.length;
            // Preload next and previous images
            const nextIndex = (next + 1) % galleryItems.length;
            const prevIndex = (next - 1 + galleryItems.length) % galleryItems.length;
            if (galleryItems[nextIndex]) preloadImage(galleryItems[nextIndex].imageUrl);
            if (galleryItems[prevIndex]) preloadImage(galleryItems[prevIndex].imageUrl);
            return next;
        });
    }, [galleryItems, preloadImage]);
    
    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
        // Preload adjacent images
        const nextIndex = (index + 1) % galleryItems.length;
        const prevIndex = (index - 1 + galleryItems.length) % galleryItems.length;
        if (galleryItems[nextIndex]) preloadImage(galleryItems[nextIndex].imageUrl);
        if (galleryItems[prevIndex]) preloadImage(galleryItems[prevIndex].imageUrl);
    }, [galleryItems, preloadImage]);

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

    // Preload images when currentIndex changes
    useEffect(() => {
        if (galleryItems.length === 0) return;
        
        // Preload current, next, and previous images
        const indicesToPreload = [
            currentIndex,
            (currentIndex + 1) % galleryItems.length,
            (currentIndex - 1 + galleryItems.length) % galleryItems.length,
        ];
        
        indicesToPreload.forEach(index => {
            if (galleryItems[index]) {
                preloadImage(galleryItems[index].imageUrl);
            }
        });
    }, [currentIndex, galleryItems, preloadImage]);

    const kenburnsClasses = ['animate-kenburns-top-left', 'animate-kenburns-bottom-right'];

    return (
        <div 
            className="relative w-full h-[400px] md:h-[500px] rounded-lg shadow-2xl overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Gallery Images */}
            {galleryItems.length > 0 && galleryItems.map((item, index) => {
                const isActive = currentIndex === index;
                const isLoaded = loadedImages.has(item.imageUrl);
                const hasError = imageErrors.has(item.imageUrl);
                const shouldLoad = isActive || index === 0 || index === (currentIndex + 1) % galleryItems.length || index === (currentIndex - 1 + galleryItems.length) % galleryItems.length;
                
                return (
                    <div 
                        key={item._id} 
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex items-center justify-center bg-black/20 ${
                            isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                    >
                        {/* Loading placeholder */}
                        {!isLoaded && !hasError && isActive && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-gold"></div>
                            </div>
                        )}
                        
                        {/* Error placeholder */}
                        {hasError && isActive && (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-sm">Failed to load image</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Actual image */}
                        {(shouldLoad || isLoaded) && !hasError && (
                            <img 
                                ref={(el) => {
                                    if (el) imageRefs.current.set(item.imageUrl, el);
                                }}
                                src={item.imageUrl} 
                                alt={item.title || 'Gallery Image'} 
                                loading={index === 0 || isActive ? "eager" : "lazy"}
                                decoding="async"
                                fetchPriority={isActive ? "high" : "low"}
                                className={`max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-500 ${
                                    isLoaded ? 'opacity-100' : 'opacity-0'
                                } ${
                                    isActive ? kenburnsClasses[index % kenburnsClasses.length] : ''
                                }`}
                                onLoad={(e) => {
                                    const img = e.currentTarget;
                                    setLoadedImages(prev => {
                                        const newSet = new Set(prev);
                                        newSet.add(item.imageUrl);
                                        loadedImagesRef.current = newSet;
                                        
                                        // Prefetch next image if not on data saver mode
                                        if ('connection' in navigator && (navigator as any).connection?.saveData === false) {
                                            const nextIndex = (currentIndex + 1) % galleryItems.length;
                                            if (galleryItems[nextIndex] && !newSet.has(galleryItems[nextIndex].imageUrl)) {
                                                const link = document.createElement('link');
                                                link.rel = 'prefetch';
                                                link.href = galleryItems[nextIndex].imageUrl;
                                                document.head.appendChild(link);
                                            }
                                        }
                                        
                                        return newSet;
                                    });
                                    img.style.opacity = '1';
                                }}
                                onError={() => {
                                    setImageErrors(prev => new Set(prev).add(item.imageUrl));
                                }}
                                style={{
                                    willChange: isActive ? 'transform, opacity' : 'opacity',
                                }}
                            />
                        )}
                    </div>
                );
            })}

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

