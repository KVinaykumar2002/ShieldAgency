
import React, { useState } from 'react';
import { Page } from '../../types';
import Button from '../ui/Button';
import AnimatedSection from '../ui/AnimatedSection';
import { authAPI, tokenStorage, roleStorage } from '../../utils/api';

interface SignUpPageProps {
    setPage: (page: Page) => void;
    onLoginSuccess?: () => void;
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

const SignUpPage: React.FC<SignUpPageProps> = ({ setPage, onLoginSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        // Validation
        if (!name || !email || !password || !confirmPassword) {
            setError('Please fill in all fields.');
            return;
        }
        
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        
        setLoading(true);
        try {
            const response = await authAPI.register(name, email, password);
            
            // Store token and role
            tokenStorage.setToken(response.token);
            if (response.data?.role) {
                roleStorage.setRole(response.data.role);
            }
            
            setIsSubmitted(true);
            
            // If login success callback is provided, use it; otherwise redirect to login
            if (onLoginSuccess) {
                setTimeout(() => {
                    onLoginSuccess();
                }, 2000);
            } else {
                setTimeout(() => {
                    setPage('Login');
                }, 2000);
            }
        } catch (err: any) {
            setError(err.message || 'Registration failed. Please try again.');
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
                        <h1 className="text-2xl font-bold text-center text-white mb-2">Create Your Account</h1>
                        <p className="text-center text-gray-400 mb-6">Join the most secure platform.</p>
                        
                        {isSubmitted ? (
                            <div className="text-center">
                                <h2 className="text-xl font-bold text-accent-gold">Success!</h2>
                                <p className="text-gray-300 mt-2">Your account has been created. Redirecting...</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue transition-all"
                                />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue transition-all"
                                />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue transition-all"
                                />
                                 <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    className="w-full p-3 bg-white/5 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-highlight-blue transition-all"
                                />
                                {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                                <Button type="submit" className="w-full !mt-6" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </Button>
                            </form>
                        )}

                        <p className="text-center text-gray-400 text-sm mt-6">
                            Already have an account?{' '}
                            <button onClick={() => setPage('Login')} className="font-semibold text-accent-gold hover:text-yellow-300 transition-colors">
                                Login
                            </button>
                        </p>
                    </div>
                </AnimatedSection>
            </div>
        </div>
    );
};

export default SignUpPage;