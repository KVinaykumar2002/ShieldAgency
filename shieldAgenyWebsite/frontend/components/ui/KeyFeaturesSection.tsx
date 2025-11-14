
import React from 'react';
import AnimatedSection from './AnimatedSection';

interface Feature {
    title: string;
    description: string;
    icon: React.ElementType;
}

interface KeyFeaturesSectionProps {
    features: Feature[];
}

const KeyFeaturesSection: React.FC<KeyFeaturesSectionProps> = ({ features }) => {
    // We only display the first 4 features to fit the 2x2 grid design.
    const featuresToDisplay = features.slice(0, 4);

    return (
        <section className="py-20 bg-primary-black">
            <div className="container mx-auto px-4">
                <AnimatedSection className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-highlight-blue" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Key Features
                    </h2>
                </AnimatedSection>
                
                <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-white/10">
                    {featuresToDisplay.map((feature, index) => (
                        <AnimatedSection 
                            key={index} 
                            delay={`delay-${100 * index}`}
                            className="border-r border-b border-white/10"
                        >
                            <div className="p-8 h-full group transition-all duration-300 ease-in-out hover:bg-shadow-glow">
                                <feature.icon className="w-10 h-10 text-accent-gold mb-5 transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_#d4af37]" />
                                <h3 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    {feature.title}
                                </h3>
                                <p className="text-gray-300" style={{ color: '#cfcfcf' }}>
                                    {feature.description}
                                </p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KeyFeaturesSection;
