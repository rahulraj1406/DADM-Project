import { motion } from 'framer-motion';
import { futureWorkItems } from '../data/mockData';

export default function FutureWork() {
    return (
        <section id="future" className="section-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold mb-2 gradient-text">Future Work</h2>
                <p className="text-slate-400 mb-8 text-lg">Roadmap for extending the analytics pipeline with advanced capabilities</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {futureWorkItems.map((item, i) => (
                    <motion.div
                        key={item.priority}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        whileHover={{ y: -6 }}
                        className="glass-card p-6 relative overflow-hidden"
                        style={{ borderColor: `${item.color}20` }}
                    >
                        {/* Priority badge */}
                        <div
                            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                            style={{ background: `${item.color}20`, color: item.color }}
                        >
                            {item.priority}
                        </div>

                        {/* Glow effect */}
                        <div
                            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-10"
                            style={{ background: item.color }}
                        />

                        <div className="relative">
                            <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                            <p className="text-sm text-slate-400 mb-4">{item.description}</p>
                            <div className="space-y-2">
                                {item.items.map((subItem, j) => (
                                    <motion.div
                                        key={j}
                                        initial={{ opacity: 0, x: -10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 + j * 0.05 }}
                                        className="flex items-center gap-3 p-2.5 rounded-lg bg-white/3"
                                    >
                                        <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />
                                        <span className="text-sm text-slate-300">{subItem}</span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Progress bar */}
                            <div className="mt-4">
                                <div className="flex justify-between text-xs text-slate-500 mb-1">
                                    <span>Priority Level</span>
                                    <span className="mono">{item.priority}/4</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(5 - item.priority) / 4 * 100}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: i * 0.2 }}
                                        className="h-full rounded-full"
                                        style={{ background: item.color }}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="mt-16 text-center"
            >
                <div className="glass-card p-8 max-w-2xl mx-auto">
                    <h3 className="text-2xl font-bold gradient-text mb-3">NYPD Crime Data Analytics Pipeline</h3>
                    <p className="text-slate-400 text-sm mb-4">
                        An end-to-end data science pipeline built for the Data Analytics & Data Mining course.
                        Analyzing 438,556 NYPD complaint records to derive actionable public safety insights.
                    </p>
                    <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                        <span>10 Pipeline Stages</span>
                        <span>•</span>
                        <span>3 ML Tasks</span>
                        <span>•</span>
                        <span>5 Policy Recommendations</span>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
