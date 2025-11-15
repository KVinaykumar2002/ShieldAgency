
import React, { useEffect, useMemo, useState } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import { certificationAPI, Certification, galleryAPI, GalleryItem } from '../../utils/api';

const CertificationsPage: React.FC = () => {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [filter, setFilter] = useState('all');
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchCertifications = async () => {
            setLoading(true);
            setError(null);
            try {
                const [certResponse, galleryResponse] = await Promise.all([
                    certificationAPI.getAll(),
                    galleryAPI.getAll(),
                ]);
                setCertifications(certResponse.data || []);
                setGalleryItems(galleryResponse.data || []);
            } catch (err: any) {
                setError(err.message || 'Unable to load certifications at this time.');
            } finally {
                setLoading(false);
            }
        };
        fetchCertifications();
    }, []);

    const combinedGalleryItems = useMemo(() => {
        const certAsGallery: GalleryItem[] = certifications.map((cert) => ({
            _id: cert._id,
            title: cert.title,
            imageUrl: cert.imageUrl,
            category: cert.category,
            description: cert.description,
            createdAt: cert.createdAt,
        }));
        return [...certAsGallery, ...galleryItems];
    }, [certifications, galleryItems]);

    const filters = useMemo(() => {
        const categorySet = new Set<string>();
        combinedGalleryItems.forEach((item) => {
            if (item.category) {
                categorySet.add(item.category);
            }
        });
        return ['all', ...Array.from(categorySet)];
    }, [combinedGalleryItems]);

    const filteredGallery =
        filter === 'all'
            ? combinedGalleryItems
            : combinedGalleryItems.filter((item) => item.category === filter);

    const formatCategoryLabel = (value: string) =>
        value === 'all'
            ? 'All'
            : value
                  .split(/[\s_-]/)
                  .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                  .join(' ');

    // Auto carousel effect with pause on hover
    const [isPaused, setIsPaused] = useState(false);
    
    useEffect(() => {
        if (filteredGallery.length === 0 || isPaused) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => 
                (prevIndex + 1) % filteredGallery.length
            );
        }, 4000); // Change image every 4 seconds

        return () => clearInterval(interval);
    }, [filteredGallery.length, isPaused]);

    // Reset index when filter changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [filter]);

    return (
        <div className="pt-24 pb-12">
            <header className="text-center mb-16 px-4">
                <AnimatedSection>
                    <h1 className="text-5xl font-bold">Credentials & <span className="text-accent-gold">Gallery</span></h1>
                    <p className="text-lg text-gray-300 mt-2">Our commitment to excellence, certified and captured.</p>
                </AnimatedSection>
            </header>

            {/* Certifications Section */}
            <section className="py-12 container mx-auto px-4">
                 <AnimatedSection>
                    <h2 className="text-4xl font-bold text-center mb-12"><span className="text-highlight-blue">Our</span> Certifications</h2>
                    {loading ? (
                        <p className="text-center text-gray-300">Loading certifications...</p>
                    ) : error ? (
                        <p className="text-center text-red-400">{error}</p>
                    ) : certifications.length === 0 ? (
                        <p className="text-center text-gray-300">No certifications available yet. Please check back soon.</p>
                    ) : (
                        <div className="flex flex-wrap justify-center items-center gap-8">
                            {certifications.map(cert => (
                                <div key={cert._id} className="bg-glass-bg border border-white/10 p-6 rounded-lg text-center transform hover:scale-105 transition-transform">
                                    <img src={cert.imageUrl} alt={cert.title} className="h-20 mx-auto mb-2 object-contain" />
                                    <p className="font-semibold">{cert.title}</p>
                                    {cert.description && <p className="text-sm text-gray-400 mt-2">{cert.description}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </AnimatedSection>
            </section>
            
            {/* Gallery Section */}
            <section className="py-12 container mx-auto px-4">
                 <AnimatedSection>
                    <h2 className="text-4xl font-bold text-center mb-8"><span className="text-highlight-blue">In The</span> Field</h2>
                    <div className="flex justify-center space-x-2 md:space-x-4 mb-8">
                        {filters.map(f => (
                            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-md transition-colors font-semibold ${filter === f ? 'bg-highlight-blue text-white' : 'bg-glass-bg hover:bg-white/20 text-gray-200'}`}>
                                {formatCategoryLabel(f)}
                            </button>
                        ))}
                    </div>
                </AnimatedSection>
                {loading ? (
                    <p className="text-center text-gray-300">Loading gallery...</p>
                ) : error ? (
                    <p className="text-center text-red-400">{error}</p>
                ) : filteredGallery.length === 0 ? (
                    <p className="text-center text-gray-300">No items found for this category.</p>
                ) : (
                    <div 
                        className="relative w-full max-w-6xl mx-auto"
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <div className="relative w-full min-h-[500px] md:min-h-[600px] rounded-xl overflow-hidden bg-black/20 flex items-center justify-center">
                            {filteredGallery.map((item, index) => (
                                <div
                                    key={item._id}
                                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center justify-center ${
                                        index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                    }`}
                                >
                                    <div
                                        className="relative w-full h-full cursor-pointer group flex items-center justify-center"
                                        onClick={() => setLightboxImage(item.imageUrl)}
                                    >
                                        <div className="relative max-w-full max-h-[80vh] w-full h-full flex items-center justify-center p-4">
                                            <img
                                                src={item.imageUrl}
                                                alt={item.title}
                                                className="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-300 group-hover:scale-105 rounded-lg shadow-2xl"
                                                loading="lazy"
                                                onError={(e) => {
                                                    const target = e.target as HTMLImageElement;
                                                    target.style.display = 'none';
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8 px-4 pointer-events-none">
                                                <div className="text-white text-center space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                    <p className="font-bold text-2xl md:text-3xl drop-shadow-lg">{item.title}</p>
                                                    {item.category && (
                                                        <span className="inline-block px-4 py-1 bg-highlight-blue/80 backdrop-blur-sm rounded-full text-sm uppercase tracking-wide font-semibold drop-shadow-lg">
                                                            {formatCategoryLabel(item.category)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Carousel Indicators */}
                        <div className="flex justify-center gap-2 mt-6">
                            {filteredGallery.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                        index === currentIndex
                                            ? 'w-8 bg-highlight-blue'
                                            : 'w-2 bg-gray-500 hover:bg-gray-400'
                                    }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </section>
            
            {/* Lightbox */}
            {lightboxImage && (
                <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightboxImage(null)}>
                    <img src={lightboxImage} alt="Enlarged view" className="max-w-full max-h-full rounded-lg" onClick={e => e.stopPropagation()} />
                     <button onClick={() => setLightboxImage(null)} className="absolute top-4 right-4 text-white text-4xl">&times;</button>
                </div>
            )}
        </div>
    );
};

export default CertificationsPage;
