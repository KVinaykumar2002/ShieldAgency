
import React from 'react';
import { AdminStat } from '../../../types';

const StatCard: React.FC<AdminStat> = ({ title, value, change, changeType, icon: Icon }) => {
    const isIncrease = changeType === 'increase';
    const isNeutral = changeType === 'neutral';
    const changeColor = isNeutral ? 'text-gray-400' : isIncrease ? 'text-green-400' : 'text-red-400';
    return (
        <div className="bg-glass-bg backdrop-blur-xl border border-white/10 rounded-lg p-4 sm:p-5 flex flex-col justify-between h-full group transition-all duration-300 hover:border-accent-gold/50 hover:-translate-y-1 sm:hover:-translate-y-2">
            <div className="flex justify-between items-start mb-2 sm:mb-0">
                <h3 className="text-sm sm:text-md font-semibold text-gray-300 truncate flex-1 pr-2">{title}</h3>
                <Icon className="w-5 h-5 sm:w-6 sm:h-7 text-gray-400 group-hover:text-accent-gold transition-colors flex-shrink-0" />
            </div>
            <div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-2">{value}</p>
                <div className="flex items-center text-xs sm:text-sm mt-1 flex-wrap">
                    <span className={`font-semibold ${changeColor}`}>{change}</span>
                    {!isNeutral && <span className="text-gray-400 ml-1">this month</span>}
                </div>
            </div>
        </div>
    );
};

export default StatCard;
