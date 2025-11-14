

import React from 'react';
import { MenuIcon, LogOutIcon, SettingsIcon } from '../../constants';
import companyLogo from '../../src/assets/Logo.png';

interface AdminHeaderProps {
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
    onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar, isSidebarOpen, onLogout }) => {
    return (
        <header className="sticky top-0 z-40">
             <div className="px-4 sm:px-6 lg:px-8 mt-4">
                <div className="flex items-center justify-between h-16 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl px-4 shadow-lg">
                    <div className="flex items-center">
                        <button
                            onClick={toggleSidebar}
                            className="text-gray-300 hover:text-white lg:hidden mr-2"
                            aria-label="Toggle sidebar"
                        >
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <img src={companyLogo} alt="Shield Agency Logo" className="h-10 w-auto object-contain hidden sm:block mr-3" />
                        <h1 className="text-xl font-semibold text-white tracking-wider">
                            Admin <span className="text-accent-gold">Dashboard</span>
                        </h1>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="relative group">
                             <img
                                className="h-10 w-10 rounded-full border-2 border-accent-gold object-cover cursor-pointer"
                                src="https://picsum.photos/seed/admin/100/100"
                                alt="Admin Profile"
                            />
                            <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-800/80 backdrop-blur-lg border border-zinc-700 rounded-xl shadow-2xl p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                                <a href="#" className="flex items-center w-full text-left px-4 py-2 text-gray-200 rounded-md hover:bg-highlight-blue/50 hover:text-white transition-colors duration-200 text-sm">
                                    <SettingsIcon className="w-4 h-4 mr-2" />
                                    Settings
                                </a>
                                <button onClick={onLogout} className="flex items-center w-full text-left px-4 py-2 text-gray-200 rounded-md hover:bg-highlight-blue/50 hover:text-white transition-colors duration-200 text-sm">
                                    <LogOutIcon className="w-4 h-4 mr-2" />
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