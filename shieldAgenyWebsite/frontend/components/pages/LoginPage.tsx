import React, { useState } from 'react';
import { Page } from '../../types';
import Button from '../ui/Button';
import AnimatedSection from '../ui/AnimatedSection';
import { authAPI, tokenStorage, roleStorage } from '../../utils/api';

interface LoginPageProps {
    setPage: (page: Page) => void;
    onLoginSuccess: () => void;
    isAdmin?: boolean;
}

const CompanyLogo: React.FC = () => (
    <div className="flex items-center space-x-3 cursor-pointer">
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

const LoginPage: React.FC<LoginPageProps> = ({ setPage, onLoginSuccess, isAdmin = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        // Basic validation
        if (!email || !password) {
            setError('Please enter both email and password.');
            setLoading(false);
            return;
        }
        
        try {
            // Use admin or user login based on isAdmin prop
            const response = isAdmin 
                ? await authAPI.adminLogin(email, password)
                : await authAPI.userLogin(email, password);
            
            // Store token and role
            tokenStorage.setToken(response.token);
            if (response.data?.role) {
                // Ensure role is set correctly - never allow user to have admin role from user login
                const role = response.data.role;
                if (isAdmin && role !== 'admin') {
                    // Admin login but got user role - error
                    setError('Invalid credentials. Admin access required.');
                    tokenStorage.removeToken();
                    roleStorage.removeRole();
                    setLoading(false);
                    return;
                }
                if (!isAdmin && role === 'admin') {
                    // User login but got admin role - this should never happen, but protect against it
                    console.error('Security: User login returned admin role - rejecting');
                    setError('Authentication error. Please try again.');
                    tokenStorage.removeToken();
                    roleStorage.removeRole();
                    setLoading(false);
                    return;
                }
                roleStorage.setRole(role);
            } else {
                // No role in response - set default based on login type
                roleStorage.setRole(isAdmin ? 'admin' : 'user');
            }
            
            // Call success callback
            onLoginSuccess();
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-primary-black min-h-screen relative flex items-center justify-center p-4">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
            <div className="relative z-10 w-full max-w-md">
                <AnimatedSection>
                    <div className="bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg p-8 shadow-2xl shadow-black/30">
                        <div className="flex justify-center mb-6">
                            <CompanyLogo />
                        </div>
                        <h1 className="text-2xl font-bold text-center text-white mb-2">
                            {isAdmin ? 'Admin Login' : 'Welcome Back'}
                        </h1>
                        <p className="text-center text-gray-400 mb-6">
                            {isAdmin ? 'Login to access admin dashboard' : 'Login to access your dashboard.'}
                        </p>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input
                                type="email"
                                placeholder="Email Address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue transition-all"
                                aria-label="Email Address"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue transition-all"
                                aria-label="Password"
                            />
                            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                            <div className="text-right">
                                <a href="#" className="text-sm text-gray-400 hover:text-highlight-blue transition-colors">Forgot Password?</a>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </Button>
                        </form>

                        <p className="text-center text-gray-400 text-sm mt-4">
                            Don't have an account?{' '}
                            <button onClick={() => setPage('SignUp')} className="font-semibold text-accent-gold hover:text-yellow-300 transition-colors">
                                Sign Up
                            </button>
                        </p>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default LoginPage;