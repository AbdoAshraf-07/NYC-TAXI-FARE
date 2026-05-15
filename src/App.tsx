/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/Dashboard';
import { LivePredictionView } from './components/LivePrediction';
import { BatchPredictionView } from './components/BatchPrediction';
import { Tab } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-taxi-yellow/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-taxi-orange/5 blur-[150px] rounded-full" />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-taxi-green/5 blur-[100px] rounded-full opacity-50" />
      </div>

      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-[1400px] mx-auto w-full px-6 py-10 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'live' && <LivePredictionView />}
            {activeTab === 'batch' && <BatchPredictionView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/5 py-8 px-6 text-center text-[10px] uppercase font-bold tracking-[0.4em] text-slate-600 relative z-10">
        NYC Taxi Predictor &bull; Neural Inference Logic &bull; Systems Active
      </footer>
    </div>
  );
}
