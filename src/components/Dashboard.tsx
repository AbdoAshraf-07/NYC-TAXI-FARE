import React from 'react';
import { motion } from 'motion/react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { StatCard } from './StatCard';
import { FareDistributionPoint, TripDistancePoint, HourlyVolumePoint } from '../types';

const fareData: FareDistributionPoint[] = [
  { range: '$0', count: 0, trend: 0 },
  { range: '$0-50', count: 4200, trend: 12 },
  { range: '$51-100', count: 8500, trend: 5 },
  { range: '$51-200', count: 5200, trend: -2 },
  { range: '>$100', count: 9100, trend: 18 },
];

const distanceData: TripDistancePoint[] = [
  { distance: '<1 Mile', frequency: 7.7 },
  { distance: '1-5 Miles', frequency: 23.6 },
  { distance: '6-10 Miles', frequency: 15.8 },
  { distance: '>10 Miles', frequency: 3.3 },
];

const hourlyData: HourlyVolumePoint[] = [
  { hour: 0, volume: 1.2 },
  { hour: 4, volume: 0.8 },
  { hour: 8, volume: 3.5 },
  { hour: 12, volume: 2.8 },
  { hour: 16, volume: 4.2 },
  { hour: 20, volume: 3.1 },
  { hour: 24, volume: 1.5 },
];

export const DashboardView: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
        <div className="flex gap-2">
            <button className="px-3 py-1.5 text-xs font-medium glass-card hover:bg-white/5">Jan 2026 - May 2026</button>
            <button className="px-3 py-1.5 text-xs font-medium glass-card bg-taxi-yellow text-bg-dark border-transparent font-bold">Download Report</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Dataset" value="7,520,485" unit="Trips" trend={7.2} type="yellow" />
        <StatCard label="Avg Fare" value="$18.35" trend={-3.1} type="orange" />
        <StatCard label="Avg Distance" value="4.2" unit="Miles" trend={12.5} type="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fare Distribution */}
        <div className="lg:col-span-1 glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Fare Distribution</h3>
            <select className="bg-transparent border-none text-xs font-medium text-slate-500 focus:ring-0">
              <Option>Inter</Option>
            </select>
          </div>
          <div className="h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fareData}>
                 <defs>
                  <linearGradient id="colorFare" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FACC15" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FACC15" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: '#FACC15' }}
                />
                <Area type="monotone" dataKey="count" stroke="#FACC15" strokeWidth={3} fillOpacity={1} fill="url(#colorFare)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trip Distance */}
        <div className="lg:col-span-1 glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Trip Distance</h3>
             <span className="text-xs font-mono text-slate-500">Roboto Mono</span>
          </div>
          <div className="h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="distance" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                <YAxis hide />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#151921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Bar dataKey="frequency" radius={[4, 4, 0, 0]}>
                  {distanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 ? '#FACC15' : '#1C222C'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pickup Hour */}
        <div className="lg:col-span-1 glass-card p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Pickup Hour</h3>
             <button className="text-xs font-medium text-slate-500 border border-white/10 px-2 py-1 rounded">Filters</button>
          </div>
          <div className="h-64 mt-auto">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyData}>
                 <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FB923C" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#FB923C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: '#151921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="volume" stroke="#FB923C" strokeWidth={2} fillOpacity={1} fill="url(#colorVolume)" />
                <Area type="monotone" dataKey="volume" stroke="#FACC15" strokeWidth={1} fill="transparent" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

function Option({ children }: { children: React.ReactNode }) {
    return <option className="bg-surface text-slate-200">{children}</option>
}
