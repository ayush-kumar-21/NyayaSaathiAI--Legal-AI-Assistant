import React, { useState } from 'react';
import {
    Users,
    Shield,
    AlertTriangle,
    Eye,
    EyeOff,
    MapPin,
    Phone,
    UserPlus,
    Search,
    Lock
} from 'lucide-react';
import witnessService from '../../../core/services/witnessService';
import { Witness, ThreatLevel, ProtectionStatus } from '../../../core/types/witness';

const WitnessTracker: React.FC = () => {
    const [caseId, setCaseId] = useState('');
    const [witnesses, setWitnesses] = useState<Witness[]>([]);
    const [selectedWitness, setSelectedWitness] = useState<Witness | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [revealIdentity, setRevealIdentity] = useState(false);

    const fetchWitnesses = async () => {
        if (!caseId) return;
        setIsLoading(true);
        try {
            const data = await witnessService.listCaseWitnesses(caseId);
            setWitnesses(data);
            setSelectedWitness(null);
            setRevealIdentity(false);
        } catch (error) {
            console.error("Failed to fetch witnesses", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchDetails = async (id: string) => {
        try {
            const data = await witnessService.getWitnessDetails(id);
            setSelectedWitness(data);
            setRevealIdentity(false);
        } catch (error) {
            console.error("Failed to fetch details", error);
        }
    };

    const getThreatColor = (level: ThreatLevel) => {
        switch (level) {
            case ThreatLevel.CRITICAL: return 'text-red-500 bg-red-500/10 border-red-500/20';
            case ThreatLevel.HIGH: return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
            case ThreatLevel.MODERATE: return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-green-500 bg-green-500/10 border-green-500/20';
        }
    };

    return (
        <div className="p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                    <Shield className="w-8 h-8 text-blue-400" />
                    Witness Protection Tracker (Rakshak)
                </h1>
                <p className="text-slate-400 mt-2">
                    Secure identity management and threat monitoring for protected witnesses.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Search & List Panel */}
                <div className="lg:col-span-1 bg-slate-800 rounded-xl p-6 border border-slate-700">
                    <div className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="Enter Case ID (e.g., FIR-2025-001)"
                            value={caseId}
                            onChange={(e) => setCaseId(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 w-full text-white"
                        />
                        <button
                            onClick={fetchWitnesses}
                            className="bg-blue-600 hover:bg-blue-500 p-2 rounded-lg transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            <div className="text-center py-10 text-slate-500">Loading protected data...</div>
                        ) : witnesses.length > 0 ? (
                            witnesses.map((w) => (
                                <div
                                    key={w.id}
                                    onClick={() => fetchDetails(w.id)}
                                    className={`p-4 rounded-lg cursor-pointer border transition-all ${selectedWitness?.id === w.id
                                            ? 'bg-blue-900/30 border-blue-500'
                                            : 'bg-slate-700/30 border-slate-700 hover:border-slate-500'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-blue-400" />
                                            <span className="font-semibold text-sm">{w.alias_name || 'Unknown Alias'}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getThreatColor(w.threat_level)}`}>
                                            {w.threat_level.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-400 flex justify-between">
                                        <span>Status: {w.protection_status}</span>
                                        {w.identity_status === 'concealed' && <Lock className="w-3 h-3 text-slate-500" />}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-500 border border-dashed border-slate-700 rounded-lg">
                                No protected witnesses found
                            </div>
                        )}
                    </div>

                    <button className="w-full mt-6 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <UserPlus className="w-4 h-4" />
                        Register New Witness
                    </button>
                </div>

                {/* Details Panel */}
                <div className="lg:col-span-2">
                    {selectedWitness ? (
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 h-full">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                                        {revealIdentity ? selectedWitness.real_name : selectedWitness.alias_name}
                                        {revealIdentity ? (
                                            <span className="text-sm bg-red-500/20 text-red-400 px-2 py-1 rounded border border-red-500/20">REAL IDENTITY</span>
                                        ) : (
                                            <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/20">ALIAS</span>
                                        )}
                                    </h2>
                                    <p className="text-slate-400 mt-1">Assigned ID: {selectedWitness.id}</p>
                                </div>

                                <button
                                    onClick={() => setRevealIdentity(!revealIdentity)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-sm font-medium"
                                >
                                    {revealIdentity ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    {revealIdentity ? 'Conceal Identity' : 'Reveal Identity'}
                                </button>
                            </div>

                            {/* Threat Dashboard */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                                <div className={`p-4 rounded-lg border ${getThreatColor(selectedWitness.threat_level)}`}>
                                    <span className="text-xs opacity-70 block mb-1">Threat Level</span>
                                    <span className="text-xl font-bold flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        {selectedWitness.threat_level.toUpperCase()}
                                    </span>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                                    <span className="text-xs text-slate-500 block mb-1">Protection Status</span>
                                    <span className="text-xl font-semibold text-white">
                                        {selectedWitness.protection_status.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                                <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                                    <span className="text-xs text-slate-500 block mb-1">Last Check-in</span>
                                    <span className="text-lg font-mono text-slate-300">
                                        {new Date().toLocaleDateString()} {/* Mock date */}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Secure Details Section */}
                                <div className="bg-slate-900/30 rounded-lg p-6 border border-slate-700/50 relative overflow-hidden">
                                    {!revealIdentity && (
                                        <div className="absolute inset-0 backdrop-blur-md bg-slate-900/80 flex items-center justify-center z-10">
                                            <div className="text-center">
                                                <Lock className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                                                <p className="text-slate-400 font-medium">Restricted Information</p>
                                                <p className="text-xs text-slate-500 mt-1">Reveal identity to view details</p>
                                            </div>
                                        </div>
                                    )}

                                    <h3 className="text-lg font-semibold mb-4 text-white">Personal Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs text-slate-500 block mb-1">Phone Number</label>
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <Phone className="w-4 h-4" />
                                                {selectedWitness.contact_number || '• • • • • • • • • •'}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 block mb-1">Current Location</label>
                                            <div className="flex items-center gap-2 text-slate-300">
                                                <MapPin className="w-4 h-4" />
                                                {selectedWitness.address || '• • • • • • • • • •'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500 p-10 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                            <Users className="w-16 h-16 mb-4 opacity-20" />
                            <p className="text-lg">Select a witness to view protection details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WitnessTracker;
