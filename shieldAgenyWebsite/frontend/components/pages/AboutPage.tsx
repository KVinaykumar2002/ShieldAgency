
import React from 'react';
import { MANAGEMENT_PROFILES, ShieldCheckIcon, UserCheckIcon, LockIcon } from '../../constants';
import AnimatedSection from '../ui/AnimatedSection';
import OurJourneyTimeline from '../OurJourneyTimeline';
import OurClientsScroller from '../ui/OurClientsScroller';

interface AboutPageProps {
    subPageId: string;
}

const AboutPage: React.FC<AboutPageProps> = ({ subPageId }) => {

    return (
        <div className="pt-20 sm:pt-24 pb-8 sm:pb-12">
            <header className="text-center mb-12 sm:mb-16 px-4">
                <AnimatedSection>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">About <span className="text-accent-gold">Shield Agency</span></h1>
                    <p className="text-base sm:text-lg text-gray-300 mt-2">Forged in experience, driven by excellence.</p>
                </AnimatedSection>
            </header>

            <div className="container mx-auto px-4">
                {/* Our Journey */}
                <OurJourneyTimeline />
                
                {/* Vision and Mission Section */}
                <section className="mb-12 sm:mb-16 md:mb-20">
                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                        {/* Vision */}
                        <AnimatedSection delay="delay-100">
                            <div className="relative bg-gradient-to-br from-accent-gold/20 via-accent-gold/10 to-transparent border border-accent-gold/30 rounded-xl p-8 h-full group hover:border-accent-gold/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-accent-gold/20">
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-accent-gold via-yellow-400 to-accent-gold rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="bg-accent-gold/10 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 inline-block transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Our Vision</h2>
                                </div>
                                <p className="text-gray-200 text-base sm:text-lg leading-relaxed transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
                                    To benchmark our company comparable any best in the industry and meet global standard in security and man power supply services.
                                </p>
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-accent-gold/5 rounded-full blur-2xl transform scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                            </div>
                        </AnimatedSection>

                        {/* Mission */}
                        <AnimatedSection delay="delay-300">
                            <div className="relative bg-gradient-to-br from-accent-gold/20 via-accent-gold/10 to-transparent border border-accent-gold/30 rounded-xl p-8 h-full group hover:border-accent-gold/50 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-accent-gold/20">
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-accent-gold via-yellow-400 to-accent-gold rounded-t-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="bg-accent-gold/10 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 inline-block transform translate-y-0 group-hover:-translate-y-1 transition-transform duration-300">
                                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">Our Mission</h2>
                                </div>
                                <p className="text-gray-200 text-base sm:text-lg leading-relaxed transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300">
                                    To be committed to offer reliable cost effective customer oriented services by selecting best work force train and retain them to believer quality services to our customer.
                                </p>
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-accent-gold/5 rounded-full blur-2xl transform scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                            </div>
                        </AnimatedSection>
                    </div>
                </section>
                
                {/* Why Choose Us */}
                 <AnimatedSection>
                    <section id="why-us" className="mb-12 sm:mb-16 md:mb-20">
                         <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"><span className="text-highlight-blue">Why</span> Choose Us</h2>
                         <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center">
                            <div className="bg-glass-bg border border-white/10 p-6 rounded-lg">
                                <ShieldCheckIcon className="w-12 h-12 mx-auto text-accent-gold mb-4" />
                                <h3 className="text-xl font-bold mb-2">Unwavering Professionalism</h3>
                                <p className="text-gray-400">Our officers are the face of security—disciplined, courteous, and impeccably presented.</p>
                            </div>
                             <div className="bg-glass-bg border border-white/10 p-6 rounded-lg">
                                <UserCheckIcon className="w-12 h-12 mx-auto text-accent-gold mb-4" />
                                <h3 className="text-xl font-bold mb-2">Elite Training Standards</h3>
                                <p className="text-gray-400">We go beyond basic certification with continuous, scenario-based training for real-world readiness.</p>
                            </div>
                             <div className="bg-glass-bg border border-white/10 p-6 rounded-lg">
                                <LockIcon className="w-12 h-12 mx-auto text-accent-gold mb-4" />
                                <h3 className="text-xl font-bold mb-2">Proven Reliability</h3>
                                <p className="text-gray-400">With redundant systems and a 24/7 command center, we provide security you can always count on.</p>
                            </div>
                         </div>
                    </section>
                </AnimatedSection>

                {/* Our Clients Section */}
                <OurClientsScroller />

                {/* Our Management */}
                <AnimatedSection>
                    <section id="management" className="mb-12 sm:mb-16 md:mb-20">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"><span className="text-highlight-blue">Our</span> Management</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {MANAGEMENT_PROFILES.map((profile, index) => (
                                <div key={index} className="bg-glass-bg border border-white/10 rounded-lg p-6 group overflow-hidden">
                                    <div className="relative">
                                        <img src={profile.image} alt={profile.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-highlight-blue/50 group-hover:border-highlight-blue transition-all duration-300" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <p className="text-center p-4 text-sm text-gray-200">{profile.bio}</p>
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-center mt-4">{profile.name}</h3>
                                    <p className="text-accent-gold text-center">{profile.title}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </AnimatedSection>

            </div>
        </div>
    );
};

export default AboutPage;
