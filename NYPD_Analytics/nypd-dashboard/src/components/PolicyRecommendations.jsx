import { motion } from 'framer-motion';
import { policyRecommendations } from '../data/mockData';
import { ArrowRight } from 'lucide-react';

export default function PolicyRecommendations() {
    return (
        <section id="policy" className="section-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold mb-2 gradient-text">Policy Recommendations</h2>
                <p className="text-slate-400 mb-8 text-lg">Actionable, data-driven recommendations derived from model analysis</p>
            </motion.div>

            <div className="space-y-6">
                {policyRecommendations.map((rec, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="glass-card p-6 md:p-8"
                        style={{ borderColor: `${rec.color}20` }}
                    >
                        <div className="flex items-start gap-4">
                            <div className="text-4xl flex-shrink-0">{rec.icon}</div>
                            <div className="flex-1 space-y-4">
                                {/* Finding */}
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400">FINDING</span>
                                    </div>
                                    <p className="text-white font-medium">{rec.finding}</p>
                                </div>

                                <ArrowRight size={18} className="text-slate-600" />

                                {/* Implication */}
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">IMPLICATION</span>
                                    </div>
                                    <p className="text-slate-300 text-sm">{rec.implication}</p>
                                </div>

                                <ArrowRight size={18} className="text-slate-600" />

                                {/* Recommendation */}
                                <div className="p-4 rounded-xl" style={{ background: `${rec.color}10`, border: `1px solid ${rec.color}20` }}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: `${rec.color}30`, color: rec.color }}>
                                            RECOMMENDATION
                                        </span>
                                    </div>
                                    <p className="text-white font-medium text-sm">{rec.recommendation}</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
