import React, { useState, useRef, useEffect } from 'react';
import { Page } from '../types';
import { NAV_LINKS } from '../constants';
import Button from './ui/Button';
import { roleStorage } from '../utils/api';

const CompanyLogo: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-shrink-0 bg-transparent border-0 p-0"
        aria-label="Shield Agency Home"
    >
        <img
            src="/image.png"
            alt="Shield Agency Logo"
            className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain drop-shadow-lg"
        />
    </button>
);

interface HeaderProps {
    activePage: Page;
    setPage: (page: Page, subPageId?: string) => void;
    isAuthenticated: boolean;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ activePage, setPage, isAuthenticated, onLogout }) => {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const leaveTimeout = useRef<number | null>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        if (isUserMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isUserMenuOpen]);
    
    const handleLinkClick = (page: Page, subPageId?: string) => {
        setPage(page, subPageId);
        setIsMobileMenuOpen(false);
        setOpenDropdown(null);
    };
    
    const handleMouseEnter = (label: string) => {
        if (leaveTimeout.current) clearTimeout(leaveTimeout.current);
        setOpenDropdown(label);
    };

    const handleMouseLeave = () => {
        leaveTimeout.current = window.setTimeout(() => setOpenDropdown(null), 200);
    };
    
    const MobileNavLinks = () => (
        <ul className="flex flex-col space-y-1 sm:space-y-2">
            {NAV_LINKS.map((item) => (
                <li key={item.label} className="border-b border-zinc-700 last:border-b-0">
                    {item.subItems ? (
                        <>
                            <button
                                className="w-full flex justify-between items-center py-2.5 sm:py-3 text-white font-medium text-sm sm:text-base"
                                onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                            >
                                {item.label}
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 ${openDropdown === item.label ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            <div className={`pl-3 sm:pl-4 overflow-hidden transition-all duration-300 ease-in-out ${openDropdown === item.label ? 'max-h-[600px]' : 'max-h-0'}`}>
                                <ul className="py-1.5 sm:py-2 space-y-0.5 sm:space-y-1">
                                    {item.subItems.map((sub, index) => (
                                        <li key={sub.label}>
                                            {sub.isCategory && index > 0 && (
                                                <div className="border-t border-zinc-600/50 my-1.5 sm:my-2"></div>
                                            )}
                                            <button 
                                                onClick={() => handleLinkClick(sub.page, sub.subPageId)} 
                                                className={`w-full text-left transition-colors duration-200 text-xs sm:text-sm ${
                                                    sub.isCategory 
                                                        ? 'text-accent-gold font-semibold hover:text-accent-gold py-1.5 sm:py-2' 
                                                        : 'text-gray-300 hover:text-accent-gold pl-3 sm:pl-4 py-1 sm:py-1.5'
                                                }`}
                                            >
                                                {sub.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <button onClick={() => handleLinkClick(item.page)} className="w-full text-left py-2.5 sm:py-3 text-white font-medium text-sm sm:text-base">
                            {item.label}
                        </button>
                    )}
                </li>
            ))}
        </ul>
    );

    return (
        <header className="fixed top-0 left-0 w-full z-50 p-1.5 sm:p-2 md:p-4">
            <nav className={`w-full max-w-7xl mx-auto flex items-center justify-between p-1.5 sm:p-2 md:p-3 bg-zinc-900 border border-white/10 transition-all duration-500 ease-in-out ${isScrolled ? 'rounded-[12px] sm:rounded-[20px] md:rounded-[30px] shadow-2xl shadow-black/60' : 'rounded-md sm:rounded-lg md:rounded-xl'}`}>
                <CompanyLogo onClick={() => handleLinkClick('Home')} />

                <div className="hidden lg:flex items-center space-x-2">
                    {NAV_LINKS.map((item) => (
                        <div key={item.label} className="relative" onMouseEnter={() => handleMouseEnter(item.label)} onMouseLeave={handleMouseLeave}>
                            <button
                                onClick={() => handleLinkClick(item.page, item.subItems?.[0]?.subPageId)}
                                className={`flex items-center px-4 py-2 rounded-full text-base font-semibold transition-colors duration-300 ${activePage === item.page ? 'text-accent-gold' : 'text-gray-200 hover:text-white'}`}
                            >
                                {item.label}
                                {item.subItems && <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>}
                            </button>
                            {item.subItems && (
                                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 sm:pt-4 transition-all duration-300 ${openDropdown === item.label ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                                    <ul className="bg-zinc-800/95 backdrop-blur-lg border border-zinc-700 rounded-lg sm:rounded-xl shadow-2xl p-1.5 sm:p-2 min-w-[200px] sm:min-w-[220px] max-w-[90vw] max-h-[80vh] overflow-y-auto">
                                        {item.subItems.map((sub, index) => (
                                            <li key={sub.label}>
                                                {sub.isCategory && index > 0 && (
                                                    <div className="border-t border-zinc-600/50 my-1"></div>
                                                )}
                                                <button 
                                                    onClick={() => handleLinkClick(sub.page, sub.subPageId)} 
                                                    className={`w-full text-left px-3 sm:px-4 py-1.5 sm:py-2 rounded-md transition-colors duration-200 text-xs sm:text-sm ${
                                                        sub.isCategory 
                                                            ? 'text-accent-gold font-semibold hover:bg-accent-gold/20 hover:text-accent-gold' 
                                                            : 'text-gray-200 hover:bg-highlight-blue/50 hover:text-white pl-6 sm:pl-8'
                                                    }`}
                                                >
                                                    {sub.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="hidden lg:flex items-center">
                    {isAuthenticated ? (
                         <div ref={userMenuRef} className="flex items-center space-x-2 ml-4 relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:ring-offset-transparent rounded-full"
                            >
                                <img src="https://picsum.photos/seed/admin/100/100" alt="User" className="w-10 h-10 rounded-full border-2 border-accent-gold cursor-pointer"/>
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-800/95 backdrop-blur-lg border border-zinc-700 rounded-xl shadow-2xl p-2 z-[100]">
                                    {(() => {
                                        const role = roleStorage.getRole();
                                        // Only show Dashboard for admins - double check to prevent users from seeing it
                                        if (role === 'admin') {
                                            return (
                                                <button 
                                                    onClick={() => {
                                                        // Additional safety check before navigation
                                                        const currentRole = roleStorage.getRole();
                                                        if (currentRole === 'admin') {
                                                            handleLinkClick('Admin');
                                                        } else {
                                                            // If role changed, redirect to home
                                                            handleLinkClick('Home');
                                                        }
                                                        setIsUserMenuOpen(false);
                                                    }} 
                                                    className="w-full text-left px-4 py-2 text-gray-200 rounded-md hover:bg-highlight-blue/50 hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                                                >
                                                    Dashboard
                                                </button>
                                            );
                                        }
                                        // For regular users, show a profile/home option instead
                                        return (
                                            <button 
                                                onClick={() => {
                                                    handleLinkClick('Home');
                                                    setIsUserMenuOpen(false);
                                                }} 
                                                className="w-full text-left px-4 py-2 text-gray-200 rounded-md hover:bg-highlight-blue/50 hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                                            >
                                                Home
                                            </button>
                                        );
                                    })()}
                                    <button 
                                        onClick={() => {
                                            onLogout();
                                            setIsUserMenuOpen(false);
                                        }} 
                                        className="w-full text-left px-4 py-2 text-gray-200 rounded-md hover:bg-highlight-blue/50 hover:text-white transition-colors duration-200 text-sm cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Button onClick={() => handleLinkClick('Login')} variant="secondary" className="ml-4 !px-6 !py-2">Login</Button>
                    )}
                </div>
                
                <div className="lg:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-1.5 sm:p-2 mr-0.5 sm:mr-1 focus:outline-none focus:ring-2 focus:ring-accent-gold rounded-md">
                         <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path></svg>
                    </button>
                </div>
            </nav>

            <div className={`lg:hidden absolute top-[calc(100%+0.25rem)] sm:top-[calc(100%+0.5rem)] left-0 w-full px-2 sm:px-4 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'}`}>
                 <div className="p-2.5 sm:p-3 md:p-4 bg-zinc-900/95 backdrop-blur-xl border border-zinc-700 rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl shadow-black/30 max-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-120px)] overflow-y-auto">
                    <MobileNavLinks />
                 </div>
            </div>
        </header>
    );
};

export default Header;