import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { sampleCrimeLocations, precinctData } from '../data/mockData';

export default function CrimeMap() {
    const [mapLoaded, setMapLoaded] = useState(false);
    const [filter, setFilter] = useState('All');
    const mapRef = useRef(null);
    const mapInstance = useRef(null);

    useEffect(() => {
        // Dynamically import Leaflet
        const loadMap = async () => {
            const L = await import('leaflet');
            await import('leaflet/dist/leaflet.css');

            if (mapInstance.current) return;
            if (!mapRef.current) return;

            const map = L.map(mapRef.current, {
                center: [40.7128, -74.006],
                zoom: 11,
                zoomControl: true,
                attributionControl: false,
            });

            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
            }).addTo(map);

            // Add precinct markers
            precinctData.forEach((pct) => {
                const marker = L.circleMarker([pct.lat, pct.lng], {
                    radius: Math.sqrt(pct.complaints) / 5,
                    fillColor: pct.felonyRate > 0.35 ? '#ef4444' : pct.felonyRate > 0.32 ? '#f59e0b' : '#3b82f6',
                    color: 'rgba(255,255,255,0.3)',
                    weight: 1,
                    opacity: 0.8,
                    fillOpacity: 0.6,
                }).addTo(map);

                marker.bindPopup(`
          <div style="font-family: Inter, sans-serif; color: #1e293b; min-width: 160px;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">Precinct ${pct.id}</div>
            <div style="font-size: 12px; color: #64748b; margin-bottom: 8px;">${pct.name}</div>
            <div style="font-size: 13px;"><strong>${pct.complaints.toLocaleString()}</strong> complaints</div>
            <div style="font-size: 13px;">Felony rate: <strong>${(pct.felonyRate * 100).toFixed(1)}%</strong></div>
          </div>
        `);
            });

            // Add crime location markers
            sampleCrimeLocations.forEach((loc) => {
                L.circleMarker([loc.lat, loc.lng], {
                    radius: 4,
                    fillColor: loc.type === 'FELONY' ? '#ef4444' : loc.type === 'MISDEMEANOR' ? '#f59e0b' : '#3b82f6',
                    color: 'transparent',
                    fillOpacity: 0.5,
                }).addTo(map);
            });

            mapInstance.current = map;
            setMapLoaded(true);
        };

        const timer = setTimeout(loadMap, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section id="map" className="section-container">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <h2 className="text-4xl font-bold mb-2 gradient-text">Geospatial Crime Map</h2>
                <p className="text-slate-400 mb-8 text-lg">Interactive map showing crime density and precinct-level statistics across NYC</p>
            </motion.div>

            {/* Legend */}
            <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-3 h-3 rounded-full bg-red-500" /> High Felony Rate (&gt;35%)
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" /> Medium (32-35%)
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className="w-3 h-3 rounded-full bg-blue-500" /> Lower (&lt;32%)
                </div>
                <div className="text-sm text-slate-500 ml-auto">Circle size = complaint volume</div>
            </div>

            {/* Map container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="glass-card overflow-hidden"
                style={{ height: '500px' }}
            >
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            </motion.div>

            {/* Precinct stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                {precinctData.slice(0, 5).map((pct, i) => (
                    <motion.div
                        key={pct.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="glass-card p-4"
                    >
                        <div className="text-xs text-slate-500 mb-1">Precinct {pct.id}</div>
                        <div className="text-sm font-medium text-white">{pct.name}</div>
                        <div className="text-lg font-bold mono text-blue-400">{pct.complaints.toLocaleString()}</div>
                        <div className="text-xs text-slate-400">Felony: {(pct.felonyRate * 100).toFixed(1)}%</div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
