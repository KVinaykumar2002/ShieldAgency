
import React from 'react';
import AnimatedSection from './AnimatedSection';

const CLIENTS = [
    'Silver Opal Apartments', 'Bhagwan Cafe', 'RNB Motors', 'Crew Constructions',
    'One Hubli Mall', 'Extreme Fitness', 'Orange Fitness', 'Shilpa Biological',
    'Vishnu Minerals', 'Netravati Extension', 'The Fern Residency', 'The Phlox Hotel',
    'Fashion Studio Garments', 'Taluk Panchayat', 'Sana Shaheen Education Trust'
];

const OurClientsScroller: React.FC = () => {
    return (
        <AnimatedSection>
            {/* The main section container, now with just padding */}
            <section id="clients" className="py-20">
                {/* The new styled box, centered with max-width */}
                <div className="max-w-6xl mx-auto px-4">
                    <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] rounded-3xl border border-highlight-blue/40 shadow-[0_0_20px_rgba(59,130,246,0.15)] p-8 md:p-12">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-white mb-2"><span className="text-highlight-blue">Our</span> Clients</h2>
                            {/* Glowing underline effect */}
                            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-highlight-blue to-transparent mx-auto mb-12 blur-sm"></div>
                        </div>

                        <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)] group">
                            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-12 animate-scroll-horizontal group-hover:[animation-play-state:paused]">
                                {CLIENTS.map((client, index) => (
                                    <li key={index} className="whitespace-nowrap text-xl md:text-2xl font-semibold text-gray-200 hover:text-highlight-blue hover:scale-105 transition-all duration-300 cursor-default">
                                        {client}
                                    </li>
                                ))}
                            </ul>
                            <ul className="flex items-center justify-center md:justify-start [&_li]:mx-12 animate-scroll-horizontal group-hover:[animation-play-state:paused]" aria-hidden="true">
                                 {CLIENTS.map((client, index) => (
                                    <li key={index + CLIENTS.length} className="whitespace-nowrap text-xl md:text-2xl font-semibold text-gray-200 hover:text-highlight-blue hover:scale-105 transition-all duration-300 cursor-default">
                                        {client}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </AnimatedSection>
    );
};

export default OurClientsScroller;
