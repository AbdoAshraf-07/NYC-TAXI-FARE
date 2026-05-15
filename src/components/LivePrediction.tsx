import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  LineChart, Line, Legend
} from 'recharts';
import { 
  MapPin, Info, ArrowRight, Gauge, 
  ToggleRight, ToggleLeft, CheckCircle2
} from 'lucide-react';
import { clsx } from 'clsx';
import { PredictionInputs, PredictionResult } from '../types';

const defaultInputs: PredictionInputs = {
  distance: 5.2,
  passengers: 2,
  hour: '17:30',
  airportSurcharge: true,
  rushHour: true,
  pickupLocation: 'Manhattan, NY',
  dropoffLocation: 'JFK Airport, NY',
};

const featureImportance = [
  { name: 'Trip Distance', value: 45 },
  { name: 'Time of Day', value: 25 },
  { name: 'Pickup Location', value: 15 },
  { name: 'Surcharges', value: 10 },
  { name: 'Passenger Count', value: 5 },
];

export const LivePredictionView: React.FC = () => {
  const [inputs, setInputs] = useState<PredictionInputs>(defaultInputs);
  const [isCompareMode, setIsCompareMode] = useState(true);
  const [predictionA, setPredictionA] = useState<PredictionResult | null>(null);
  const [predictionB, setPredictionB] = useState<PredictionResult | null>(null);
  const [predictionC, setPredictionC] = useState<PredictionResult | null>(null);
  const [modelALoaded, setModelALoaded] = useState(false);
  const [modelBLoaded, setModelBLoaded] = useState(false);
  const [modelCLoaded, setModelCLoaded] = useState(false);

  // Load Model A (XGBoost)
  useEffect(() => {
    fetch('/nyc_taxi_model.json')
      .then(res => {
        if (res.ok) setModelALoaded(true);
      })
      .catch(() => console.log("XGBoost model file not found."));
  }, []);

  // Load Model B (Linear Regression)
  useEffect(() => {
    fetch('/nyc_taxi_lr_model.json')
      .then(res => {
        if (res.ok) setModelBLoaded(true);
      })
      .catch(() => console.log("Linear Regression model file not found."));
  }, []);

  // Check for Model C (Random Forest - Simulated/Averaged)
  useEffect(() => {
    // Setting it to true to simulate its availability
    setModelCLoaded(true);
  }, []);

  // Mock prediction logic
  const calculatePrediction = (inputs: PredictionInputs, mode: 'A' | 'B' | 'AVG') => {
    let base = 3.50;
    let variance = 0.5;
    let distMultiplier = 2.5;

    if (mode === 'B') {
      base = 3.35;
      variance = 1.5;
      distMultiplier = 2.4;
    } else if (mode === 'AVG') {
      base = (3.50 + 3.35) / 2;
      variance = (0.5 + 1.5) / 2;
      distMultiplier = (2.5 + 2.4) / 2;
    }

    const distanceCharge = inputs.distance * distMultiplier;
    const surcharges = (inputs.airportSurcharge ? 5.00 : 0) + (inputs.rushHour ? 2.50 : 0);
    const tolls = 8.00;
    const total = base + distanceCharge + surcharges + tolls + (variance * Math.random());
    
    return {
      fare: total,
      confidence: 92 + Math.random() * 3,
      lowerBound: total - 1.2,
      upperBound: total + 1.2,
      breakdown: {
        base,
        distance: distanceCharge,
        tolls,
        surcharges
      }
    };
  };

  useEffect(() => {
    setPredictionA(calculatePrediction(inputs, 'A'));
    setPredictionB(calculatePrediction(inputs, 'B'));
    setPredictionC(calculatePrediction(inputs, 'AVG'));
  }, [inputs, modelALoaded, modelBLoaded]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
      {/* Left Column: Inputs */}
      <div className="xl:col-span-3 space-y-6">
        <div className="glass-card p-6 space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="text-lg font-bold">Trip Inputs</h2>
             <Info size={16} className="text-slate-500" />
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-400">Trip Distance (miles)</span>
                <span className="text-taxi-yellow">{inputs.distance}</span>
              </div>
              <input 
                type="range" min="0" max="100" step="0.1" 
                value={inputs.distance}
                onChange={(e) => setInputs({...inputs, distance: parseFloat(e.target.value)})}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-taxi-yellow" 
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0</span>
                <span>100</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Passenger Count</label>
              <select 
                value={inputs.passengers}
                onChange={(e) => setInputs({...inputs, passengers: parseInt(e.target.value)})}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-taxi-yellow/50"
              >
                {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n} className="bg-surface">{n}</option>)}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Pickup Hour</label>
              <input 
                type="time" 
                value={inputs.hour}
                onChange={(e) => setInputs({...inputs, hour: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm outline-none focus:border-taxi-yellow/50" 
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-medium text-slate-400">Airport Surcharge</span>
              <button onClick={() => setInputs({...inputs, airportSurcharge: !inputs.airportSurcharge})}>
                {inputs.airportSurcharge ? <ToggleRight className="text-taxi-yellow" /> : <ToggleLeft className="text-slate-500" />}
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-xs font-medium text-slate-400">Rush Hour</span>
              <button onClick={() => setInputs({...inputs, rushHour: !inputs.rushHour})}>
                {inputs.rushHour ? <ToggleRight className="text-taxi-yellow" /> : <ToggleLeft className="text-slate-500" />}
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Pickup Location</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                <MapPin size={14} className="text-taxi-yellow" />
                <input 
                  type="text" value={inputs.pickupLocation} 
                  onChange={(e) => setInputs({...inputs, pickupLocation: e.target.value})}
                  className="bg-transparent border-none text-xs outline-none w-full" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-400">Dropoff Location</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                <MapPin size={14} className="text-taxi-orange" />
                <input 
                  type="text" value={inputs.dropoffLocation}
                  onChange={(e) => setInputs({...inputs, dropoffLocation: e.target.value})}
                  className="bg-transparent border-none text-xs outline-none w-full" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle/Right Column: Results */}
      <div className="xl:col-span-9 space-y-8">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold">Model Output Comparison</h2>
             <div className="flex gap-2">
               {modelALoaded && (
                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-taxi-yellow/10 border border-taxi-yellow/20 rounded text-[10px] font-bold text-taxi-yellow">
                   <CheckCircle2 size={10} />
                   XGBOOST ACTIVE
                 </div>
               )}
               {modelBLoaded && (
                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-taxi-orange/10 border border-taxi-orange/20 rounded text-[10px] font-bold text-taxi-orange">
                   <CheckCircle2 size={10} />
                   LR MODEL ACTIVE
                 </div>
               )}
               {modelCLoaded && (
                 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] font-bold text-blue-400">
                   <CheckCircle2 size={10} />
                   RF REGRESSOR ACTIVE
                 </div>
               )}
             </div>
           </div>
           <div className="flex items-center gap-3">
             <span className="text-xs font-medium text-slate-400">Compare Mode</span>
             <button 
                onClick={() => setIsCompareMode(!isCompareMode)}
                className={clsx("w-10 h-5 rounded-full relative transition-colors", isCompareMode ? "bg-taxi-yellow" : "bg-white/10")}
             >
                <div className={clsx("w-3.5 h-3.5 bg-bg-dark rounded-full absolute top-0.5 transition-all", isCompareMode ? "right-0.5" : "left-0.5")} />
             </button>
           </div>
        </div>

        {/* Comparison Cards */}
        <div className={clsx("grid grid-cols-1 gap-6 relative", isCompareMode ? "lg:grid-cols-3" : "lg:grid-cols-1")}>
          {predictionA && (
            <motion.div layout className="glass-card p-6 border-taxi-yellow/20 relative group overflow-hidden">
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <span className="text-[10px] uppercase font-bold text-taxi-yellow tracking-widest">Model A</span>
                   <h3 className="font-bold text-lg">XGBoost Regression</h3>
                 </div>
                 <Gauge size={20} className="text-taxi-yellow" />
               </div>
               <div className="text-4xl font-black mb-1">${predictionA.fare.toFixed(2)}</div>
               <div className="text-[10px] text-slate-400 font-mono mb-4">CONFIDENCE: {predictionA.lowerBound.toFixed(2)} - {predictionA.upperBound.toFixed(2)}</div>
               
               <div className="space-y-1">
                 <div className="flex justify-between text-[10px] font-bold">
                    <span>CONFIDENCE</span>
                    <span>{predictionA.confidence.toFixed(1)}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${predictionA.confidence}%` }} className="h-full bg-gradient-to-r from-taxi-yellow/20 to-taxi-yellow" />
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-taxi-yellow/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-taxi-yellow/20 transition-all" />
            </motion.div>
          )}

          {isCompareMode && predictionC && (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
               className="glass-card p-6 border-blue-500/20 relative group overflow-hidden"
            >
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <span className="text-[10px] uppercase font-bold text-blue-400 tracking-widest">Model C</span>
                   <h3 className="font-bold text-lg text-blue-500">Random Forest</h3>
                 </div>
                 <Gauge size={20} className="text-blue-500" />
               </div>
               <div className="text-4xl font-black mb-1">${predictionC.fare.toFixed(2)}</div>
               <div className="text-[10px] text-slate-400 font-mono mb-4 italic">AVG ENSEMBLE SYSTEM</div>
               
               <div className="space-y-1">
                 <div className="flex justify-between text-[10px] font-bold">
                    <span>STABILITY</span>
                    <span>{predictionC.confidence.toFixed(1)}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${predictionC.confidence}%` }} className="h-full bg-gradient-to-r from-blue-500/20 to-blue-500" />
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all" />
            </motion.div>
          )}

          {isCompareMode && predictionB && (
            <motion.div 
               initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
               className="glass-card p-6 border-taxi-orange/20 relative group overflow-hidden"
            >
               <div className="flex justify-between items-start mb-4">
                 <div>
                   <span className="text-[10px] uppercase font-bold text-taxi-orange tracking-widest">Model B</span>
                   <h3 className="font-bold text-lg">Linear Regression</h3>
                 </div>
                 <Gauge size={20} className="text-taxi-orange" />
               </div>
               <div className="text-4xl font-black mb-1">${predictionB.fare.toFixed(2)}</div>
               <div className="text-[10px] text-slate-400 font-mono mb-4">CONFIDENCE: {predictionB.lowerBound.toFixed(2)} - {predictionB.upperBound.toFixed(2)}</div>
               
               <div className="space-y-1">
                 <div className="flex justify-between text-[10px] font-bold">
                    <span>CONFIDENCE</span>
                    <span>{predictionB.confidence.toFixed(1)}%</span>
                 </div>
                 <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${predictionB.confidence}%` }} className="h-full bg-gradient-to-r from-taxi-orange/20 to-taxi-orange" />
                 </div>
               </div>
               <div className="absolute top-0 right-0 w-32 h-32 bg-taxi-orange/10 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-taxi-orange/20 transition-all" />
            </motion.div>
          )}


        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Pricing Breakdown Table */}
           <div className="glass-card p-6">
              <h3 className="text-sm font-bold uppercase text-slate-400 mb-6 tracking-widest">Structured Pricing Breakdown</h3>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 uppercase tracking-tighter">
                    <th className="text-left pb-3 font-medium">Model Component</th>
                    <th className="pb-3 font-medium">Model A</th>
                    {isCompareMode && (
                      <>
                        <th className="pb-3 font-medium">Model C</th>
                        <th className="pb-3 font-medium">Model B</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    ['Base Fare', 'base'],
                    ['Distance Charge', 'distance'],
                    ['Tolls ($8.00)', 'tolls'],
                    ['Surcharges', 'surcharges']
                  ].map(([label, key]) => (
                    <tr key={key} className="group hover:bg-white/5 transition-colors">
                      <td className="py-4 text-slate-400">{label}</td>
                      <td className="py-4 text-right font-mono text-[10px] md:text-xs">${predictionA?.breakdown[key as keyof typeof predictionA.breakdown].toFixed(2)}</td>
                      {isCompareMode && (
                        <>
                          <td className="py-4 text-right font-mono text-[10px] md:text-xs text-blue-400">${predictionC?.breakdown[key as keyof typeof predictionC.breakdown].toFixed(2)}</td>
                          <td className="py-4 text-right font-mono text-[10px] md:text-xs text-taxi-orange">${predictionB?.breakdown[key as keyof typeof predictionB.breakdown].toFixed(2)}</td>
                        </>
                      )}
                    </tr>
                  ))}
                  <tr className="border-t border-white/10">
                     <td className="py-4 font-bold text-white uppercase italic">Total Estimate</td>
                     <td className="py-4 text-right font-bold text-taxi-yellow text-base md:text-lg font-mono">${predictionA?.fare.toFixed(2)}</td>
                     {isCompareMode && (
                        <>
                          <td className="py-4 text-right font-bold text-blue-500 text-base md:text-lg font-mono">${predictionC?.fare.toFixed(2)}</td>
                          <td className="py-4 text-right font-bold text-taxi-orange text-base md:text-lg font-mono">${predictionB?.fare.toFixed(2)}</td>
                        </>
                     )}
                  </tr>
                </tbody>
              </table>
           </div>

           {/* Intelligence Layer / Confidence */}
           <div className="glass-card p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold uppercase text-slate-400 tracking-widest">Model Intelligence Layer</h3>
                 <div className="flex gap-4">
                    <div className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-taxi-yellow" /><span className="text-[10px] text-slate-500">Model A</span></div>
                    {isCompareMode && (
                      <>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-blue-500" /><span className="text-[10px] text-slate-500">Model C</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-0.5 bg-taxi-orange" /><span className="text-[10px] text-slate-500">Model B</span></div>
                      </>
                    )}
                 </div>
              </div>
              <div className="h-64 mt-auto">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { name: 'Model A', a: predictionA?.fare, b: predictionB?.fare, c: predictionC?.fare },
                      { name: 'Model B', a: (predictionA?.fare || 0) + 2, b: (predictionB?.fare || 0) + 1.5, c: (predictionC?.fare || 0) + 1.7 },
                      { name: 'Model B', a: (predictionA?.fare || 0) + 4, b: (predictionB?.fare || 0) + 3.5, c: (predictionC?.fare || 0) + 3.7 },
                    ]}>
                      <XAxis dataKey="name" hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#151921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                      />
                      <Line type="monotone" dataKey="a" stroke="#FACC15" strokeWidth={3} dot={{r: 4}} />
                      {isCompareMode && (
                        <>
                          <Line type="monotone" dataKey="c" stroke="#3b82f6" strokeWidth={3} dot={{r: 4}} />
                          <Line type="monotone" dataKey="b" stroke="#FB923C" strokeWidth={3} dot={{r: 4}} />
                        </>
                      )}
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           {/* Route Simulation Placeholder */}
           <div className="glass-card overflow-hidden relative aspect-video">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1543236355-69fca75f128c?auto=format&fit=crop&q=80&w=2000')] bg-cover opacity-20 grayscale brightness-50" />
              <div className="absolute inset-0 bg-gradient-to-b from-bg-dark/40 to-bg-dark/80" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-taxi-yellow/20 flex items-center justify-center border border-taxi-yellow/30">
                       <MapPin size={16} className="text-taxi-yellow" />
                    </div>
                    <span className="text-sm font-bold">Live Route Visualization</span>
                 </div>
                 
                 {/* Visualized Route Line (Mock) */}
                 <svg className="w-full h-1/2 absolute top-1/2 left-0 -translate-y-1/2 opacity-60">
                    <motion.path 
                       initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, repeat: Infinity }}
                       d="M 50,150 Q 150,50 300,100 T 550,50" 
                       fill="transparent" 
                       stroke="#FACC15" 
                       strokeWidth={4}
                       strokeDasharray="10, 5"
                    />
                 </svg>

                 <div className="mt-auto grid grid-cols-2 gap-4">
                    <div className="bg-bg-dark/80 backdrop-blur border border-white/5 p-3 rounded-lg">
                       <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Estimated Time</div>
                       <div className="text-xl font-bold">24 <span className="text-xs text-slate-400 italic">min</span></div>
                    </div>
                    <div className="bg-bg-dark/80 backdrop-blur border border-white/5 p-3 rounded-lg">
                       <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Traffic Density</div>
                       <div className="text-xl font-bold text-taxi-orange">Moderate</div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Feature Importance */}
           <div className="glass-card p-6">
              <h3 className="text-sm font-bold uppercase text-slate-400 mb-6 tracking-widest">Light Explainability Layer</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={featureImportance} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} width={90} />
                    <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{ backgroundColor: '#151921', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {featureImportance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#FACC15' : 'rgba(255,255,255,0.1)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 text-center text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Feature Influence Map</div>
           </div>
        </div>
      </div>
    </div>
  );
};
