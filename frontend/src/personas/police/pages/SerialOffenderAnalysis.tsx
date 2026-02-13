import React, { useState } from 'react';
import {
    Users,
    Search,
    MapPin,
    AlertTriangle,
    TrendingUp,
    FileText,
    ChevronRight,
    Siren,
    Zap
} from 'lucide-react';
import { motion } from 'framer-motion';

// Mock Data for Serial Offenders
const OFFENDERS = [
    {
        id: 'SO-2024-882',
        name: 'Rajesh "Bhai" Kumar',
        alias: 'Raju Don',
        status: 'Wanted',
        riskLevel: 'High',
        crimeType: 'Organized Crime',
        lastSeen: 'Sector 4, Noida',
        crimes: [
            { type: 'Extortion', date: '2024-01-15', location: 'Market Yard' },
            { type: 'Assault', date: '2023-11-20', location: 'Highway Inn' },
            { type: 'Illegal Gambling', date: '2023-08-05', location: 'Basement Club' }
        ],
        associates: ['Amit Singh', 'Vikram Sethi'],
        probability: 88
    },
    {
        id: 'SO-2023-104',
        name: 'Suresh Verma',
        alias: 'The Ghost',
        status: 'In Custody',
        riskLevel: 'Medium',
        crimeType: 'Burglary',
        lastSeen: 'Central Jail',
        crimes: [
            { type: 'House Break-in', date: '2023-12-10', location: 'Civil Lines' },
            { type: 'Vehicle Theft', date: '2023-09-15', location: 'Metro Parking' }
        ],
        associates: ['None'],
        probability: 45
    },
    {
        id: 'SO-2024-991',
        name: 'Sunita Devi',
        alias: 'Madam X',
        status: 'Under Surveillance',
        riskLevel: 'Critical',
        crimeType: 'Narcotics',
        lastSeen: 'Old City Area',
        crimes: [
            { type: 'Drug Peddling', date: '2024-02-01', location: 'College Road' },
            { type: 'Smuggling', date: '2024-01-10', location: 'Border Checkpost' }
        ],
        associates: ['Rahul P.', 'Priya K.'],
        probability: 92
    }
];

const SerialOffenderAnalysis: React.FC = () => {
    const [selectedOffender, setSelectedOffender] = useState<typeof OFFENDERS[0] | null>(OFFENDERS[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredOffenders = OFFENDERS.filter(offender =>
        offender.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offender.alias?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col gap-6">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <Users className="w-8 h-8 text-red-500" />
                        Serial Offender Analysis
                    </h1>
                    <p className="text-slate-400">AI-driven pattern matching for habitual offenders</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-slate-900 border border-slate-700 rounded-lg flex items-center px-3 py-2">
                        <Search className="w-4 h-4 text-slate-500 mr-2" />
                        <input
                            type="text"
                            placeholder="Search Name or Alias..."
                            className="bg-transparent border-none focus:outline-none text-white text-sm w-48"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
                {/* Offender List */}
                <div className="col-span-4 bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-slate-800 bg-slate-800/30">
                        <h3 className="font-semibold text-white">Known Offenders Database</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {filteredOffenders.map(offender => (
                            <div
                                key={offender.id}
                                onClick={() => setSelectedOffender(offender)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedOffender?.id === offender.id
                                        ? 'bg-blue-600/10 border-blue-500/50'
                                        : 'bg-slate-800/30 border-transparent hover:bg-slate-800/50'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h4 className={`font-bold ${selectedOffender?.id === offender.id ? 'text-blue-400' : 'text-white'}`}>
                                            {offender.name}
                                        </h4>
                                        <p className="text-xs text-slate-400">AKA: {offender.alias}</p>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${offender.riskLevel === 'Critical' ? 'bg-red-500/20 text-red-400' :
                                            offender.riskLevel === 'High' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {offender.riskLevel}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <MapPin className="w-3 h-3" />
                                    {offender.lastSeen}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Analysis Panel */}
                <div className="col-span-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 overflow-y-auto">
                    {selectedOffender ? (
                        <div className="space-y-8">
                            {/* Profile Header */}
                            <div className="flex gap-6">
                                <div className="w-24 h-24 bg-slate-800 rounded-xl flex items-center justify-center border-2 border-slate-700">
                                    <Users className="w-10 h-10 text-slate-500" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-1">{selectedOffender.name}</h2>
                                            <div className="flex gap-3 text-sm">
                                                <span className="text-slate-400">ID: <span className="text-mono text-slate-300">{selectedOffender.id}</span></span>
                                                <span className="text-slate-400">Type: <span className="text-white">{selectedOffender.crimeType}</span></span>
                                            </div>
                                        </div>
                                        <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                                            <Siren className="w-4 h-4" />
                                            Issue Alert
                                        </button>
                                    </div>

                                    <div className="mt-4 flex gap-4">
                                        <div className="px-3 py-1 bg-slate-800 rounded border border-slate-700">
                                            <span className="text-xs text-slate-400 block">Status</span>
                                            <span className="text-sm font-medium text-white">{selectedOffender.status}</span>
                                        </div>
                                        <div className="px-3 py-1 bg-slate-800 rounded border border-slate-700">
                                            <span className="text-xs text-slate-400 block">Recidivism Probability</span>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-sm font-bold ${selectedOffender.probability > 80 ? 'text-red-400' : 'text-orange-400'}`}>
                                                    {selectedOffender.probability}%
                                                </span>
                                                <TrendingUp className="w-3 h-3 text-slate-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity Map & Timeline */}
                            <div className="grid grid-cols-2 gap-6">
                                {/* Criminal History */}
                                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-blue-400" />
                                        Criminal History
                                    </h3>
                                    <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-slate-700">
                                        {selectedOffender.crimes.map((crime, idx) => (
                                            <div key={idx} className="relative pl-8">
                                                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-slate-800 border-2 border-blue-500 z-10" />
                                                <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-700">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-medium text-white">{crime.type}</span>
                                                        <span className="text-xs text-slate-500">{crime.date}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {crime.location}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Associates & MO */}
                                <div className="space-y-6">
                                    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-purple-400" />
                                            Known Associates
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedOffender.associates.map((assoc, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300 border border-slate-700">
                                                    {assoc}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-amber-400" />
                                            AI Insights
                                        </h3>
                                        <div className="text-sm text-slate-400 space-y-2">
                                            <p>• High likelihood of operating in <strong className="text-white">North Zone</strong> based on recent tower dumps.</p>
                                            <p>• Pattern suggests active recruitment of juveniles for delivery.</p>
                                            <p>• Financial link detected with <strong className="text-white">Shell Corp X</strong> via UPI traces.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-500">
                            Select an offender to view analysis
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SerialOffenderAnalysis;
