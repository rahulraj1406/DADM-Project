import { motion } from 'framer-motion';
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, LabelList } from 'recharts';
import { modelResults, forecastResults, confusionMatrixData } from '../data/mockData';

/* Distinct metric colors — each metric gets its own color consistently */
const METRIC_COLORS = {
    Accuracy: '#59a14f',   // green
    F1: '#4e79a7',         // blue
    'F1 Macro': '#4e79a7', // blue (same metric, same color)
    'ROC AUC': '#f28e2b',  // orange
    MAE: '#e15759',        // red (error metric)
    RMSE: '#b07aa1',       // purple (error metric)
};

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg p-3 shadow-xl">
            <p className="text-white font-medium text-sm mb-1">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="text-sm" style={{ color: p.color || p.fill }}>
                    {p.name}: <span className="font-bold mono">{typeof p.value === 'number' ? p.value.toFixed?.(3) ?? p.value : p.value}</span>
                </p>
            ))}
        </div>
    );
};

const taskTabs = ['Task A', 'Task B', 'Task C'];

export default function ModelingSection() {
    const [activeTask, setActiveTask] = useState('Task A');

    const taskAModels = modelResults.filter(m => m.task === 'Task A');
    const taskBModels = modelResults.filter(m => m.task === 'Task B');

    const taskAChartData = taskAModels.map(m => ({
        model: m.model.replace('A', ''),
        Accuracy: m.accuracy,
        F1: m.f1,
        'ROC AUC': m.rocAuc,
    }));

    const taskBChartData = taskBModels.map(m => ({
        model: m.model.replace('B', ''),
        Accuracy: m.accuracy,
        'F1 Macro': m.f1,
    }));

    const forecastChartData = forecastResults.map(f => ({
        precinct: `Pct ${f.precinct}`,
        MAE: f.mae,
        RMSE: f.rmse,
        MAPE: f.mape,
    }));

    return (
        <section id="modeling" className="section-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold mb-2 gradient-text">Machine Learning Models</h2>
                <p className="text-slate-400 mb-8 text-lg">Three modeling tasks: binary classification, multi-class categorization, and time series forecasting</p>
            </motion.div>

            {/* Task tabs — clear active/inactive states */}
            <div className="flex gap-3 mb-8">
                {taskTabs.map((tab) => (
                    <motion.button
                        key={tab}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveTask(tab)}
                        className={`px-6 py-3 rounded-xl font-medium transition-all cursor-pointer border ${activeTask === tab
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 border-blue-400/50 ring-2 ring-blue-400/20'
                            : 'bg-white/3 text-slate-400 hover:text-white border-white/5 hover:border-white/15'
                            }`}
                    >
                        {tab}
                    </motion.button>
                ))}
            </div>

            <motion.div
                key={activeTask}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {activeTask === 'Task A' && (
                    <div className="space-y-6">
                        <div className="glass-card p-6">
                            <h3 className="text-xl font-semibold text-white mb-2">Task A: Binary Felony Classification</h3>
                            <p className="text-slate-400 text-sm mb-6">Predicts whether a complaint is a FELONY (IS_FELONY = 1) using Logistic Regression, Random Forest, and XGBoost.</p>

                            {/* Metrics table */}
                            <div className="overflow-x-auto mb-6">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left p-3 text-sm font-semibold text-slate-300">Model</th>
                                            <th className="text-center p-3 text-sm font-semibold text-slate-300">Accuracy</th>
                                            <th className="text-center p-3 text-sm font-semibold text-slate-300">Precision</th>
                                            <th className="text-center p-3 text-sm font-semibold text-slate-300">Recall</th>
                                            <th className="text-center p-3 text-sm font-semibold text-slate-300">F1 Macro</th>
                                            <th className="text-center p-3 text-sm font-semibold text-slate-300">ROC AUC</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {taskAModels.map((m) => (
                                            <tr key={m.model} className="border-b border-white/5 hover:bg-white/5">
                                                <td className="p-3 text-sm font-medium text-white">{m.model}</td>
                                                <td className="p-3 text-center mono text-sm text-green-400">{m.accuracy?.toFixed(3)}</td>
                                                <td className="p-3 text-center mono text-sm text-green-400">{m.precision?.toFixed(3)}</td>
                                                <td className="p-3 text-center mono text-sm text-green-400">{m.recall?.toFixed(3)}</td>
                                                <td className="p-3 text-center mono text-sm text-green-400">{m.f1?.toFixed(3)}</td>
                                                <td className="p-3 text-center mono text-sm text-green-400">{m.rocAuc?.toFixed(3)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Confusion matrix */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-300 mb-3">Confusion Matrix (Best Model)</h4>
                                    <div className="grid grid-cols-2 gap-2 max-w-xs">
                                        <div className="p-4 rounded-lg bg-green-500/20 text-center">
                                            <div className="text-xs text-green-400/70">True Negative</div>
                                            <div className="text-2xl font-bold mono text-green-400">{confusionMatrixData.taskA.tn}</div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-red-500/10 text-center">
                                            <div className="text-xs text-red-400/70">False Positive</div>
                                            <div className="text-2xl font-bold mono text-red-400">{confusionMatrixData.taskA.fp}</div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-red-500/10 text-center">
                                            <div className="text-xs text-red-400/70">False Negative</div>
                                            <div className="text-2xl font-bold mono text-red-400">{confusionMatrixData.taskA.fn}</div>
                                        </div>
                                        <div className="p-4 rounded-lg bg-green-500/20 text-center">
                                            <div className="text-xs text-green-400/70">True Positive</div>
                                            <div className="text-2xl font-bold mono text-green-400">{confusionMatrixData.taskA.tp}</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-slate-300 mb-3">Model Comparison</h4>
                                    <ResponsiveContainer width="100%" height={240}>
                                        <BarChart data={taskAChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                            <XAxis dataKey="model" tick={{ fill: '#cbd5e1', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} label={{ value: 'Model', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 11 }} />
                                            <YAxis domain={[0.99, 1.001]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} label={{ value: 'Score', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8', fontSize: 11 }} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend verticalAlign="top" height={30} formatter={(v) => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{v}</span>} />
                                            <Bar dataKey="Accuracy" fill={METRIC_COLORS.Accuracy} radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="F1" fill={METRIC_COLORS.F1} radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTask === 'Task B' && (
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">Task B: Multi-Class Offense Categorization</h3>
                        <p className="text-slate-400 text-sm mb-6">Classifies complaints into 5 offense categories: VIOLENT, PROPERTY, DRUG, QUALITY_OF_LIFE, OTHER.</p>

                        <div className="overflow-x-auto mb-6">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left p-3 text-sm font-semibold text-slate-300">Model</th>
                                        <th className="text-center p-3 text-sm font-semibold text-slate-300">Accuracy</th>
                                        <th className="text-center p-3 text-sm font-semibold text-slate-300">F1 Macro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {taskBModels.map((m) => (
                                        <tr key={m.model} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="p-3 text-sm font-medium text-white">{m.model}</td>
                                            <td className="p-3 text-center mono text-sm text-green-400">{m.accuracy?.toFixed(3)}</td>
                                            <td className="p-3 text-center mono text-sm text-cyan-400">{m.f1?.toFixed(3)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={taskBChartData} margin={{ top: 10, right: 20, left: 20, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis dataKey="model" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} label={{ value: 'Model', position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis domain={[0, 1.1]} tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} label={{ value: 'Score', angle: -90, position: 'insideLeft', offset: 5, fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="top" height={30} formatter={(v) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{v}</span>} />
                                <Bar dataKey="Accuracy" fill={METRIC_COLORS.Accuracy} radius={[6, 6, 0, 0]} />
                                <Bar dataKey="F1 Macro" fill={METRIC_COLORS['F1 Macro']} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {activeTask === 'Task C' && (
                    <div className="glass-card p-6">
                        <h3 className="text-xl font-semibold text-white mb-2">Task C: Time Series Forecasting</h3>
                        <p className="text-slate-400 text-sm mb-6">Prophet models forecasting weekly complaint volumes for the top 5 highest-volume precincts.</p>

                        <div className="overflow-x-auto mb-6">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="text-left p-3 text-sm font-semibold text-slate-300">Precinct</th>
                                        <th className="text-center p-3 text-sm font-semibold text-slate-300">MAE</th>
                                        <th className="text-center p-3 text-sm font-semibold text-slate-300">RMSE</th>
                                        <th className="text-center p-3 text-sm font-semibold text-slate-300">MAPE (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {forecastResults.map((f) => (
                                        <tr key={f.precinct} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="p-3 text-sm font-medium text-white">Precinct {f.precinct}</td>
                                            <td className="p-3 text-center mono text-sm text-blue-400">{f.mae.toFixed(1)}</td>
                                            <td className="p-3 text-center mono text-sm text-purple-400">{f.rmse.toFixed(1)}</td>
                                            <td className="p-3 text-center mono text-sm text-orange-400">{f.mape.toFixed(1)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <ResponsiveContainer width="100%" height={320}>
                            <BarChart data={forecastChartData} margin={{ top: 10, right: 20, left: 20, bottom: 25 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis dataKey="precinct" tick={{ fill: '#cbd5e1', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} label={{ value: 'Precinct', position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 12 }} />
                                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} label={{ value: 'Error Value', angle: -90, position: 'insideLeft', offset: 5, fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="top" height={30} formatter={(v) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{v}</span>} />
                                <Bar dataKey="MAE" fill={METRIC_COLORS.MAE} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="RMSE" fill={METRIC_COLORS.RMSE} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </motion.div>
        </section>
    );
}
