import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Menu, X } from 'lucide-react';

import Hero from './components/Hero';
import PipelineOverview from './components/PipelineOverview';
import DatasetExplorer from './components/DatasetExplorer';
import EDASection from './components/EDASection';
import CrimeMap from './components/CrimeMap';
import DataCleaning from './components/DataCleaning';
import FeatureEngineering from './components/FeatureEngineering';
import ModelingSection from './components/ModelingSection';
import ModelInterpretability from './components/ModelInterpretability';
import KeyInsights from './components/KeyInsights';
import PolicyRecommendations from './components/PolicyRecommendations';
import FutureWork from './components/FutureWork';

const navItems = [
  { id: 'hero', label: 'Home', emoji: '🏠' },
  { id: 'pipeline', label: 'Pipeline', emoji: '⚡' },
  { id: 'dataset', label: 'Dataset', emoji: '📊' },
  { id: 'eda', label: 'EDA', emoji: '🔍' },
  { id: 'map', label: 'Map', emoji: '🗺️' },
  { id: 'cleaning', label: 'Cleaning', emoji: '🧹' },
  { id: 'features', label: 'Features', emoji: '⚙️' },
  { id: 'modeling', label: 'Models', emoji: '🤖' },
  { id: 'interpretability', label: 'SHAP', emoji: '💡' },
  { id: 'insights', label: 'Insights', emoji: '📈' },
  { id: 'policy', label: 'Policy', emoji: '📋' },
  { id: 'future', label: 'Future', emoji: '🔮' },
];

function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' }
    );

    navItems.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex">
      {/* Desktop sidebar — wider with text labels for discoverability */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-48 flex-col py-6 z-50 bg-gray-950/90 backdrop-blur-xl border-r border-white/10">
        {/* Logo */}
        <div className="flex items-center gap-2 px-5 mb-6">
          <Shield size={22} className="text-blue-400" />
          <span className="text-sm font-bold text-white tracking-tight">NYPD Analytics</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mx-4 mb-3" />

        {/* Nav items with labels */}
        <div className="flex-1 flex flex-col gap-0.5 px-3 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 cursor-pointer ${activeSection === item.id
                ? 'bg-blue-500/15 text-white'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
            >
              {/* Active indicator bar */}
              {activeSection === item.id && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute left-0 top-1 bottom-1 w-[3px] bg-blue-400 rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <span className="text-base w-6 text-center flex-shrink-0">{item.emoji}</span>
              <span className={`text-sm font-medium ${activeSection === item.id ? 'text-white' : ''}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 pt-4 border-t border-white/10 mt-2">
          <div className="text-xs text-slate-500">10 Pipeline Stages</div>
          <div className="text-xs text-slate-600">438K+ Records</div>
        </div>
      </nav>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-gray-950/90 backdrop-blur-xl border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield size={20} className="text-blue-400" />
          <span className="text-sm font-semibold text-white">NYPD Analytics</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-white cursor-pointer">
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="lg:hidden fixed inset-0 z-40 bg-gray-950/95 backdrop-blur-xl pt-16"
          >
            <div className="flex flex-col gap-1 p-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all cursor-pointer ${activeSection === item.id
                    ? 'bg-blue-500/20 text-white'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <span className="text-lg">{item.emoji}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content — 200px left margin on desktop to clear the 192px sidebar */}
      <main className="flex-1 min-w-0 main-content">
        <Hero />
        <div className="border-t border-white/5">
          <PipelineOverview />
        </div>
        <div className="border-t border-white/5 bg-gradient-to-b from-blue-950/10 to-transparent">
          <DatasetExplorer />
        </div>
        <div className="border-t border-white/5">
          <EDASection />
        </div>
        <div className="border-t border-white/5 bg-gradient-to-b from-cyan-950/10 to-transparent">
          <CrimeMap />
        </div>
        <div className="border-t border-white/5">
          <DataCleaning />
        </div>
        <div className="border-t border-white/5 bg-gradient-to-b from-purple-950/10 to-transparent">
          <FeatureEngineering />
        </div>
        <div className="border-t border-white/5">
          <ModelingSection />
        </div>
        <div className="border-t border-white/5 bg-gradient-to-b from-pink-950/10 to-transparent">
          <ModelInterpretability />
        </div>
        <div className="border-t border-white/5">
          <KeyInsights />
        </div>
        <div className="border-t border-white/5 bg-gradient-to-b from-green-950/10 to-transparent">
          <PolicyRecommendations />
        </div>
        <div className="border-t border-white/5">
          <FutureWork />
        </div>
      </main>
    </div>
  );
}

export default App;
