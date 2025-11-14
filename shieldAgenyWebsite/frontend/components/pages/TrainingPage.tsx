

import React from 'react';
import { Page } from '../../types';
import Button from '../ui/Button';
import AnimatedSection from '../ui/AnimatedSection';
import { ShieldCheckIcon } from '../../constants';

interface TrainingPageProps {
    setPage: (page: Page, subPageId?: string) => void;
}

const TrainingPage: React.FC<TrainingPageProps> = ({ setPage }) => {
    const modules = [
        { title: 'Threat Assessment & Risk Management', description: 'Identifying potential threats and developing proactive strategies to mitigate them.' },
        { title: 'De-escalation & Conflict Resolution', description: 'Techniques to peacefully resolve volatile situations, minimizing harm and liability.' },
        { title: 'Advanced First Aid & Emergency Response', description: 'CPR, AED, and trauma care certifications to act as effective first responders.' },
        { title: 'Surveillance & Counter-Surveillance', description: 'Utilizing modern technology and classic techniques to monitor and protect assets.' },
        { title: 'Physical Training & Defensive Tactics', description: 'Rigorous fitness standards and hands-on defensive skills for real-world scenarios.' },
        { title: 'Legal & Ethical Conduct', description: 'A comprehensive understanding of the legal boundaries and ethical responsibilities of a security professional.' }
    ];

    return (
        <div className="pt-24 pb-12">
            <header className="relative py-20 text-center text-white overflow-hidden">
                <img src="https://picsum.photos/seed/training-bg/1920/1080" alt="Training Background" className="absolute top-0 left-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/70"></div>
                <div className="relative z-10 container mx-auto px-4">
                    <AnimatedSection>
                        <h1 className="text-5xl font-bold">Shield Agency Training Academy</h1>
                        <p className="text-xl mt-2 text-accent-gold">Creating the Next Generation of Elite Security Professionals.</p>
                    </AnimatedSection>
                </div>
            </header>

            <div className="container mx-auto px-4">
                <section className="py-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <AnimatedSection>
                            <img src="https://securityguardtraininghq.co.za/wp-content/uploads/2025/04/Security-guard-training-courses.webp" alt="Security Guard Training Courses" className="rounded-lg shadow-2xl w-full"/>
                        </AnimatedSection>
                         <AnimatedSection delay="delay-300">
                             <h2 className="text-4xl font-bold mb-4 text-highlight-blue">Beyond the Standard</h2>
                             <p className="text-gray-300 leading-relaxed mb-4">Our training program is designed to forge not just guards, but true protectors. We combine classroom theory with intense, practical, scenario-based drills to ensure our graduates are prepared for any situation. The Shield Agency certification is a mark of distinction in the security industry.</p>
                             <p className="text-gray-300 leading-relaxed"><strong>Duration:</strong> 12 Weeks comprehensive training. <br/><strong>Certification:</strong> Graduates receive multiple state and national certifications, including advanced first aid and defensive tactics.</p>
                        </AnimatedSection>
                    </div>
                </section>

                <section className="py-16">
                     <AnimatedSection>
                        <h2 className="text-4xl font-bold text-center mb-12">Course <span className="text-highlight-blue">Modules</span></h2>
                    </AnimatedSection>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {modules.map((module, index) => (
                             <AnimatedSection key={index} delay={`delay-${(index % 3) * 150}`}>
                                <div className="bg-glass-bg border border-white/10 p-6 rounded-lg h-full">
                                    <ShieldCheckIcon className="w-8 h-8 text-accent-gold mb-4" />
                                    <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                                    <p className="text-gray-400">{module.description}</p>
                                </div>
                            </AnimatedSection>
                        ))}
                    </div>
                </section>
                
                 <AnimatedSection>
                    <section className="text-center py-16 my-8 bg-glass-bg border border-white/10 rounded-lg">
                        <h2 className="text-3xl font-bold mb-4">Ready to Join the Elite?</h2>
                        <p className="max-w-2xl mx-auto text-gray-300 mb-8">Take the first step towards a rewarding career in high-level security. We are looking for dedicated individuals with integrity and a commitment to excellence.</p>
                        <Button onClick={() => setPage('Careers', 'apply')} variant="secondary">Enroll Now</Button>
                    </section>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default TrainingPage;