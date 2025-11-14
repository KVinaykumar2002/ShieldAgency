

import React, { useState, useEffect } from 'react';
import { AdminSection, Page } from '../../types';
import { roleStorage } from '../../utils/api';

import AdminSidebar from '../admin/AdminSidebar';
import AdminHeader from '../admin/AdminHeader';
import DashboardOverview from '../admin/DashboardOverview';
import ManageGuards from '../admin/ManageGuards';
import TrainingManagement from '../admin/TrainingManagement';
import CustomerManagement from '../admin/CustomerManagement';
import CertificationsManagement from '../admin/CertificationsManagement';
import GalleryManagement from '../admin/GalleryManagement';
import JobApplications from '../admin/JobApplications';
import WebsiteEnquiries from '../admin/WebsiteEnquiries';
import Settings from '../admin/Settings';

interface AdminDashboardProps {
    setPage: (page: Page) => void;
    onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setPage, onLogout }) => {
    const [activeSection, setActiveSection] = useState<AdminSection>('Dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Verify admin access on mount and verify with backend
    useEffect(() => {
        const verifyAdminAccess = async () => {
            const role = roleStorage.getRole();
            if (role !== 'admin') {
                // User is not an admin, redirect to home
                onLogout();
                setPage('Home');
                return;
            }

            // Double-check with backend to prevent role tampering
            try {
                const { authAPI } = await import('../../utils/api');
                const response = await authAPI.adminGetMe();
                if (!response.data || response.data.role !== 'admin') {
                    // Backend says user is not admin, clear everything
                    onLogout();
                    setPage('Home');
                }
            } catch (error) {
                // If backend verification fails, assume unauthorized
                onLogout();
                setPage('Home');
            }
        };

        verifyAdminAccess();
    }, [setPage, onLogout]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const renderSection = () => {
        switch (activeSection) {
            case 'Dashboard': return <DashboardOverview />;
            case 'Guards': return <ManageGuards />;
            case 'Training': return <TrainingManagement />;
            case 'Customers': return <CustomerManagement />;
            case 'Certifications': return <CertificationsManagement />;
            case 'Gallery': return <GalleryManagement />;
            case 'Applications': return <JobApplications />;
            case 'Enquiries': return <WebsiteEnquiries />;
            case 'Settings': return <Settings />;
            default: return <DashboardOverview />;
        }
    };

    return (
        <div className="bg-gradient-to-br from-primary-black to-[#1a1a1a] min-h-screen text-white font-sans flex relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
            <AdminSidebar 
                activeSection={activeSection} 
                setActiveSection={setActiveSection}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
                setPage={setPage}
                onLogout={onLogout}
            />
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
                <AdminHeader 
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
                    isSidebarOpen={isSidebarOpen} 
                    onLogout={onLogout}
                />
                <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                    {renderSection()}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;