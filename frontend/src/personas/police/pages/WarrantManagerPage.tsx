import React, { useState, useEffect } from 'react';
import {
    FileText,
    Search,
    Filter,
    Shield,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Plus
} from 'lucide-react';
import warrantService from '../../../core/services/warrantService';
import { Warrant, WarrantStatus, WarrantType } from '../../../core/types/warrant';

const WarrantManagerPage: React.FC = () => {
    const [warrants, setWarrants] = useState<Warrant[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<WarrantStatus | ''>('');

    useEffect(() => {
        loadWarrants();
    }, [filterStatus]);

    const loadWarrants = async () => {
        setLoading(true);
        try {
            const data = await warrantService.listWarrants(filterStatus || undefined);
            setWarrants(data);
        } catch (error) {
            console.error("Failed to load warrants", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: WarrantStatus) => {
        try {
            await warrantService.updateWarrant(id, { status });
            loadWarrants(); // Refresh
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const getStatusColor = (status: WarrantStatus) => {
        switch (status) {
            case WarrantStatus.ISSUED: return 'text-orange-400 border-orange-500/50 bg-orange-500/10';
            case WarrantStatus.EXECUTED: return 'text-green-400 border-green-500/50 bg-green-500/10';
            case WarrantStatus.PENDING: return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
            case WarrantStatus.EXPIRED: return 'text-red-400 border-red-500/50 bg-red-500/10';
            default: return 'text-neutral-400 border-neutral-700 bg-neutral-800';
        }
    };

    return (
        <div className="p-6 min-h-screen bg-neutral-900 text-neutral-100 font-sans">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold flex items-center gap-3 text-red-500">
                        <FileText className="w-8 h-8" />
                        Warrant Manager (Nyaya Rakshak)
                    </h1>
                    <p className="text-neutral-400 mt-2 font-serif text-lg italic">
                        Digital issuance, tracking, and execution of warrants.
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-bold transition-transform active:scale-95 shadow-lg shadow-red-900/50">
                    <Plus className="w-5 h-5" /> Issue New Warrant
                </button>
            </header>

            {/* Filters */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search by accused name or case ID..."
                        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-red-500 transition-colors"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as WarrantStatus)}
                    className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500"
                >
                    <option value="">All Statuses</option>
                    {Object.values(WarrantStatus).map(s => (
                        <option key={s} value={s}>{s.toUpperCase()}</option>
                    ))}
                </select>
            </div>

            {/* List */}
            {loading ? (
                <div className="text-center py-12">Loading warrants...</div>
            ) : (
                <div className="grid gap-4">
                    {warrants.map(warrant => (
                        <div key={warrant.id} className="bg-neutral-800/50 border border-neutral-700 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-neutral-800 transition-colors">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className={`px-2 py-0.5 text-xs font-bold rounded border ${getStatusColor(warrant.status)}`}>
                                        {warrant.status.toUpperCase()}
                                    </span>
                                    <h3 className="text-xl font-bold">{warrant.accused_name}</h3>
                                </div>
                                <div className="text-neutral-400 text-sm flex gap-4">
                                    <span>Case: {warrant.case_id}</span>
                                    <span>Type: {warrant.warrant_type.toUpperCase()}</span>
                                    <span>Issued: {new Date(warrant.issue_date).toLocaleDateString()}</span>
                                </div>
                                <div className="text-neutral-500 text-xs">
                                    Authority: {warrant.issuing_authority}
                                </div>
                            </div>

                            <div className="mt-4 md:mt-0 flex gap-2">
                                {warrant.status === WarrantStatus.ISSUED && (
                                    <button
                                        onClick={() => handleStatusUpdate(warrant.id, WarrantStatus.EXECUTED)}
                                        className="flex items-center gap-2 bg-green-600/20 text-green-400 hover:bg-green-600/30 px-3 py-1.5 rounded-lg border border-green-600/50 transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Mark Executed
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                    {warrants.length === 0 && (
                        <div className="text-center py-12 text-neutral-500">
                            No warrants found matching criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default WarrantManagerPage;
