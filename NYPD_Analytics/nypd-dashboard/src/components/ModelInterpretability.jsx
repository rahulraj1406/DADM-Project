import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { shapFeatureImportance } from '../data/mockData';

const COLORS = ['#ef4444', '#f59e0b', '#f59e0b', '#3b82f6', '#3b82f6', '#8b5cf6', '#8b5cf6', '#06b6d4', '#06b6d4', '#10b981', '#10b981', '#64748b'];

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-xl">
            <p className="text-white font-medium text-sm mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="text-sm" style={{ color: p.fill }}>
                    SHAP Importance: <span className="font-bold mono">{p.value?.toFixed(3)}</span>
                </p>
            ))}
        </div>
    );
};

const topPredictors = [
    {
        feature: 'HIGH_CRIME_PRECINCT',
        importance: '34.2%',
        explanation: 'Location is the strongest predictor. Precincts in the top-quartile complaint volume are overwhelmingly associated with felony classification.',
        icon: '📍',
        color: '#ef4444',
    },
    {
        feature: 'OFNS_DESC_FREQ',
        importance: '28.7%',
        explanation: 'The frequency-encoded offense description captures the baseline probability of each offense type being a felony vs. misdemeanor.',
        icon: '📋',
        color: '#f59e0b',
    },
    {
        feature: 'HOUR',
        importance: '19.8%',
        explanation: 'Time of complaint filing strongly differentiates crime severity. Late-night complaints (10 PM–4 AM) have higher felony rates.',
        icon: '🕐',
        color: '#3b82f6',
    },
    {
        feature: 'GEO_CLUSTER',
        importance: '17.6%',
        explanation: 'KMeans clusters capture neighborhood-level patterns beyond precinct boundaries, identifying micro-geographic risk zones.',
        icon: '🗺️',
        color: '#8b5cf6',
    },
];

export default function ModelInterpretability() {
    return (
        <section id="interpretability" className="section-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold mb-2 gradient-text">Model Interpretability</h2>
                <p className="text-slate-400 mb-8 text-lg">SHAP-based feature importance analysis revealing key drivers of felony prediction</p>
            </motion.div>

            {/* SHAP bar chart */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="chart-container mb-8"
            >
                <h3 className="text-lg font-semibold text-white mb-4">SHAP Feature Importance (Top 12)</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={shapFeatureImportance} layout="vertical" margin={{ top: 10, right: 30, left: 160, bottom: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                        <YAxis type="category" dataKey="feature" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }} width={160} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="importance" name="Importance" radius={[0, 6, 6, 0]}>
                            {shapFeatureImportance.map((_, i) => (
                                <Cell key={i} fill={COLORS[i]} opacity={0.9} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </motion.div>

            {/* Top predictors */}
            <h3 className="text-xl font-semibold text-white mb-4">Top Predictors Explained</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topPredictors.map((pred, i) => (
                    <motion.div
                        key={pred.feature}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        whileHover={{ y: -4 }}
                        className="glass-card p-6"
                        style={{ borderColor: `${pred.color}20` }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl">{pred.icon}</span>
                            <div>
                                <span className="mono text-sm font-bold" style={{ color: pred.color }}>{pred.feature}</span>
                                <div className="text-sm text-slate-400">Importance: <span className="font-bold mono text-white">{pred.importance}</span></div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{pred.explanation}</p>
                    </motion.div>
                ))}
            </div>

            {/* Key insight callout */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mt-8 p-6 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
            >
                <div className="flex items-start gap-4">
                    <span className="text-3xl">💡</span>
                    <div>
                        <h4 className="text-lg font-semibold text-white mb-1">Key Policy Insight</h4>
                        <p className="text-slate-300">The model heavily prioritizes <strong className="text-white">Precinct Geography</strong> and specific temporal markers over other variables in predicting felony severity. This suggests geographically-focused interventions may be more effective than demographic-based approaches.</p>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
