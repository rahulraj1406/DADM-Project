import { motion } from 'framer-motion';
import { useState } from 'react';
import { dataDictionary, datasetStats } from '../data/mockData';
import { Search, Database, Columns3, AlertTriangle, MapPin } from 'lucide-react';

export default function DatasetExplorer() {
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');

    const dtypes = ['All', ...new Set(dataDictionary.map(d => d.dtype))];

    const filtered = dataDictionary.filter(d => {
        const matchesSearch = d.field.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'All' || d.dtype === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <section id="dataset" className="section-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold mb-2 gradient-text">Dataset Explorer</h2>
                <p className="text-slate-400 mb-8 text-lg">Explore the NYPD Complaint Data schema — 438,556 records across 36 features</p>
            </motion.div>

            {/* Summary cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
                {[
                    { icon: <Database size={20} />, label: 'Total Records', value: datasetStats.totalRecords.toLocaleString(), color: '#3b82f6' },
                    { icon: <Columns3 size={20} />, label: 'Features', value: datasetStats.columns, color: '#8b5cf6' },
                    { icon: <AlertTriangle size={20} />, label: 'High Null Cols', value: '2 (>50%)', color: '#f59e0b' },
                    { icon: <MapPin size={20} />, label: 'Precincts', value: datasetStats.precincts, color: '#10b981' },
                ].map((card, i) => (
                    <motion.div
                        key={card.label}
                        whileHover={{ y: -4 }}
                        className="glass-card p-5 flex flex-col gap-2"
                        style={{ borderColor: `${card.color}20` }}
                    >
                        <div style={{ color: card.color }}>{card.icon}</div>
                        <div className="text-2xl font-bold mono text-white">{card.value}</div>
                        <div className="text-sm text-slate-400">{card.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search fields..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 transition-colors"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {dtypes.map(dt => (
                        <button
                            key={dt}
                            onClick={() => setFilterType(dt)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${filterType === dt
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                                }`}
                        >
                            {dt}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="glass-card overflow-hidden"
            >
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left p-4 text-sm font-semibold text-slate-300">Field Name</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-300">Type</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-300">Null %</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-300">Unique</th>
                                <th className="text-left p-4 text-sm font-semibold text-slate-300 hidden md:table-cell">Sample Values</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((row, i) => (
                                <motion.tr
                                    key={row.field}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                                >
                                    <td className="p-4 mono text-sm text-blue-300 font-medium">{row.field}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${row.dtype === 'Numeric' ? 'bg-green-500/20 text-green-400' :
                                                row.dtype === 'Categorical' ? 'bg-purple-500/20 text-purple-400' :
                                                    row.dtype === 'Date' ? 'bg-blue-500/20 text-blue-400' :
                                                        row.dtype === 'Time' ? 'bg-cyan-500/20 text-cyan-400' :
                                                            row.dtype === 'Geospatial' ? 'bg-orange-500/20 text-orange-400' :
                                                                'bg-pink-500/20 text-pink-400'
                                            }`}>
                                            {row.dtype}
                                        </span>
                                    </td>
                                    <td className="p-4 mono text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${Math.min(row.nullPct, 100)}%`,
                                                        background: row.nullPct > 50 ? '#ef4444' : row.nullPct > 10 ? '#f59e0b' : '#10b981',
                                                    }}
                                                />
                                            </div>
                                            <span className={row.nullPct > 50 ? 'text-red-400' : 'text-slate-400'}>{row.nullPct}%</span>
                                        </div>
                                    </td>
                                    <td className="p-4 mono text-sm text-slate-300">{row.unique.toLocaleString()}</td>
                                    <td className="p-4 text-xs text-slate-500 hidden md:table-cell max-w-xs truncate">{row.sample}</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </section>
    );
}
