
import React, { useEffect, useState } from 'react';
import AnimatedSection from '../ui/AnimatedSection';
import StatCard from './ui/StatCard';
import { adminAPI, DashboardStats } from '../../utils/api';
import { UsersIcon, BriefcaseIcon, FileTextIcon, MailIcon, AwardIcon, ImageIcon } from '../../constants';

const BarChartPlaceholder = () => (
    <div className="w-full h-64 bg-white/5 border border-white/10 rounded-lg p-4 flex items-end space-x-2">
        {[...Array(12)].map((_, i) => (
            <div key={i} className="flex-1 bg-gradient-to-t from-highlight-blue/50 to-highlight-blue rounded-t-sm" style={{ height: `${Math.random() * 80 + 10}%` }}></div>
        ))}
    </div>
);

const PieChartPlaceholder = () => (
    <div className="w-full h-64 bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-48 h-48">
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="#3B82F6" strokeWidth="10" />
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="#d4af37" strokeWidth="10" strokeDasharray="283" strokeDashoffset="70" />
            <text x="50" y="55" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">75%</text>
        </svg>
    </div>
);


const DashboardOverview: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await adminAPI.getDashboardStats();
                setStats(response.data);
            } catch (err: any) {
                setError(err.message || 'Failed to load dashboard statistics');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div>
                <AnimatedSection>
                    <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
                </AnimatedSection>
                <div className="text-center py-12">
                    <p className="text-gray-300">Loading dashboard statistics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <AnimatedSection>
                    <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
                </AnimatedSection>
                <div className="text-center py-12">
                    <p className="text-red-400">{error}</p>
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
                <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <AnimatedSection delay="delay-400">
                     <h2 className="text-2xl font-bold mb-4">Monthly Activity</h2>
                     <BarChartPlaceholder />
                </AnimatedSection>
                 <AnimatedSection delay="delay-500">
                     <h2 className="text-2xl font-bold mb-4">Guard Status</h2>
                     <PieChartPlaceholder />
                </AnimatedSection>
            </div>
        </div>
    );
};

export default DashboardOverview;
