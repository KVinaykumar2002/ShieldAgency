
import React from 'react';
import { AdminStat } from '../../../types';

const StatCard: React.FC<AdminStat> = ({ title, value, change, changeType, icon: Icon }) => {
    const isIncrease = changeType === 'increase';
    const isNeutral = changeType === 'neutral';
    const changeColor = isNeutral ? 'text-gray-400' : isIncrease ? 'text-green-400' : 'text-red-400';
    return (
        <div className="bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg p-5 flex flex-col justify-between h-full group transition-all duration-300 hover:border-accent-gold/50 hover:-translate-y-2">
            <div className="flex justify-between items-start">
                <h3 className="text-md font-semibold text-gray-300">{title}</h3>
                <Icon className="w-7 h-7 text-gray-400 group-hover:text-accent-gold transition-colors" />
            </div>
            <div>
                <p className="text-4xl font-bold text-white mt-2">{value}</p>
                <div className="flex items-center text-sm mt-1">
                    <span className={`font-semibold ${changeColor}`}>{change}</span>
                    {!isNeutral && <span className="text-gray-400 ml-1">this month</span>}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
