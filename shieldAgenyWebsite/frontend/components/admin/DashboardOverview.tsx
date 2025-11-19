
import React, { useEffect, useState, useCallback } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import StatCard from './ui/StatCard';
import { adminAPI, DashboardStats } from '../../utils/api';
import { UsersIcon, BriefcaseIcon, FileTextIcon, MailIcon, AwardIcon, ImageIcon } from '../../constants';

const BarChartPlaceholder = () => (
    <div className="w-full h-48 sm:h-64 bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 flex items-end space-x-1 sm:space-x-2">
        {[...Array(12)].map((_, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-highlight-blue/50 to-highlight-blue rounded-t-sm" style={{ height: `${Math.random() * 80 + 10}%` }}></div>
        ))}
    </div>
);

const PieChartPlaceholder = () => (
    <div className="w-full h-48 sm:h-64 bg-white/5 border border-white/10 rounded-lg p-3 sm:p-4 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-32 h-32 sm:w-48 sm:h-48">
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="#3B82F6" strokeWidth="10" />
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="#d4af37" strokeWidth="10" strokeDasharray="283" strokeDashoffset="70" />
            <text x="50" y="55" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold" className="sm:text-base">75%</text>
        </svg>
    </div>
);


const DashboardOverview: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchStats = useCallback(async (showLoading = true) => {
        if (showLoading) {
            setLoading(true);
        } else {
            setIsRefreshing(true);
        }
        setError(null);
        try {
            const response = await adminAPI.getDashboardStats();
            setStats(response.data);
            setLastRefresh(new Date());
        } catch (err: any) {
            setError(err.message || 'Failed to load dashboard statistics');
            console.error('Dashboard stats error:', err);
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
        
        // Auto-refresh every 5 minutes
        const refreshInterval = setInterval(() => {
            fetchStats(false);
        }, 5 * 60 * 1000);

        return () => clearInterval(refreshInterval);
    }, [fetchStats]);

    const handleRefresh = () => {
        fetchStats(false);
    };

    if (loading) {
        return (
            <div>
                <AnimatedSection>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>
                    </div>
                </AnimatedSection>
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent-gold mb-4"></div>
                    <p className="text-gray-300">Loading dashboard statistics...</p>
                </div>
            </div>
        );
    }

    if (error && !stats) {
        return (
            <div>
                <AnimatedSection>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-6">Dashboard Overview</h1>
                </AnimatedSection>
                <div className="text-center py-12 bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                        onClick={() => fetchStats()}
                        className="px-4 py-2 bg-accent-gold text-primary-black rounded-lg font-semibold hover:bg-accent-gold/90 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!stats) {
        return null;
    }

    const statCards = [
        { title: 'Total Guards', stat: stats.totalGuards, icon: UsersIcon },
        { title: 'Active Guards', stat: stats.activeGuards, icon: UsersIcon },
        { title: 'Job Applications', stat: stats.totalApplications, icon: FileTextIcon },
        { title: 'Website Enquiries', stat: stats.totalEnquiries, icon: MailIcon },
    ];

    return (
        <div>
            <AnimatedSection>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold">Dashboard Overview</h1>
                    <div className="flex items-center gap-3">
                        {lastRefresh && (
                            <span className="text-xs sm:text-sm text-gray-400">
                                Last updated: {lastRefresh.toLocaleTimeString()}
                            </span>
                        )}
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isRefreshing ? (
                                <>
                                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-accent-gold"></div>
                                    <span className="hidden sm:inline">Refreshing...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span className="hidden sm:inline">Refresh</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
                {error && (
                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                        <p className="text-yellow-400 text-sm">{error}</p>
                    </div>
                )}
            </AnimatedSection>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {statCards.map((card, index) => (
                    <AnimatedSection key={card.title} delay={`delay-${index * 100}`}>
                        <StatCard 
                            title={card.title}
                            value={card.stat.value}
                            change={card.stat.change}
                            changeType={card.stat.changeType}
                            icon={card.icon}
                        />
                    </AnimatedSection>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <AnimatedSection delay="delay-400">
                     <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Monthly Activity</h2>
                     <BarChartPlaceholder />
                </AnimatedSection>
                 <AnimatedSection delay="delay-500">
                     <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Guard Status</h2>
                     <PieChartPlaceholder />
                </AnimatedSection>
            </div>
        </div>
    );
};

export default DashboardOverview;
