

import React, { useState } from 'react';
import { Page } from '../types';
import { NAV_LINKS, FacebookIcon, YoutubeIcon, LinkedinIcon, GithubIcon } from '../constants';

interface FooterProps {
    setPage: (page: Page, subPageId?: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setPage }) => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for subscription logic
        console.log(`Subscribing ${email}`);
        alert(`Thank you for subscribing, ${email}!`);
        setEmail('');
    };

    return (
        <footer className="bg-black text-white pt-12 sm:pt-16 md:pt-20 pb-8 sm:pb-10 px-4 relative overflow-hidden">
            {/* Background Logo */}
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
                style={{
                    backgroundImage: 'url(/LOGO-03.png)',
                    backgroundSize: 'contain',
                    backgroundPosition: 'center',
                }}
            />
            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-black/50" />
            
            <div className="container mx-auto relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 mb-12 sm:mb-16">
                    {/* Column 1: Brand and Subscribe */}
                    <div>
                        <button
                            onClick={() => setPage('Home')}
                            className="flex items-center space-x-2 cursor-pointer mb-4 bg-transparent border-0 p-0"
                            aria-label="Shield Agency Home"
                        >
                            <img
                                src="/LOGO-02.png"
                                alt="Shield Agency Logo"
                                className="h-10 sm:h-12 w-auto object-contain drop-shadow-md"
                            />
                            <span className="text-xl sm:text-2xl font-bold"></span>
                        </button>
                        <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 md:mb-6 leading-relaxed">
                            Shield Agency is the practice of protecting people, property, and assets from physical threats and unauthorized access.
                        </p>
                        <h3 className="font-bold text-sm sm:text-base md:text-lg mb-2 text-white">Get In Touch</h3>
                        <form onSubmit={handleSubscribe}>
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center border border-accent-purple rounded-full p-0.5 sm:p-1 focus-within:ring-2 focus-within:ring-accent-purple transition-all gap-2 sm:gap-0">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    required
                                    className="bg-transparent w-full py-1.5 sm:py-2 md:py-1 px-2 sm:px-3 md:px-4 text-xs sm:text-sm md:text-base text-white placeholder-gray-500 focus:outline-none"
                                />
                                <button type="submit" className="bg-accent-purple rounded-full px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold hover:bg-purple-500 transition-colors flex-shrink-0 whitespace-nowrap">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Column 2: Company Links */}
                    <div>
                        <h3 className="font-bold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4">Company</h3>
                        <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
                           {NAV_LINKS.slice(0,4).map(link => (
                               <li key={link.label}>
                                   <button onClick={() => setPage(link.page, link.subItems?.[0]?.subPageId)} className="text-gray-300 hover:text-white transition-colors text-xs sm:text-sm md:text-base">
                                       {link.label}
                                   </button>
                               </li>
                           ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact and Socials */}
                    <div>
                        <h3 className="font-bold text-sm sm:text-base md:text-lg mb-2 sm:mb-3 md:mb-4">Contact</h3>
                        <ul className="space-y-2 sm:space-y-2.5 md:space-y-3 text-gray-300">
                            <li className="text-xs sm:text-sm md:text-base"><a href="tel:+91-9886668368" className="hover:text-white transition-colors underline break-all">+91-9886668368</a></li>
                            <li className="text-xs sm:text-sm md:text-base"><a href="mailto:shieldagency01@gmail.com" className="hover:text-white transition-colors underline break-all">shieldagency01@gmail.com</a></li>
                            <li className="leading-relaxed text-xs sm:text-sm md:text-base">
                            Shop No. 7, 3rd Floor,<br/> 
                            Tirumala Trade Centre, Neeligin Road, Traffic Island,<br/>
                            Hubli - 580 029, Karnataka
                            </li>
                        </ul>
                        <div className="flex space-x-3 sm:space-x-4 mt-4 sm:mt-5 md:mt-6">
                           <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors"><FacebookIcon className="w-4 h-4 sm:w-5 sm:h-5" /></a>
                           <a href="#" aria-label="Youtube" className="text-gray-400 hover:text-white transition-colors"><YoutubeIcon className="w-4 h-4 sm:w-5 sm:h-5" /></a>
                           <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors"><LinkedinIcon className="w-4 h-4 sm:w-5 sm:h-5" /></a>
                           <a href="#" aria-label="Github" className="text-gray-400 hover:text-white transition-colors"><GithubIcon className="w-4 h-4 sm:w-5 sm:h-5" /></a>
                        </div>
                    </div>
                </div>

                {/* Large Brand Name */}
                <div className="text-center my-6 sm:my-8 md:my-12 lg:my-16">
                    <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tighter text-white opacity-90 px-2">
                        Shield Agency
                    </h1>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 pt-4 sm:pt-6 md:pt-8 text-center text-gray-500 text-xs sm:text-sm space-y-1 sm:space-y-2 px-2">
                    <p>&copy; {new Date().getFullYear()} Shield Agency. All Rights Reserved.</p>
                    {/* ,<p className="text-gray-400">Developed by <span className="text-accent-gold font-semibold">OptiWebrix Team</span></p> */}
                </div>
            </div>
        </footer>
    );
};

export default Footer;