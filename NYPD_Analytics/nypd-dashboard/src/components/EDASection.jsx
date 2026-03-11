import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, Cell, Legend, LabelList, LineChart, Line
} from 'recharts';
import {
    boroughCrimeCounts, hourlyDistribution, monthlyTrends,
    topOffenses, severityByBorough, dayOfWeekData
} from '../data/mockData';

/*── Distinct, accessible palette (colorblind-safe inspired by Tableau 10) ──*/
const BOROUGH_COLORS = {
    Brooklyn: '#4e79a7',
    Manhattan: '#e15759',
    Bronx: '#76b7b2',
    Queens: '#59a14f',
    'Staten Island': '#edc949',
};

const SEVERITY_COLORS = {
    FELONY: '#e15759',   // red – high danger
    MISDEMEANOR: '#f28e2b',   // orange – medium
    VIOLATION: '#76b7b2',   // teal – low
};

/*── Custom tooltip with clear labeling ──*/
const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-gray-900/95 backdrop-blur-sm border border-white/10 rounded-lg p-4 shadow-xl min-w-[180px]">
            <p className="text-white font-semibold text-sm mb-2 border-b border-white/10 pb-1">{label}</p>
            {payload.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-sm mt-1">
                    <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: p.color || p.fill }} />
                    <span className="text-slate-400">{p.name}:</span>
                    <span className="font-bold mono text-white ml-auto">
                        {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
                    </span>
                </div>
            ))}
        </div>
    );
};

/*── Legend with color swatches ──*/
const ColorLegend = ({ items }) => (
    <div className="flex flex-wrap gap-4 mb-4 px-2">
        {items.map(({ label, color, shape }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-slate-300">
                <span
                    className={`w-3.5 h-3.5 flex-shrink-0 ${shape === 'line' ? 'h-0.5 w-5 rounded-none' : 'rounded'}`}
                    style={{ background: color }}
                />
                {label}
            </div>
        ))}
    </div>
);

const charts = [
    { id: 'borough', title: 'Crime by Borough', icon: '🏙️', desc: 'Total complaints per borough — Brooklyn leads' },
    { id: 'hourly', title: 'Hourly Distribution', icon: '🕒', desc: 'Peak hours reveal afternoon and late-night spikes' },
    { id: 'monthly', title: 'Monthly Trends', icon: '📅', desc: 'Seasonal patterns with summer highs' },
    { id: 'offenses', title: 'Top 15 Offenses', icon: '📋', desc: 'Most frequent offense categories in the dataset' },
    { id: 'severity', title: 'Severity by Borough', icon: '⚖️', desc: 'Felony vs Misdemeanor vs Violation breakdown' },
    { id: 'dayofweek', title: 'Day of Week', icon: '📆', desc: 'Weekday vs Weekend crime volume comparison' },
];

export default function EDASection() {
    const [activeChart, setActiveChart] = useState('borough');
    const activeInfo = charts.find(c => c.id === activeChart);

    const renderChart = () => {
        switch (activeChart) {
            case 'borough':
                return (
                    <>
                        <ColorLegend items={Object.entries(BOROUGH_COLORS).map(([label, color]) => ({ label, color }))} />
                        <ResponsiveContainer width="100%" height={420}>
                            <BarChart data={boroughCrimeCounts} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#cbd5e1', fontSize: 13, fontWeight: 500 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    label={{ value: 'Borough', position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    label={{ value: 'Total Complaints', angle: -90, position: 'insideLeft', offset: 5, fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Complaints" radius={[8, 8, 0, 0]}>
                                    {boroughCrimeCounts.map((entry) => (
                                        <Cell key={entry.name} fill={BOROUGH_COLORS[entry.name] || '#4e79a7'} />
                                    ))}
                                    <LabelList dataKey="count" position="top" fill="#cbd5e1" fontSize={11} fontFamily="JetBrains Mono" formatter={(v) => v.toLocaleString()} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                );

            case 'hourly':
                return (
                    <>
                        <ColorLegend items={[
                            { label: 'Peak Hours (12PM–6PM)', color: '#e15759' },
                            { label: 'Off-Peak', color: '#4e79a7' },
                        ]} />
                        <ResponsiveContainer width="100%" height={420}>
                            <AreaChart data={hourlyDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                                <defs>
                                    <linearGradient id="hourGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4e79a7" stopOpacity={0.5} />
                                        <stop offset="95%" stopColor="#4e79a7" stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis
                                    dataKey="hour"
                                    tick={{ fill: '#94a3b8', fontSize: 11 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    label={{ value: 'Hour of Day (0 = midnight)', position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    label={{ value: 'Complaint Count', angle: -90, position: 'insideLeft', offset: 5, fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    name="Complaints"
                                    stroke="#4e79a7"
                                    fill="url(#hourGrad)"
                                    strokeWidth={2.5}
                                    dot={(props) => {
                                        const isPeak = props.payload.hour >= 12 && props.payload.hour <= 18;
                                        return (
                                            <circle
                                                key={props.index}
                                                cx={props.cx}
                                                cy={props.cy}
                                                r={isPeak ? 5 : 3}
                                                fill={isPeak ? '#e15759' : '#4e79a7'}
                                                stroke={isPeak ? '#e15759' : '#4e79a7'}
                                                strokeWidth={isPeak ? 2 : 1}
                                            />
                                        );
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </>
                );

            case 'monthly':
                return (
                    <>
                        <ColorLegend items={[
                            { label: 'Above 38K (High)', color: '#e15759' },
                            { label: '35K–38K (Medium)', color: '#f28e2b' },
                            { label: 'Below 35K', color: '#4e79a7' },
                        ]} />
                        <ResponsiveContainer width="100%" height={420}>
                            <BarChart data={monthlyTrends} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: '#cbd5e1', fontSize: 12 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    label={{ value: 'Month', position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    label={{ value: 'Complaint Count', angle: -90, position: 'insideLeft', offset: 5, fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Complaints" radius={[6, 6, 0, 0]}>
                                    {monthlyTrends.map((entry) => (
                                        <Cell
                                            key={entry.month}
                                            fill={entry.count > 38000 ? '#e15759' : entry.count > 35000 ? '#f28e2b' : '#4e79a7'}
                                        />
                                    ))}
                                    <LabelList dataKey="count" position="top" fill="#94a3b8" fontSize={10} fontFamily="JetBrains Mono" formatter={(v) => (v / 1000).toFixed(1) + 'K'} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                );

            case 'offenses':
                return (
                    <>
                        <div className="text-xs text-slate-400 mb-3 px-2">Ranked from most to least frequent — hover for exact counts</div>
                        <ResponsiveContainer width="100%" height={520}>
                            <BarChart data={topOffenses} layout="vertical" margin={{ top: 10, right: 60, left: 140, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis
                                    type="number"
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    label={{ value: 'Count', position: 'insideBottom', offset: -5, fill: '#94a3b8', fontSize: 12 }}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fill: '#cbd5e1', fontSize: 11 }}
                                    width={140}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Occurrences" radius={[0, 6, 6, 0]}>
                                    {topOffenses.map((_, i) => {
                                        // Sequential color ramp — darker as rank decreases
                                        const hue = 220 - i * 5;
                                        const sat = 55 + i * 1.5;
                                        const light = 58 - i * 1.5;
                                        return <Cell key={i} fill={`hsl(${hue}, ${sat}%, ${light}%)`} />;
                                    })}
                                    <LabelList dataKey="count" position="right" fill="#94a3b8" fontSize={10} fontFamily="JetBrains Mono" formatter={(v) => v.toLocaleString()} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                );

            case 'severity':
                return (
                    <>
                        <ColorLegend items={[
                            { label: 'Felony', color: SEVERITY_COLORS.FELONY },
                            { label: 'Misdemeanor', color: SEVERITY_COLORS.MISDEMEANOR },
                            { label: 'Violation', color: SEVERITY_COLORS.VIOLATION },
                        ]} />
                        <ResponsiveContainer width="100%" height={420}>
                            <BarChart data={severityByBorough} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis
                                    dataKey="borough"
                                    tick={{ fill: '#cbd5e1', fontSize: 12 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    label={{ value: 'Borough', position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    label={{ value: 'Complaint Count', angle: -90, position: 'insideLeft', offset: 5, fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                    wrapperStyle={{ paddingTop: '0px' }}
                                    formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>}
                                />
                                <Bar dataKey="FELONY" name="Felony" stackId="severity" fill={SEVERITY_COLORS.FELONY} />
                                <Bar dataKey="MISDEMEANOR" name="Misdemeanor" stackId="severity" fill={SEVERITY_COLORS.MISDEMEANOR} />
                                <Bar dataKey="VIOLATION" name="Violation" stackId="severity" fill={SEVERITY_COLORS.VIOLATION} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                );

            case 'dayofweek':
                return (
                    <>
                        <ColorLegend items={[
                            { label: 'Weekday (Mon–Fri)', color: '#4e79a7' },
                            { label: 'Weekend (Sat–Sun)', color: '#b07aa1' },
                        ]} />
                        <ResponsiveContainer width="100%" height={420}>
                            <BarChart data={dayOfWeekData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                                <XAxis
                                    dataKey="day"
                                    tick={{ fill: '#cbd5e1', fontSize: 12 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    label={{ value: 'Day of Week', position: 'insideBottom', offset: -15, fill: '#94a3b8', fontSize: 12 }}
                                />
                                <YAxis
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                                    label={{ value: 'Complaint Count', angle: -90, position: 'insideLeft', offset: 5, fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" name="Complaints" radius={[8, 8, 0, 0]}>
                                    {dayOfWeekData.map((entry, i) => (
                                        <Cell key={i} fill={i >= 5 ? '#b07aa1' : '#4e79a7'} />
                                    ))}
                                    <LabelList dataKey="count" position="top" fill="#94a3b8" fontSize={10} fontFamily="JetBrains Mono" formatter={(v) => v.toLocaleString()} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <section id="eda" className="section-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold mb-2 gradient-text">Exploratory Data Analysis</h2>
                <p className="text-slate-400 mb-8 text-lg">Interactive charts revealing crime patterns across NYC</p>
            </motion.div>

            {/* Chart selector with clear active state */}
            <div className="flex flex-wrap gap-3 mb-6">
                {charts.map((chart) => (
                    <motion.button
                        key={chart.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveChart(chart.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer border ${activeChart === chart.id
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30 border-blue-400/50 ring-2 ring-blue-400/20'
                                : 'bg-white/3 text-slate-400 hover:text-white border-white/5 hover:border-white/15'
                            }`}
                    >
                        <span>{chart.icon}</span>
                        {chart.title}
                    </motion.button>
                ))}
            </div>

            {/* Chart container with title and description */}
            <motion.div
                key={activeChart}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="chart-container"
            >
                {/* Chart header */}
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span>{activeInfo?.icon}</span>
                        {activeInfo?.title}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">{activeInfo?.desc}</p>
                </div>
                {renderChart()}
            </motion.div>
        </section>
    );
}
