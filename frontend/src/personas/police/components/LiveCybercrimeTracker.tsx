import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle, Shield, MapPin, Globe, Activity,
    Wifi, Lock, Terminal, Pause, Play
} from 'lucide-react';
import FloatingCard from '../../../shared/components/3d/FloatingCard';

// Types for our live feed
interface CyberIncident {
    id: string;
    timestamp: Date;
    type: 'PHISHING' | 'DDOS' | 'MALWARE' | 'RANSOMWARE' | 'DATA_BREACH' | 'IDENTITY_THEFT';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    location: string;
    sourceIp: string;
    target: string;
    status: 'DETECTED' | 'ANALYSING' | 'BLOCKED' | 'RESOLVED';
}

const INCIDENT_TYPES = ['PHISHING', 'DDOS', 'MALWARE', 'RANSOMWARE', 'DATA_BREACH', 'IDENTITY_THEFT'] as const;
const LOCATIONS = ['Mumbai, MH', 'Delhi, DL', 'Bengaluru, KA', 'Hyderabad, TS', 'Chennai, TN', 'Pune, MH', 'Kolkata, WB'];
const TARGETS = ['Banking Server', 'Gov Portal', 'Retail API', 'Healthcare DB', 'University Network'];

const LiveCybercrimeTracker: React.FC = () => {
    const [incidents, setIncidents] = useState<CyberIncident[]>([]);
    const [isLive, setIsLive] = useState(true);
    const [stats, setStats] = useState({ blocked: 0, critical: 0, active: 0 });
    const scrollRef = useRef<HTMLDivElement>(null);

    // Initial dummy data
    useEffect(() => {
        const initialData: CyberIncident[] = Array.from({ length: 5 }).map((_, i) => generateIncident(i));
        setIncidents(initialData);
    }, []);

    // Scroll to bottom on new incident
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [incidents]);

    // Live feed simulation
    useEffect(() => {
        if (!isLive) return;

        const interval = setInterval(() => {
            const newIncident = generateIncident();
            setIncidents(prev => [newIncident, ...prev].slice(0, 50)); // Keep last 50

            // Update random stats
            if (newIncident.status === 'BLOCKED') {
                setStats(s => ({ ...s, blocked: s.blocked + 1 }));
            }
            if (newIncident.severity === 'CRITICAL') {
                setStats(s => ({ ...s, critical: s.critical + 1 }));
            }
            setStats(s => ({ ...s, active: Math.floor(Math.random() * 20) + 5 }));

        }, 3500); // New incident every 3.5s

        return () => clearInterval(interval);
    }, [isLive]);

    const generateIncident = (offsetMs = 0): CyberIncident => {
        const type = INCIDENT_TYPES[Math.floor(Math.random() * INCIDENT_TYPES.length)];
        const severity = Math.random() > 0.8 ? 'CRITICAL' : Math.random() > 0.5 ? 'HIGH' : 'MEDIUM';

        return {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(Date.now() - offsetMs),
            type,
            severity,
            location: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
            sourceIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            target: TARGETS[Math.floor(Math.random() * TARGETS.length)],
            status: Math.random() > 0.3 ? 'DETECTED' : 'BLOCKED'
        };
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return 'text-red-500 bg-red-500/10 border-red-500/30';
            case 'HIGH': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
            case 'MEDIUM': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
            default: return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
        }
    };

    return (
        <div className="h-full flex flex-col gap-4">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <FloatingCard glowColor="purple" intensity="medium">
                    <div className="p-4 flex flex-col items-center justify-center text-center">
                        <Activity className="w-8 h-8 text-purple-400 mb-2 animate-pulse" />
                        <h3 className="text-2xl font-bold text-white">{stats.active}</h3>
                        <p className="text-xs text-purple-300">Active Threats</p>
                    </div>
                </FloatingCard>

                <FloatingCard glowColor="red" intensity="medium">
                    <div className="p-4 flex flex-col items-center justify-center text-center">
                        <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
                        <h3 className="text-2xl font-bold text-white">{stats.critical}</h3>
                        <p className="text-xs text-red-300">Critical Alerts</p>
                    </div>
                </FloatingCard>

                <FloatingCard glowColor="green" intensity="medium">
                    <div className="p-4 flex flex-col items-center justify-center text-center">
                        <Shield className="w-8 h-8 text-emerald-400 mb-2" />
                        <h3 className="text-2xl font-bold text-white">{stats.blocked}</h3>
                        <p className="text-xs text-emerald-300">Threats Blocked</p>
                    </div>
                </FloatingCard>

                <FloatingCard glowColor="cyan" intensity="low">
                    <div className="p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/5 transition-colors"
                        onClick={() => setIsLive(!isLive)}>
                        {isLive ? (
                            <Pause className="w-8 h-8 text-cyan-400 mb-2" />
                        ) : (
                            <Play className="w-8 h-8 text-cyan-400 mb-2" />
                        )}
                        <h3 className="text-lg font-bold text-white">{isLive ? 'LIVE' : 'PAUSED'}</h3>
                        <p className="text-xs text-cyan-300">Feed Status</p>
                    </div>
                </FloatingCard>
            </div>

            {/* Live Feed Container */}
            <div className="flex-1 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20">
                    <div className="flex items-center gap-2">
                        <Wifi className={`w-4 h-4 ${isLive ? 'text-green-500 animate-pulse' : 'text-slate-500'}`} />
                        <h3 className="font-bold text-white">Live Cyber Intelligence Feed</h3>
                    </div>
                    <div className="flex gap-2 text-xs">
                        <span className="flex items-center gap-1 text-slate-400">
                            <Globe className="w-3 h-3" /> Global Sensors Active
                        </span>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto p-4 space-y-2 relative"
                >
                    <AnimatePresence initial={false}>
                        {incidents.map((incident) => (
                            <motion.div
                                key={incident.id}
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                <div className={`flex items-center gap-4 p-3 rounded-lg border bg-slate-800/80 hover:bg-slate-800 transition-colors ${getSeverityColor(incident.severity)}`}>
                                    <div className="p-2 rounded-full bg-black/20">
                                        {incident.type === 'PHISHING' && <Lock className="w-4 h-4" />}
                                        {incident.type === 'DDOS' && <Activity className="w-4 h-4" />}
                                        {incident.type === 'MALWARE' && <Terminal className="w-4 h-4" />}
                                        {['RANSOMWARE', 'DATA_BREACH', 'IDENTITY_THEFT'].includes(incident.type) && <AlertTriangle className="w-4 h-4" />}
                                    </div>

                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                                        <div className="col-span-2">
                                            <span className="text-xs font-mono opacity-70">{incident.timestamp.toLocaleTimeString()}</span>
                                            <div className="font-bold text-sm">{incident.type}</div>
                                        </div>

                                        <div className="col-span-3">
                                            <div className="flex items-center gap-1 text-xs opacity-80">
                                                <MapPin className="w-3 h-3" />
                                                {incident.location}
                                            </div>
                                            <div className="text-xs font-mono">{incident.sourceIp}</div>
                                        </div>

                                        <div className="col-span-4">
                                            <div className="text-xs opacity-70">Target</div>
                                            <div className="text-sm font-medium truncate">{incident.target}</div>
                                        </div>

                                        <div className="col-span-2 flex justify-end">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${incident.status === 'BLOCKED' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400 animate-pulse'
                                                }`}>
                                                {incident.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default LiveCybercrimeTracker;
