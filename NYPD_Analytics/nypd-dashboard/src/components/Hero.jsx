import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Shield, Database, MapPin, BarChart3 } from 'lucide-react';

function AnimatedCounter({ end, duration = 2, suffix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const inView = useInView(ref, { once: true });

    useEffect(() => {
        if (!inView) return;
        let start = 0;
        const increment = end / (duration * 60);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 1000 / 60);
        return () => clearInterval(timer);
    }, [inView, end, duration]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function Hero() {
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
            }} />

            <div className="relative z-10 text-center px-6 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8"
                >
                    <Shield size={16} />
                    End-to-End Data Analytics Pipeline
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-black mb-6 leading-tight"
                >
                    <span className="gradient-text">NYPD Crime Data</span>
                    <br />
                    <span className="text-white">Analytics Pipeline</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-xl text-slate-400 max-w-2xl mx-auto mb-12"
                >
                    A comprehensive analysis of NYPD complaint data across New York City —
                    from raw data ingestion through machine learning modeling to actionable policy recommendations.
                </motion.p>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                >
                    {[
                        { icon: <Database size={24} />, value: 438556, label: 'Records Analyzed', suffix: '' },
                        { icon: <BarChart3 size={24} />, value: 36, label: 'Data Features', suffix: '' },
                        { icon: <MapPin size={24} />, value: 5, label: 'NYC Boroughs', suffix: '' },
                        { icon: <Shield size={24} />, value: 10, label: 'Pipeline Stages', suffix: '' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.8 + i * 0.1 }}
                            className="stat-card flex flex-col items-center gap-2 p-6"
                        >
                            <div className="text-blue-400">{stat.icon}</div>
                            <div className="text-3xl font-bold mono">
                                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                            </div>
                            <div className="text-sm text-slate-400">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-6 h-10 rounded-full border-2 border-slate-600 flex items-start justify-center p-2"
                    >
                        <motion.div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}
