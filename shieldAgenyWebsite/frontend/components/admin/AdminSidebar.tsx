

import React from 'react';
import { AdminSection, Page } from '../../types';
import { ADMIN_SIDEBAR_LINKS, SettingsIcon, LogOutIcon } from '../../constants';

interface AdminSidebarProps {
    activeSection: AdminSection;
    setActiveSection: (section: AdminSection) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setPage: (page: Page) => void;
    onLogout: () => void;
}

const CompanyLogo: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <div onClick={onClick} className="flex items-center space-x-3 cursor-pointer flex-shrink-0 p-4">
        <div className="bg-accent-gold p-2 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
        </div>
        <div>
            <span className="text-white text-lg font-bold tracking-wider block leading-tight">SHIELD</span>
            <span className="text-accent-gold text-xs font-semibold tracking-widest block leading-tight">AGENCY</span>
        </div>
    </div>
);

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeSection, setActiveSection, isOpen, setIsOpen, setPage, onLogout }) => {
    
    const handleNavigation = (section: AdminSection) => {
        setActiveSection(section);
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    return (
        <>
            <div 
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/30 backdrop-blur-xl border-r border-white/10 flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
            >
                <CompanyLogo onClick={() => setPage('Home')} />
                
                <nav className="flex-1 px-4 py-4 space-y-2">
                    {ADMIN_SIDEBAR_LINKS.map(({ label, icon: Icon }) => (
                        <button
                            key={label}
                            onClick={() => handleNavigation(label)}
                            className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                                activeSection === label 
                                ? 'bg-accent-gold text-primary-black shadow-lg shadow-accent-gold/20' 
                                : 'text-gray-300 hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            <Icon className={`w-5 h-5 mr-3 transition-colors ${activeSection === label ? 'text-primary-black' : 'text-gray-400 group-hover:text-accent-gold'}`} />
                            <span>{label}</span>
                        </button>
                    ))}
                </nav>

                <div className="px-4 py-4 border-t border-white/10 space-y-2">
                     <button
                        onClick={() => handleNavigation('Settings')}
                        className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                            activeSection === 'Settings' 
                            ? 'bg-accent-gold text-primary-black shadow-lg shadow-accent-gold/20' 
                            : 'text-gray-300 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <SettingsIcon className={`w-5 h-5 mr-3 transition-colors ${activeSection === 'Settings' ? 'text-primary-black' : 'text-gray-400 group-hover:text-accent-gold'}`} />
                        <span>Settings</span>
                    </button>
                    <button onClick={onLogout} className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white rounded-lg group">
                        <LogOutIcon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-accent-gold" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
            {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsOpen(false)}></div>}
        </>
    );
};

export default AdminSidebar;