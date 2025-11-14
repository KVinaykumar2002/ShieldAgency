import React from 'react';
import { Page } from '../types';
import { RECRUITMENT_STEPS } from '../constants';
import AnimatedSection from './ui/AnimatedSection';
import Button from './ui/Button';

interface RecruitmentProcedureProps {
    setPage: (page: Page, subPageId?: string) => void;
}

const RecruitmentProcedure: React.FC<RecruitmentProcedureProps> = ({ setPage }) => {
    return (
        <section id="recruitment-procedure" className="py-20">
            <AnimatedSection>
                <h2 className="text-4xl font-bold text-center mb-12">
                    Our <span className="text-highlight-blue">Recruitment Procedure</span>
                </h2>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {RECRUITMENT_STEPS.map((step, index) => (
                    <AnimatedSection key={index} delay={`delay-${(index * 100)}`}>
                        <div className="bg-glass-bg border border-white/10 rounded-xl p-6 h-full group transition-all duration-500 ease-in-out hover:border-accent-gold/50 hover:scale-[1.03] hover:shadow-2xl hover:shadow-accent-gold/10">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-full bg-accent-gold/10 flex flex-col items-center justify-center border-2 border-accent-gold/30 animate-gold-glow">
                                        <step.icon className="w-7 h-7 text-accent-gold" />
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-accent-gold mb-1">Step {String(index + 1).padStart(2, '0')}</p>
                                    <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                                    {typeof step.description === 'string' ? (
                                        <p className="text-gray-300 text-sm leading-relaxed">{step.description}</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {step.description.map((item, i) => (
                                                <li key={i} className="text-gray-300 text-sm leading-relaxed flex items-start">
                                                    <svg className="w-3 h-3 text-accent-gold mr-2 mt-1 flex-shrink-0" fill="currentColor" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3"/></svg>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </AnimatedSection>
                ))}
            </div>
            <AnimatedSection>
                <div className="text-center mt-16">
                     <h3 className="text-2xl font-bold mb-4 text-white">Join Our Ranks</h3>
                    <p className="max-w-xl mx-auto text-gray-300 mb-8">
                        If you meet these standards and are ready for a challenging and rewarding career, we invite you to apply.
                    </p>
                    <Button onClick={() => setPage('Careers', 'apply')} variant="secondary">
                        Apply Now
                    </Button>
                </div>
            </AnimatedSection>
        </section>
    );
};

export default RecruitmentProcedure;
