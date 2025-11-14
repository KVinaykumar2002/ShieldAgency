import React, { useState, useEffect } from 'react';
import { Page } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/pages/HomePage';
import AboutPage from './components/pages/AboutPage';
import ServicesPage from './components/pages/ServicesPage';
import TrainingPage from './components/pages/TrainingPage';
import CustomersPage from './components/pages/CustomersPage';
import CertificationsPage from './components/pages/CertificationsPage';
import CareersPage from './components/pages/CareersPage';
import ContactPage from './components/pages/ContactPage';
import AdminDashboard from './components/pages/AdminDashboard';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import WhatsAppButton from './components/WhatsAppButton';
import { authAPI, tokenStorage, roleStorage } from './utils/api';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('Home');
    const [activeSubPage, setActiveSubPage] = useState<string | null>(null);
    const [isFading, setIsFading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [forceAdminLogin, setForceAdminLogin] = useState(false);

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = tokenStorage.getToken();
            if (token) {
                try {
                    const response = await authAPI.getMe();
                    setIsAuthenticated(true);
                    // Store role if available
                    if (response.data?.role) {
                        roleStorage.setRole(response.data.role);
                    }
                } catch (error) {
                    // Token is invalid, remove it
                    tokenStorage.removeToken();
                    roleStorage.removeRole();
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
            }
            setIsCheckingAuth(false);
        };
        checkAuth();
    }, []);

    const handleLoginSuccess = () => {
        setIsAuthenticated(true);
        // Check role and redirect accordingly
        const role = roleStorage.getRole();
        if (role === 'admin' || forceAdminLogin) {
            setForceAdminLogin(false);
            handlePageChange('Admin');
        } else {
            // Regular users go to Home page after login
            handlePageChange('Home');
        }
    };

    const handleLogout = () => {
        authAPI.logout();
        setIsAuthenticated(false);
        handlePageChange('Home');
    };

    const handlePageChange = (page: Page, subPageId?: string) => {
        if (page === 'Admin') {
            // Strict check: Only allow admin access
            const role = roleStorage.getRole();
            if (!isAuthenticated || role !== 'admin') {
                // User tried to access admin - redirect to home instead of login
                console.warn('Unauthorized access attempt to admin dashboard');
                setCurrentPage('Home');
                setActiveSubPage(null);
                setIsFading(false);
                return;
            }
        }
        
        if (page === 'Login') {
            setForceAdminLogin(false);
        }

        // If clicking the same link again, do nothing
        if (page === currentPage && subPageId === activeSubPage) return;

        // If on the same page, but clicking a different sub-item, just update state to trigger scroll
        if (page === currentPage && subPageId && subPageId !== activeSubPage) {
            setActiveSubPage(subPageId);
            return;
        }

        setIsFading(true);
        setTimeout(() => {
            setCurrentPage(page);
            setActiveSubPage(subPageId || null);
            setIsFading(false);
        }, 300);
    };
    
    useEffect(() => {
        // Initial fade-in
        setIsFading(true);
        const timer = setTimeout(() => setIsFading(false), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // This effect handles scrolling for both page changes and same-page sub-item navigation.

        // If it's a new page (fading), wait for fade-in to complete.
        if (isFading) return;

        // If there's a sub-page ID, scroll to it.
        if (activeSubPage) {
            const element = document.getElementById(activeSubPage);
            if (element) {
                // setTimeout ensures element is painted after state updates.
                setTimeout(() => {
                    const header = document.querySelector('header > nav');
                    const headerHeight = header ? header.getBoundingClientRect().height : 100;
                    const y = element.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }, 50);
            } else {
                // Fallback to top if element not found
                window.scrollTo(0, 0);
            }
        } else {
            // If no sub-page, scroll to top.
            window.scrollTo(0, 0);
        }
    }, [currentPage, activeSubPage, isFading]);

    const renderPublicPage = () => {
        switch (currentPage) {
            case 'Home':
                return <HomePage setPage={handlePageChange} />;
            case 'About':
                return <AboutPage subPageId={activeSubPage || 'journey'} />;
            case 'Services':
                return <ServicesPage />;
            case 'Training':
                return <TrainingPage setPage={handlePageChange} />;
            case 'Gallery':
                return <CertificationsPage />;
            case 'Careers':
                return <CareersPage subPageId={activeSubPage || 'openings'} setPage={handlePageChange} isAuthenticated={isAuthenticated} />;
            case 'Contact':
                return <ContactPage />;
            default:
                return <HomePage setPage={handlePageChange} />;
        }
    };

    // Verify admin access when on Admin page
    useEffect(() => {
        if (currentPage === 'Admin') {
            const verifyAdmin = async () => {
                const role = roleStorage.getRole();
                if (!isAuthenticated || role !== 'admin') {
                    setForceAdminLogin(true);
                    handlePageChange('Login');
                    return;
                }
                
                // Additional verification: Check with backend to prevent role tampering
                try {
                    const response = await authAPI.adminGetMe();
                    if (!response.data || response.data.role !== 'admin') {
                        handleLogout();
                        handlePageChange('Home');
                    }
                } catch (error) {
                    // Backend verification failed - user is not admin
                    handleLogout();
                    handlePageChange('Home');
                }
            };
            
            verifyAdmin();
        }
    }, [currentPage, isAuthenticated, handlePageChange, handleLogout]);

    if (currentPage === 'Admin') {
        // Double-check: Ensure only admins can access admin dashboard
        const role = roleStorage.getRole();
        if (!isAuthenticated || role !== 'admin') {
            // Redirect to login if not admin
            setForceAdminLogin(true);
            setCurrentPage('Login');
            return <LoginPage setPage={handlePageChange} onLoginSuccess={handleLoginSuccess} isAdmin={true} />;
        }
        
        return <AdminDashboard setPage={handlePageChange} onLogout={handleLogout} />;
    }
    
    if (currentPage === 'Login') {
        return <LoginPage setPage={handlePageChange} onLoginSuccess={handleLoginSuccess} isAdmin={forceAdminLogin} />;
    }

    if (currentPage === 'SignUp') {
        return <SignUpPage setPage={handlePageChange} onLoginSuccess={handleLoginSuccess} />;
    }

    // Show loading state while checking authentication
    if (isCheckingAuth) {
        return (
            <div className="bg-primary-black min-h-screen flex items-center justify-center">
                <div className="text-white text-lg">Loading...</div>
            </div>
        );
    }


    return (
        <div className="bg-primary-black min-h-screen relative">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
            <div className="relative z-10">
                <Header activePage={currentPage} setPage={handlePageChange} isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <main className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                    {renderPublicPage()}
                </main>
                <Footer setPage={handlePageChange} />
                {/* WhatsApp Button - Shows on all public user pages */}
                <WhatsAppButton />
            </div>
        </div>
    );
};

export default App;