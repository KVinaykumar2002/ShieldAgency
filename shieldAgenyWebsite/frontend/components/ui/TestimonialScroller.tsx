
import React from 'react';
import { Testimonial } from '../../types';
import { StarIcon } from '../../constants';
import AnimatedSection from './AnimatedSection';

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
    <div className="w-[350px] h-[220px] bg-glass-bg border border-white/10 rounded-lg p-6 flex flex-col">
        <div className="flex mb-3">
            {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-5 h-5 text-accent-gold" />)}
        </div>
        <p className="text-gray-300 mb-4 italic text-sm flex-grow">"{testimonial.quote}"</p>
        <div className="flex items-center mt-auto">
            <img src={testimonial.image} alt={testimonial.name} className="w-11 h-11 rounded-full mr-4 border-2 border-highlight-blue" />
            <div>
                <p className="font-bold text-white">{testimonial.name}</p>
                <p className="text-sm text-gray-400">{testimonial.company}</p>
            </div>
        </div>
    </div>
);


const TestimonialScroller: React.FC<{ testimonials: Testimonial[] }> = ({ testimonials }) => {
  return (
    <section className="py-20 bg-primary-black/50">
        <div className="container mx-auto">
            <AnimatedSection className="text-center mb-12 px-4">
                 <h2 className="text-4xl font-bold">What Our <span className="text-highlight-blue">Clients Say</span></h2>
                <p className="text-gray-400 mt-2 max-w-2xl mx-auto">Real feedback from partners who trust Shield Agency.</p>
            </AnimatedSection>
            <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)] group">
                <ul className="flex items-stretch justify-center md:justify-start [&_li]:mx-4 animate-scroll-horizontal group-hover:[animation-play-state:paused]">
                    {testimonials.map((t, i) => (
                        <li key={`t1-${i}`}><TestimonialCard testimonial={t} /></li>
                    ))}
                </ul>
                <ul className="flex items-stretch justify-center md:justify-start [&_li]:mx-4 animate-scroll-horizontal group-hover:[animation-play-state:paused]" aria-hidden="true">
                    {testimonials.map((t, i) => (
                        <li key={`t2-${i}`}><TestimonialCard testimonial={t} /></li>
                    ))}
                </ul>
            </div>
        </div>
    </section>
  );
};

export default TestimonialScroller;