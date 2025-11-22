import React, { useState, useEffect, useRef } from 'react';
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
import MailButton from './components/MailButton';
import WelcomePopupForm from './components/WelcomePopupForm';
import { authAPI, roleStorage } from './utils/api';

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<Page>('Home');
    const [activeSubPage, setActiveSubPage] = useState<string | null>(null);
    const [highlightedServiceId, setHighlightedServiceId] = useState<string | null>(null);
    const [isFading, setIsFading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [forceAdminLogin, setForceAdminLogin] = useState(false);
    const [showWelcomePopup, setShowWelcomePopup] = useState(false);
    const [userAvatar, setUserAvatar] = useState<string | null>(null);
    const highlightTimeoutRef = useRef<number | null>(null);
    const scrollCheckIntervalRef = useRef<number | null>(null);

    // Check authentication on mount
    useEffect(() => {
        const checkAuth = async () => {
            const role = roleStorage.getRole();
            if (role) {
                try {
                    const response = await authAPI.getMe();
                    setIsAuthenticated(true);
                    // Store role if available
                    if (response.data?.role) {
                        roleStorage.setRole(response.data.role);
                    }
                    // Store email if available
                    if (response.data?.email) {
                        roleStorage.setEmail(response.data.email);
                    }
                    // Store avatar if available
                    if (response.data?.avatar) {
                        setUserAvatar(response.data.avatar);
                    } else {
                        setUserAvatar(null);
                    }
                } catch (error) {
                    // Auth check failed - don't crash, just set as not authenticated
                    console.error('Auth check failed:', error);
                    roleStorage.removeRole();
                    setIsAuthenticated(false);
                    setUserAvatar(null);
                }
            } else {
                setIsAuthenticated(false);
                setUserAvatar(null);
            }
            setIsCheckingAuth(false);
        };
        checkAuth();
    }, []);

    // Show welcome popup on Home page for non-logged-in users
    useEffect(() => {
        // Wait for auth check to complete
        if (isCheckingAuth) return;
        
        // Only show on Home page
        if (currentPage !== 'Home') {
            setShowWelcomePopup(false);
            return;
        }
        
        // Only show popup if user is NOT logged in
        if (isAuthenticated) {
            console.log('ℹ️ User is logged in, skipping popup');
            setShowWelcomePopup(false);
            return;
        }
        
        console.log('🔍 Popup check:', { currentPage, isCheckingAuth, isAuthenticated });
        
        // Show popup for non-logged-in users (show every time they visit Home page)
        // Small delay to ensure page is loaded
        const timer = setTimeout(() => {
            console.log('🎉 Showing welcome popup form for non-logged-in user');
            setShowWelcomePopup(true);
        }, 2000); // 2 second delay for better UX
        
        return () => clearTimeout(timer);
    }, [currentPage, isCheckingAuth, isAuthenticated]);

    const handleLoginSuccess = async () => {
        // Check role and redirect accordingly
        const role = roleStorage.getRole();
        setIsAuthenticated(true);
        
        // Fetch user data including avatar
        try {
            const response = await authAPI.getMe();
            if (response.data?.avatar) {
                setUserAvatar(response.data.avatar);
            } else {
                setUserAvatar(null);
            }
            if (response.data?.email) {
                roleStorage.setEmail(response.data.email);
            }
        } catch (error) {
            console.error('Failed to fetch user data after login:', error);
            setUserAvatar(null);
        }
        
        if (role === 'admin' || forceAdminLogin) {
            setForceAdminLogin(false);
            // Directly set to Admin page after login if admin role
            setCurrentPage('Admin');
            setActiveSubPage(null);
            setIsFading(false);
        } else {
            // Regular users go to Home page after login
            handlePageChange('Home');
        }
    };

    const handleLogout = () => {
        authAPI.logout();
        setIsAuthenticated(false);
        setUserAvatar(null);
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
            // Set highlighted service if it's a service page
            if (page === 'Services' && subPageId) {
                setHighlightedServiceId(subPageId);
            }
            return;
        }

        setIsFading(true);
        setTimeout(() => {
            setCurrentPage(page);
            setActiveSubPage(subPageId || null);
            // Set highlighted service if navigating to a service
            if (page === 'Services' && subPageId) {
                setHighlightedServiceId(subPageId);
            } else {
                setHighlightedServiceId(null);
            }
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
        if (activeSubPage && currentPage === 'Services') {
            // Function to attempt scrolling with retries
            const scrollToElement = (retries = 15, delay = 100) => {
                const element = document.getElementById(activeSubPage);
                if (element) {
                    // Element found, scroll to it immediately
                    requestAnimationFrame(() => {
                        const header = document.querySelector('header > nav');
                        const headerHeight = header ? header.getBoundingClientRect().height : 100;
                        const y = element.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    });
                } else if (retries > 0) {
                    // Element not found yet, retry after delay
                    setTimeout(() => scrollToElement(retries - 1, delay), delay);
                } else {
                    // Fallback: scroll to top if element not found after retries
                    console.warn(`Element with id "${activeSubPage}" not found after retries`);
                    window.scrollTo(0, 0);
                }
            };

            // Try immediately first using requestAnimationFrame for better timing
            requestAnimationFrame(() => {
                scrollToElement();
            });
        } else if (activeSubPage) {
            // For other pages with sub-pages, use the original logic
            const element = document.getElementById(activeSubPage);
            if (element) {
                setTimeout(() => {
                    const header = document.querySelector('header > nav');
                    const headerHeight = header ? header.getBoundingClientRect().height : 100;
                    const y = element.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }, 50);
            } else {
                window.scrollTo(0, 0);
            }
        } else {
            // If no sub-page, scroll to top.
            window.scrollTo(0, 0);
        }
    }, [currentPage, activeSubPage, isFading]);

    // Effect to manage highlight timer (5 seconds)
    useEffect(() => {
        if (highlightedServiceId && currentPage === 'Services') {
            // Clear any existing timeout
            if (highlightTimeoutRef.current) {
                clearTimeout(highlightTimeoutRef.current);
            }

            // Set timeout to clear highlight after 5 seconds
            highlightTimeoutRef.current = window.setTimeout(() => {
                setHighlightedServiceId(null);
            }, 5000);

            return () => {
                if (highlightTimeoutRef.current) {
                    clearTimeout(highlightTimeoutRef.current);
                }
            };
        }
    }, [highlightedServiceId, currentPage]);

    // Effect to detect scroll and clear highlight if user scrolls away
    useEffect(() => {
        if (!highlightedServiceId || currentPage !== 'Services') {
            if (scrollCheckIntervalRef.current) {
                clearInterval(scrollCheckIntervalRef.current);
                scrollCheckIntervalRef.current = null;
            }
            return;
        }

        let lastScrollY = window.scrollY;
        let scrollTimeout: number | null = null;

        const checkScroll = () => {
            const element = document.getElementById(highlightedServiceId);
            if (!element) return;

            const rect = element.getBoundingClientRect();
            const header = document.querySelector('header > nav');
            const headerHeight = header ? header.getBoundingClientRect().height : 100;
            const elementTop = rect.top + window.scrollY;
            const viewportTop = window.scrollY;
            const viewportBottom = viewportTop + window.innerHeight;
            const elementBottom = elementTop + rect.height;

            // Check if element is significantly out of viewport (more than 200px)
            const isOutOfView = elementBottom < viewportTop - 200 || elementTop > viewportBottom + 200;

            // Also check if user scrolled significantly
            const scrollDelta = Math.abs(window.scrollY - lastScrollY);
            if (scrollDelta > 50) {
                lastScrollY = window.scrollY;
            }

            // Clear highlight if element is out of view and user has scrolled
            if (isOutOfView && scrollDelta > 50) {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                scrollTimeout = window.setTimeout(() => {
                    setHighlightedServiceId(null);
                }, 300); // Small delay to avoid flickering
            }
        };

        // Check scroll position periodically
        scrollCheckIntervalRef.current = window.setInterval(checkScroll, 100);

        // Also listen to scroll events for immediate response
        const handleScroll = () => {
            checkScroll();
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            if (scrollCheckIntervalRef.current) {
                clearInterval(scrollCheckIntervalRef.current);
            }
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            window.removeEventListener('scroll', handleScroll);
        };
    }, [highlightedServiceId, currentPage]);

    const renderPublicPage = () => {
        switch (currentPage) {
            case 'Home':
                return <HomePage setPage={handlePageChange} />;
            case 'About':
                return <AboutPage subPageId={activeSubPage || 'journey'} />;
            case 'Services':
                return <ServicesPage activeServiceId={activeSubPage} highlightedServiceId={highlightedServiceId} />;
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
            const role = roleStorage.getRole();
            // Check role from localStorage (JWT removed, so we rely on role storage)
            if (!isAuthenticated || role !== 'admin') {
                setForceAdminLogin(true);
                handlePageChange('Login');
                return;
            }
        }
    }, [currentPage, isAuthenticated, handlePageChange]);

    if (currentPage === 'Admin') {
        // Double-check: Ensure only admins can access admin dashboard
        const role = roleStorage.getRole();
        if (!isAuthenticated || role !== 'admin') {
            // Redirect to login if not admin
            setForceAdminLogin(true);
            setCurrentPage('Login');
            return <LoginPage setPage={handlePageChange} onLoginSuccess={handleLoginSuccess} isAdmin={true} />;
        }
        
        return <AdminDashboard setPage={handlePageChange} onLogout={handleLogout} avatar={userAvatar} />;
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
                <Header activePage={currentPage} setPage={handlePageChange} isAuthenticated={isAuthenticated} onLogout={handleLogout} avatar={userAvatar} />
                <main className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                    {renderPublicPage()}
                </main>
                <Footer setPage={handlePageChange} />
                {/* Contact Buttons - Shows on all public user pages */}
                <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-end gap-2 sm:gap-2.5">
                    <WhatsAppButton />
                    <MailButton />
                </div>
                {/* Welcome Popup Form */}
                {showWelcomePopup && (
                    <WelcomePopupForm onClose={() => {
                        console.log('🔒 Closing popup from App.tsx');
                        setShowWelcomePopup(false);
                    }} />
                )}
            </div>
        </div>
    );
};

export default App;