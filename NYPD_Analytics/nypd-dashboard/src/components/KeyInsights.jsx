import { motion } from 'framer-motion';
import { keyInsights, hypothesisTests } from '../data/mockData';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function KeyInsights() {
    return (
        <section id="insights" className="section-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold mb-2 gradient-text">Key Insights</h2>
                <p className="text-slate-400 mb-8 text-lg">Critical findings from the analysis of 438,556 NYPD complaint records</p>
            </motion.div>

            {/* Insight cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
                {keyInsights.map((insight, i) => (
                    <motion.div
                        key={insight.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.1 }}
                        whileHover={{ y: -6, scale: 1.02 }}
                        className="glass-card p-6 cursor-default"
                        style={{ borderColor: `${insight.color}20` }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl">{insight.icon}</span>
                            <div>
                                <h3 className="text-sm font-semibold text-white">{insight.title}</h3>
                                <div className="text-2xl font-bold mono" style={{ color: insight.color }}>{insight.value}</div>
                            </div>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">{insight.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* Hypothesis tests */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <h3 className="text-xl font-semibold text-white mb-4">Statistical Hypothesis Tests</h3>
                <div className="space-y-3">
                    {hypothesisTests.map((test, i) => (
                        <motion.div
                            key={test.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                            className="glass-card p-5"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-4">
                                <div className="flex items-center gap-3 flex-1">
                                    <span className="text-xs font-bold mono px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400">{test.id}</span>
                                    <div>
                                        <h4 className="text-sm font-medium text-white">{test.hypothesis}</h4>
                                        <span className="text-xs text-slate-500">{test.test} Test</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500">Statistic</div>
                                        <div className="mono text-sm text-white">{test.statistic.toFixed(2)}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-slate-500">p-value</div>
                                        <div className="mono text-sm text-white">{test.pValue < 0.001 ? '<0.001' : test.pValue.toFixed(4)}</div>
                                    </div>
                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${test.significant ? 'bg-green-500/20 text-green-400' : 'bg-red-500/10 text-red-400'
                                        }`}>
                                        {test.significant ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                                        {test.conclusion}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
