import { motion } from 'framer-motion';
import { engineeredFeatures } from '../data/mockData';
import { ArrowRight } from 'lucide-react';

export default function FeatureEngineering() {
    return (
        <section id="features" className="section-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold mb-2 gradient-text">Feature Engineering</h2>
                <p className="text-slate-400 mb-8 text-lg">Transforming raw complaint fields into 20 machine-learning-ready features</p>
            </motion.div>

            {/* Transformation flow */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card p-8 mb-8"
            >
                <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                    <div className="text-center">
                        <div className="text-4xl mb-2">📋</div>
                        <div className="text-sm font-semibold text-white">Raw Dataset</div>
                        <div className="text-xs text-slate-400">36 columns</div>
                    </div>
                    <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <ArrowRight className="text-blue-400" size={24} />
                    </motion.div>
                    <div className="text-center">
                        <div className="text-4xl mb-2">⚙️</div>
                        <div className="text-sm font-semibold text-white">Feature Extraction</div>
                        <div className="text-xs text-slate-400">Temporal + Geo + Encoding</div>
                    </div>
                    <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}>
                        <ArrowRight className="text-purple-400" size={24} />
                    </motion.div>
                    <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <div className="text-sm font-semibold text-white">Scaling & OHE</div>
                        <div className="text-xs text-slate-400">StandardScaler + One-Hot</div>
                    </div>
                    <motion.div animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}>
                        <ArrowRight className="text-cyan-400" size={24} />
                    </motion.div>
                    <div className="text-center">
                        <div className="text-4xl mb-2">🤖</div>
                        <div className="text-sm font-semibold text-white">Model-Ready</div>
                        <div className="text-xs text-slate-400">20 features</div>
                    </div>
                </div>
            </motion.div>

            {/* Feature categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {engineeredFeatures.map((cat, i) => (
                    <motion.div
                        key={cat.category}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="glass-card p-6"
                        style={{ borderColor: `${cat.color}20` }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ background: cat.color }}
                            />
                            <h3 className="text-lg font-semibold text-white">{cat.category}</h3>
                            <span
                                className="text-xs font-bold mono px-2 py-0.5 rounded-full ml-auto"
                                style={{ background: `${cat.color}20`, color: cat.color }}
                            >
                                {cat.features.length}
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-4">{cat.description}</p>
                        <div className="flex flex-wrap gap-2">
                            {cat.features.map((f) => (
                                <span
                                    key={f}
                                    className="mono text-xs px-2.5 py-1 rounded-lg"
                                    style={{ background: `${cat.color}10`, color: cat.color, border: `1px solid ${cat.color}20` }}
                                >
                                    {f}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Key transformations */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 glass-card p-6"
            >
                <h3 className="text-lg font-semibold text-white mb-4">Key Transformations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { from: 'CMPLNT_FR_TM', to: 'HOUR', desc: 'Parse time string → extract hour (0-23)', color: '#3b82f6' },
                        { from: 'CMPLNT_FR_DT → RPT_DT', to: 'DAYS_TO_REPORT', desc: 'Compute reporting delay in days (clipped ≥ 0)', color: '#8b5cf6' },
                        { from: 'ADDR_PCT_CD', to: 'HIGH_CRIME_PRECINCT', desc: 'Flag precincts in top-25% complaint volume quartile', color: '#06b6d4' },
                        { from: 'Lat, Lon', to: 'GEO_CLUSTER', desc: 'KMeans clustering (k=15) on geographic coordinates', color: '#10b981' },
                    ].map((t, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/3">
                            <span className="mono text-xs px-2 py-1 rounded bg-white/5 text-slate-300 whitespace-nowrap">{t.from}</span>
                            <ArrowRight size={14} className="text-slate-600 flex-shrink-0" />
                            <span className="mono text-xs px-2 py-1 rounded font-bold whitespace-nowrap" style={{ background: `${t.color}20`, color: t.color }}>
                                {t.to}
                            </span>
                            <span className="text-xs text-slate-400 hidden md:inline">{t.desc}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
