import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { StatData } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const StatCard: React.FC<StatData> = ({ label, value, trend, unit, type }) => {
  const isPositive = trend > 0;
  
  const colors = {
    yellow: 'border-taxi-yellow/20 bg-taxi-yellow/5 glow-yellow',
    orange: 'border-taxi-orange/20 bg-taxi-orange/5 glow-orange',
    green: 'border-taxi-green/20 bg-taxi-green/5 glow-green'
  };

  const textColors = {
    yellow: 'text-taxi-yellow',
    orange: 'text-taxi-orange',
    green: 'text-taxi-green'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass-card p-6 flex flex-col justify-between h-32 relative overflow-hidden", colors[type])}
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-xs font-medium text-slate-400 mb-1">{label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight">{value}</span>
            {unit && <span className="text-xs text-slate-500">{unit}</span>}
          </div>
        </div>
        <div className={cn("flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border", 
          isPositive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20")}>
          <ArrowUpRight size={12} />
          Trend
        </div>
      </div>
      
      <div className="mt-auto flex items-center gap-1 text-[10px] font-medium text-slate-500">
        <motion.span 
          animate={{ x: isPositive ? [0, 2, 0] : [0, -2, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {isPositive ? <TrendingUp size={12} className="text-green-400" /> : <TrendingDown size={12} className="text-red-400" />}
        </motion.span>
        <span className={clsx(isPositive ? "text-green-400" : "text-red-400")}>
          {isPositive ? "+" : ""}{trend}%
        </span>
        <span>vs last month</span>
      </div>

      {/* Decorative gradient flare */}
      <div className={cn("absolute -right-4 -bottom-4 w-16 h-16 blur-2xl opacity-20 rounded-full", 
        type === 'yellow' ? "bg-taxi-yellow" : type === 'orange' ? "bg-taxi-orange" : "bg-taxi-green")} />
    </motion.div>
  );
};
