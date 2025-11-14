

import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface AnimatedSectionProps {
    children: ReactNode;
    className?: string;
    delay?: string;
    scrollRoot?: React.RefObject<HTMLElement>;
    animation?: 'slide-in-from-bottom' | 'slide-in-from-left' | 'slide-in-from-right';
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '', delay = 'delay-100', scrollRoot, animation = 'slide-in-from-bottom' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: scrollRoot?.current || null,
                threshold: 0.1,
            }
        );

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [scrollRoot]);

    const getAnimationClasses = () => {
        if (isVisible) {
            return 'opacity-100 translate-y-0 translate-x-0';
        }
        switch (animation) {
            case 'slide-in-from-left':
                return 'opacity-0 -translate-x-4';
            case 'slide-in-from-right':
                return 'opacity-0 translate-x-4';
            case 'slide-in-from-bottom':
            default:
                return 'opacity-0 translate-y-10';
        }
    };

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${delay} ${getAnimationClasses()} ${className}`}
        >
            {children}
        </div>
    );
};

export default AnimatedSection;