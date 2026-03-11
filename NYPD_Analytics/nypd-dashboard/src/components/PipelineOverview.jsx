import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { pipelineStages } from '../data/mockData';

export default function PipelineOverview() {
    const [activeStage, setActiveStage] = useState(null);

    return (
        <section id="pipeline" className="section-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold mb-2 gradient-text">Pipeline Overview</h2>
                <p className="text-slate-400 mb-12 text-lg">Click each stage to explore the details of our 10-step analytics pipeline</p>
            </motion.div>

            {/* Pipeline diagram */}
            <div className="relative">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                    {pipelineStages.map((stage, idx) => (
                        <motion.div
                            key={stage.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.08 }}
                        >
                            <motion.button
                                onClick={() => setActiveStage(activeStage === stage.id ? null : stage.id)}
                                whileHover={{ scale: 1.05, y: -4 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full p-4 rounded-xl border transition-all duration-300 text-left cursor-pointer ${activeStage === stage.id
                                        ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500/40 shadow-lg shadow-blue-500/10'
                                        : 'glass-card hover:border-blue-500/30'
                                    }`}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-2xl">{stage.icon}</span>
                                    <span
                                        className="text-xs font-bold mono px-2 py-0.5 rounded-full"
                                        style={{ background: `${stage.color}20`, color: stage.color }}
                                    >
                                        S{stage.id}
                                    </span>
                                </div>
                                <h3 className="text-sm font-semibold text-white">{stage.title}</h3>
                            </motion.button>

                            {/* Connector arrow */}
                            {idx < pipelineStages.length - 1 && idx % 5 !== 4 && (
                                <div className="hidden md:flex items-center justify-center absolute" style={{ right: '-12px', top: '50%' }}>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Detail panel */}
                <AnimatePresence>
                    {activeStage && (
                        <motion.div
                            key={activeStage}
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            {pipelineStages.filter(s => s.id === activeStage).map((stage) => (
                                <div
                                    key={stage.id}
                                    className="glass-card p-8 mt-4"
                                    style={{ borderColor: `${stage.color}30` }}
                                >
                                    <div className="flex items-center gap-4 mb-4">
                                        <span className="text-4xl">{stage.icon}</span>
                                        <div>
                                            <span className="text-xs font-bold mono px-3 py-1 rounded-full" style={{ background: `${stage.color}20`, color: stage.color }}>
                                                Stage {stage.id}
                                            </span>
                                            <h3 className="text-2xl font-bold mt-1 text-white">{stage.title}</h3>
                                        </div>
                                    </div>
                                    <p className="text-slate-300 text-base leading-relaxed">{stage.description}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
