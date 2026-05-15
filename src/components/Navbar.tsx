import React from 'react';
import { motion } from 'motion/react';
import { Tab } from '../types';
import { Car, User, Bell, Settings, HelpCircle, Activity, Play, Database } from 'lucide-react';
import { clsx } from 'clsx';

interface NavbarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity size={16} /> },
    { id: 'live', label: 'Live Prediction', icon: <Play size={16} /> },
    { id: 'batch', label: 'Batch Prediction', icon: <Database size={16} /> },
  ];

  return (
    <nav className="border-b border-white/5 bg-bg-dark/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-taxi-yellow rounded-lg flex items-center justify-center glow-yellow">
            <Car className="text-bg-dark" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight">NYC Taxi</span>
            <span className="text-[10px] uppercase tracking-widest text-taxi-yellow font-bold opacity-80">Predictor</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "nav-link flex items-center gap-2 group",
                activeTab === tab.id ? "nav-link-active" : "text-slate-400 hover:text-slate-200"
              )}
            >
              <span className={clsx("transition-transform group-hover:scale-110", activeTab === tab.id && "text-taxi-yellow")}>
                {tab.icon}
              </span>
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="underline"
                  className="nav-underline"
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 glass-card !rounded-full border-white/5 bg-white/5">
             <div className="w-2 h-2 bg-taxi-yellow rounded-full animate-pulse" />
             <span className="text-xs font-mono text-taxi-yellow font-bold uppercase tracking-tighter">XGBoost v1.2</span>
          </div>
          
          <div className="h-6 w-px bg-white/10 mx-2" />
          
          <div className="flex items-center gap-3">
            <button className="text-slate-400 hover:text-white transition-colors"><Bell size={20} /></button>
            <button className="text-slate-400 hover:text-white transition-colors"><Settings size={20} /></button>
            <button className="flex items-center gap-2 text-sm font-medium border border-white/10 px-4 py-1.5 rounded-full hover:bg-white/5 transition-all">
              <User size={18} />
              <span>faragabdo</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
