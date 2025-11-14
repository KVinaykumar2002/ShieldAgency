

import React, { useState } from 'react';
import { Page } from '../types';
import { NAV_LINKS, FacebookIcon, YoutubeIcon, LinkedinIcon, GithubIcon } from '../constants';
import companyLogo from '../src/assets/Logo.png';

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
        <footer className="bg-black text-white pt-20 pb-10 px-4">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Brand and Subscribe */}
                    <div>
                        <button
                            onClick={() => setPage('Home')}
                            className="flex items-center space-x-2 cursor-pointer mb-4 bg-transparent border-0 p-0"
                            aria-label="Shield Agency Home"
                        >
                            <img
                                src={companyLogo}
                                alt="Shield Agency Logo"
                                className="h-12 w-auto object-contain drop-shadow-md"
                            />
                            <span className="text-2xl font-bold">Shield Agency</span>
                        </button>
                        <p className="text-gray-400 text-sm mb-6">
                            Shield Agency is the practice of protecting people, property, and assets from physical threats and unauthorized access.
                        </p>
                        <h3 className="font-bold text-lg mb-2 text-white">Get In Touch</h3>
                        <form onSubmit={handleSubscribe}>
                            <div className="flex items-center border border-accent-purple rounded-full p-1 focus-within:ring-2 focus-within:ring-accent-purple transition-all">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email address"
                                    required
                                    className="bg-transparent w-full py-1 px-4 text-white placeholder-gray-500 focus:outline-none"
                                />
                                <button type="submit" className="bg-accent-purple rounded-full px-5 py-2 text-sm font-semibold hover:bg-purple-500 transition-colors flex-shrink-0">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Column 2: Company Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Company</h3>
                        <ul className="space-y-3">
                           {NAV_LINKS.slice(0,4).map(link => (
                               <li key={link.label}>
                                   <button onClick={() => setPage(link.page, link.subItems?.[0]?.subPageId)} className="text-gray-300 hover:text-white transition-colors">
                                       {link.label}
                                   </button>
                               </li>
                           ))}
                        </ul>
                    </div>

                    {/* Column 3: Services Links */}
                    <div>
                        <ul className="space-y-3">
                            {NAV_LINKS.find(l => l.page === 'Services')?.subItems?.map(sub => (
                                 <li key={sub.label}>
                                   <button onClick={() => setPage(sub.page, sub.subPageId)} className="text-gray-300 hover:text-white transition-colors">
                                       {sub.label}
                                   </button>
                               </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact and Socials */}
                    <div>
                        <h3 className="font-bold text-lg mb-4">Contact</h3>
                        <ul className="space-y-3 text-gray-300">
                            <li><a href="tel:555-123-4567" className="hover:text-white transition-colors underline">+91-9886668368</a></li>
                            <li><a href="mailto:contact@securityagency.com" className="hover:text-white transition-colors underline">shieldagency01@gmail.com</a></li>
                            <li>Chennamma circle, Shop No 7 3rd Floor Tirumala Trade centre, <li> Neeligin Rd, Hubballi, </li>Karnataka 580029<br />Metro City</li>
                        </ul>
                        <div className="flex space-x-4 mt-6">
                           <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors"><FacebookIcon /></a>
                           <a href="#" aria-label="Youtube" className="text-gray-400 hover:text-white transition-colors"><YoutubeIcon /></a>
                           <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors"><LinkedinIcon /></a>
                           <a href="#" aria-label="Github" className="text-gray-400 hover:text-white transition-colors"><GithubIcon /></a>
                        </div>
                    </div>
                </div>

                {/* Large Brand Name */}
                <div className="text-center my-16">
                    <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter text-white opacity-90">
                        Shield Agency
                    </h1>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 pt-8 text-center text-gray-500 text-sm space-y-2">
                    <p>&copy; {new Date().getFullYear()} Shield Agency. All Rights Reserved.</p>
                    <p className="text-gray-400">Developed by <span className="text-accent-gold font-semibold">OptiWebrix Team</span></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;