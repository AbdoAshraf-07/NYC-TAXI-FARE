import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudUpload, FileText, Play, Download, CheckCircle2, 
  Loader2, AlertCircle, Trash2
} from 'lucide-react';
import { clsx } from 'clsx';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { BatchJob } from '../types';

const mockResults = [
  { id: 'TRIP-8765', pickup: '10/26/23 09:30 AM', dropoff: '10/26/23 10:15 AM', distance: '8.5 miles', predicted: 32.10, confidence: 94 },
  { id: 'TRIP-8766', pickup: '10/26/23 09:45 AM', dropoff: '10/26/23 10:05 AM', distance: '3.2 miles', predicted: 14.50, confidence: 91 },
  { id: 'TRIP-8767', pickup: '10/26/23 10:00 AM', dropoff: '10/26/23 10:45 AM', distance: '12.4 miles', predicted: 45.30, confidence: 88 },
  { id: 'TRIP-8768', pickup: '10/26/23 10:15 AM', dropoff: '10/26/23 10:30 AM', distance: '2.1 miles', predicted: 11.20, confidence: 96 },
];

export const BatchPredictionView: React.FC = () => {
  const [job, setJob] = useState<BatchJob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setJob({
        fileName: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + 'MB',
        rows: 50000,
        status: 'ready'
      });
    }
  };

  const startProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (job) setJob({ ...job, status: 'completed' });
    }, 3000);
  };

  return (
    <div className="space-y-8">
      <div className="glass-card p-12 border-dashed border-2 border-white/5 flex flex-col items-center justify-center text-center group hover:border-taxi-yellow/30 transition-all cursor-pointer relative overflow-hidden bg-white/[0.02]">
        <input 
          type="file" accept=".csv" 
          onChange={handleFileUpload}
          className="absolute inset-0 opacity-0 cursor-pointer z-10" 
        />
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-taxi-yellow/10 transition-all">
          <CloudUpload className="text-slate-400 group-hover:text-taxi-yellow transition-colors" size={32} />
        </div>
        <h2 className="text-xl font-bold mb-2">Drag and drop CSV files here or <span className="text-taxi-yellow underline underline-offset-4">Browse</span></h2>
        <p className="text-sm text-slate-500 mb-8 max-w-sm">Upload taxi trip datasets for large-scale fare forecasting. Supported formats: CSV (up to 50MB).</p>
        
        <div className="flex gap-4 opacity-50">
           <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold"><FileText size={12} /> CSV Format</div>
           <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-bold"><AlertCircle size={12} /> max size 50MB</div>
        </div>
        
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-taxi-yellow/5 blur-3xl -ml-16 -mt-16 group-hover:bg-taxi-yellow/10" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-taxi-orange/5 blur-3xl -mr-16 -mb-16 group-hover:bg-taxi-orange/10" />
      </div>

      <AnimatePresence>
        {job && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }}
            className="space-y-8"
          >
            {/* File Info Card */}
            <div className="glass-card overflow-hidden">
               <div className="bg-white/5 px-6 py-3 border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex justify-between">
                  <span>File Preview</span>
                  <button onClick={() => setJob(null)} className="hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
               </div>
               <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">File Name</div>
                    <div className="flex items-center gap-2">
                       <FileText size={16} className="text-taxi-yellow" />
                       <span className="font-bold">{job.fileName}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Size</div>
                    <div className="font-bold">{job.size}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Rows</div>
                    <div className="font-bold">{job.rows.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</div>
                    <div className="flex items-center gap-2">
                       {job.status === 'ready' && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />}
                       {job.status === 'processing' && <Loader2 className="animate-spin text-taxi-yellow" size={14} />}
                       {job.status === 'completed' && <CheckCircle2 className="text-taxi-green" size={14} />}
                       <span className={clsx("font-bold text-xs capitalize", job.status === 'completed' && "text-taxi-green")}>
                        {isProcessing ? 'Processing...' : job.status}
                       </span>
                    </div>
                  </div>
               </div>
            </div>

            {/* Run Selection Container */}
            {!isProcessing && job.status === 'ready' && (
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Select AI Model</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:border-taxi-yellow/50 outline-none">
                    <option className="bg-surface">Premium TaxiNet v3 (XGBoost + LSTM)</option>
                    <option className="bg-surface">Standard Regression (LGBM)</option>
                    <option className="bg-surface">Baseline Linear Model</option>
                  </select>
                </div>
                <button 
                  onClick={startProcessing}
                  className="bg-taxi-yellow text-bg-dark h-[46px] px-8 rounded-lg font-black uppercase text-sm tracking-widest flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-taxi-yellow/10"
                >
                  <Play fill="currentColor" size={18} />
                  Run Prediction
                </button>
              </div>
            )}

            {isProcessing && (
              <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold font-mono">
                    <span className="text-taxi-yellow">PROCESSING DATASET...</span>
                    <span>72%</span>
                 </div>
                 <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div initial={{ width: 0 }} animate={{ width: '72%' }} className="h-full bg-taxi-yellow glow-yellow" />
                 </div>
              </div>
            )}

            {/* Prediction Results */}
            {job.status === 'completed' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="glass-card p-6 border-l-4 border-l-taxi-yellow">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Average Fare</div>
                      <div className="text-3xl font-black italic">$28.50</div>
                   </div>
                   <div className="glass-card p-6 border-l-4 border-l-taxi-orange">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Max Fare Predicted</div>
                      <div className="text-3xl font-black italic">$95.00</div>
                   </div>
                   <div className="glass-card p-6 border-l-4 border-l-taxi-green">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-2">Min Fare Predicted</div>
                      <div className="text-3xl font-black italic">$4.25</div>
                   </div>
                </div>

                <div className="glass-card p-6 pb-2">
                   <h3 className="text-xs font-bold uppercase text-slate-400 mb-6 tracking-widest">Prediction Results Output</h3>
                   <div className="overflow-x-auto">
                     <table className="w-full text-xs">
                        <thead>
                           <tr className="border-b border-white/5 text-slate-500 uppercase tracking-tighter">
                              <th className="text-left pb-4 font-medium">Trip ID</th>
                              <th className="text-left pb-4 font-medium">Pickup Time</th>
                              <th className="text-left pb-4 font-medium">Dropoff Time</th>
                              <th className="text-left pb-4 font-medium">Distance</th>
                              <th className="text-right pb-4 font-medium">Predicted Fare</th>
                              <th className="text-right pb-4 font-medium">Confidence</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           {mockResults.map((res) => (
                             <tr key={res.id} className="hover:bg-white/5 transition-colors group">
                                <td className="py-4 font-mono font-bold text-taxi-yellow">{res.id}</td>
                                <td className="py-4 text-slate-400">{res.pickup}</td>
                                <td className="py-4 text-slate-400">{res.dropoff}</td>
                                <td className="py-4 text-slate-400">{res.distance}</td>
                                <td className="py-4 text-right font-black italic text-sm">${res.predicted.toFixed(2)}</td>
                                <td className="py-4 text-right">
                                   <span className="bg-taxi-green/10 text-taxi-green px-2 py-0.5 rounded border border-taxi-green/20 font-bold">{res.confidence}%</span>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                   </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-4 glass-card bg-white/5 hover:bg-white/10 transition-all font-bold uppercase tracking-[0.3em] text-xs">
                   <Download size={16} />
                   Download Complete Dataset (.CSV)
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
