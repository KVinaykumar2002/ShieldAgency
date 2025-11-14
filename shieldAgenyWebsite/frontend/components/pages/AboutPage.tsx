
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
        <div className="pt-24 pb-12">
            <header className="text-center mb-16 px-4">
                <AnimatedSection>
                    <h1 className="text-5xl font-bold text-white">About <span className="text-accent-gold">Shield Agency</span></h1>
                    <p className="text-lg text-gray-300 mt-2">Forged in experience, driven by excellence.</p>
                </AnimatedSection>
            </header>

            <div className="container mx-auto px-4">
                {/* Our Journey */}
                <OurJourneyTimeline />
                
                {/* Why Choose Us */}
                 <AnimatedSection>
                    <section id="why-us" className="mb-20">
                         <h2 className="text-4xl font-bold text-center mb-12"><span className="text-highlight-blue">Why</span> Choose Us</h2>
                         <div className="grid md:grid-cols-3 gap-8 text-center">
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
                    <section id="management" className="mb-20">
                        <h2 className="text-4xl font-bold text-center mb-12"><span className="text-highlight-blue">Our</span> Management</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
