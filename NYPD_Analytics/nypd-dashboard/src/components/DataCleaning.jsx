import { motion } from 'framer-motion';
import { cleaningSteps } from '../data/mockData';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function DataCleaning() {
    return (
        <section id="cleaning" className="section-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold mb-2 gradient-text">Data Cleaning</h2>
                <p className="text-slate-400 mb-8 text-lg">Visualizing the preprocessing pipeline that transformed raw data into analysis-ready records</p>
            </motion.div>

            {/* Before/After summary */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center gap-6 mb-12"
            >
                <div className="flex-1 glass-card p-6 text-center">
                    <div className="text-sm text-slate-400 mb-2">Before Cleaning</div>
                    <div className="text-4xl font-bold mono text-red-400">438,556</div>
                    <div className="text-sm text-slate-500 mt-1">raw rows • 36 columns</div>
                </div>
                <motion.div
                    animate={{ x: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <ArrowRight size={32} className="text-blue-400" />
                </motion.div>
                <div className="flex-1 glass-card p-6 text-center">
                    <div className="text-sm text-slate-400 mb-2">After Cleaning</div>
                    <div className="text-4xl font-bold mono text-green-400">435,650</div>
                    <div className="text-sm text-slate-500 mt-1">clean rows • validated types</div>
                </div>
                <div className="flex-1 glass-card p-6 text-center" style={{ borderColor: 'rgba(139, 92, 246, 0.2)' }}>
                    <div className="text-sm text-slate-400 mb-2">Rows Removed</div>
                    <div className="text-4xl font-bold mono text-purple-400">2,906</div>
                    <div className="text-sm text-slate-500 mt-1">0.66% of total</div>
                </div>
            </motion.div>

            {/* Progress bar */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mb-12"
            >
                <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Data Retention Rate</span>
                    <span className="mono font-bold text-green-400">99.34%</span>
                </div>
                <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '99.34%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #10b981, #3b82f6)' }}
                    />
                </div>
            </motion.div>

            {/* Cleaning steps */}
            <div className="space-y-4">
                {cleaningSteps.map((step, i) => (
                    <motion.div
                        key={step.step}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-3xl mt-1">{step.icon}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-lg font-semibold text-white">{step.step}</h3>
                                    <CheckCircle2 size={18} className="text-green-400" />
                                    {step.rowsAffected > 0 && (
                                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 mono">
                                            −{step.rowsAffected.toLocaleString()} rows
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-400 text-sm mb-3">{step.description}</p>
                                <div className="flex gap-6 text-xs">
                                    <div>
                                        <span className="text-slate-500">Before: </span>
                                        <span className="mono text-slate-300">{step.before}</span>
                                    </div>
                                    <ArrowRight size={14} className="text-slate-600 mt-0.5" />
                                    <div>
                                        <span className="text-slate-500">After: </span>
                                        <span className="mono text-green-400">{step.after}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
