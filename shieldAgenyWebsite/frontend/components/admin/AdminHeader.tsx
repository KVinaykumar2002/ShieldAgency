

import React from 'react';
import { MenuIcon, LogOutIcon, SettingsIcon } from '../../constants';
import companyLogo from '../../src/assets/Logo.png';

interface AdminHeaderProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
    onLogout: () => void;
    avatar?: string | null;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar, isSidebarOpen, onLogout, avatar }) => {
    return (
        <header className="sticky top-0 z-40">
             <div className="px-2 sm:px-4 lg:px-6 xl:px-8 mt-2 sm:mt-4">
                <div className="flex items-center justify-between h-14 sm:h-16 bg-white/5 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl px-3 sm:px-4 shadow-lg">
                    <div className="flex items-center min-w-0 flex-1">
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-300 hover:text-white lg:hidden mr-2 sm:mr-3 flex-shrink-0 p-1 rounded-md hover:bg-white/10 transition-colors touch-manipulation"
                            aria-label="Toggle sidebar"
                        >
                            <MenuIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </button>
                        <img 
                            src={companyLogo} 
                            alt="Shield Agency Logo" 
                            className="h-8 sm:h-10 w-auto object-contain hidden sm:block mr-2 sm:mr-3 flex-shrink-0" 
                        />
                        <h1 className="text-base sm:text-xl font-semibold text-white tracking-wider truncate">
                            Admin <span className="text-accent-gold">Dashboard</span>
                        </h1>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                        <div className="relative group">
                             <img
                                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border-2 border-accent-gold object-cover cursor-pointer hover:border-accent-gold/80 transition-colors"
                                src={avatar ? (avatar.startsWith('http') ? avatar : `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://shieldagency.onrender.com'}${avatar}`) : 'https://ui-avatars.com/api/?name=Admin&background=random&color=fff&size=100'}
                                alt="Admin Profile"
                            />
                            <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-800/95 backdrop-blur-lg border border-zinc-700 rounded-xl shadow-2xl p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
                                <button 
                                    onClick={() => {/* Navigate to settings */}} 
                                    className="flex items-center w-full text-left px-4 py-2 text-gray-200 rounded-md hover:bg-highlight-blue/50 hover:text-white transition-colors duration-200 text-sm touch-manipulation"
                                >
                                    <SettingsIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                    Settings
                                </button>
                                <button 
                                    onClick={onLogout} 
                                    className="flex items-center w-full text-left px-4 py-2 text-gray-200 rounded-md hover:bg-highlight-blue/50 hover:text-white transition-colors duration-200 text-sm touch-manipulation"
                                >
                                    <LogOutIcon className="w-4 h-4 mr-2 flex-shrink-0" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;