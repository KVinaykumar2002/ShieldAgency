
import React, { useState, useEffect, useRef } from 'react';
import AnimatedSection from './ui/AnimatedSection';

const journeyData = [
    {
        year: '2016',
        title: 'Founded',
        description: 'Shield Agency was established in Hubballi, Karnataka under the leadership of Sunny Naikar, with a focus on delivering reliable security and housekeeping services.',
    },
    {
        year: '2017',
        title: 'Team Formation',
        description: 'Built a strong foundation with a skilled team dedicated to professional security solutions and customer trust.',
    },
    {
        year: '2019',
        title: 'Expansion in Karnataka',
        description: 'Expanded services across Karnataka, becoming a trusted partner for corporate and home care security needs.',
    },
    {
        year: '2021',
        title: 'Industry Recognition',
        description: 'Recognized for excellence and reliability in providing professional security and manpower services.',
    },
    {
        year: '2023',
        title: 'Vision & Growth',
        description: 'Focused on benchmarking the company with industry leaders and achieving global standards in security and manpower solutions.',
    },
    {
        year: '2025',
        title: 'Commitment to Excellence',
        description: 'Continuing to provide cost-effective, customer-oriented, and high-quality services with well-trained and retained staff.',
    },
];

const OurJourneyTimeline: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [isLineVisible, setLineVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setLineVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1 }
        );

        const currentRef = sectionRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, []);

    return (
        <section id="journey" className="mb-20" ref={sectionRef}>
            <AnimatedSection>
                <h2 className="text-4xl font-bold text-center mb-16">
                    <span className="text-highlight-blue">Our</span> Journey
                </h2>
            </AnimatedSection>

            <div className="container mx-auto px-4 relative">
                {/* The vertical timeline line */}
                <div className={`absolute top-0 left-4 md:left-1/2 w-0.5 h-full bg-highlight-blue origin-top transition-transform duration-[2000ms] ease-out ${isLineVisible ? 'scale-y-100' : 'scale-y-0'}`}></div>

                {journeyData.map((item, index) => (
                    <div
                        key={index}
                        className={`relative flex items-center mb-12 w-full ${
                            index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'
                        }`}
                    >
                        {/* Content Half */}
                        <div className="w-full md:w-1/2 pl-12 md:pl-0">
                            <AnimatedSection
                                animation={index % 2 === 0 ? 'slide-in-from-left' : 'slide-in-from-right'}
                            >
                                <div
                                    className={`
                                        bg-glass-bg border border-white/10 rounded-lg p-6 transition-all duration-300 hover:border-accent-gold/50 hover:-translate-y-1 shadow-lg hover:shadow-highlight-blue/10
                                        ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}
                                    `}
                                >
                                    <p className="font-bold text-accent-gold text-2xl mb-1">{item.year}</p>
                                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-gray-300 text-sm">{item.description}</p>
                                </div>
                            </AnimatedSection>
                        </div>

                        {/* Spacer Half (for desktop) */}
                        <div className="hidden md:block w-1/2"></div>
                        
                        {/* Timeline Node */}
                        <div className="absolute top-1/2 -translate-y-1/2 left-4 md:left-1/2 w-5 h-5 rounded-full bg-primary-black border-2 border-highlight-blue -translate-x-1/2 z-10 transition-all duration-300 group-hover:bg-highlight-blue group-hover:scale-125 group-hover:shadow-[0_0_15px_#3B82F6]"></div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default OurJourneyTimeline;
