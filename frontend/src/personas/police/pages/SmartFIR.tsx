import React, { useState } from 'react';
import {
    Brain,
    CheckCircle,
    AlertTriangle,
    FileText,
    Send,
    Loader2,
    MapPin,
    User,
    Phone,
    Bot
} from 'lucide-react';
import { FIRResponse, FIRCreateRequest } from '../../../core/types/fir';
import { useSubmitData } from '../../../core/hooks/useMetricData';
import { policeService } from '../../../core/services/policeService';

const SmartFIR: React.FC = () => {
    const { submit: generateFIR } = useSubmitData<FIRCreateRequest, FIRResponse>('/police/fir/generate');

    const [formData, setFormData] = useState<FIRCreateRequest>({
        complaint_text: '',
        complainant_name: '',
        complainant_contact: '',
        police_station_id: 'PS-MGROAD-01',
        incident_location: '',
    });

    const [result, setResult] = useState<FIRResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            const response = await generateFIR(formData);
            setResult(response);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.detail || 'Failed to generate FIR. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadTestData = () => {
        setFormData({
            complaint_text: "My Honda City car was stolen from MG Road yesterday at 10 PM. The car was parked near the metro station. The thief also threatened me when I tried to stop him.",
            complainant_name: "Rahul Sharma",
            complainant_contact: "+91-98765-43210",
            police_station_id: "PS-MGROAD-01",
            incident_location: "MG Road, near Metro Station"
        });
        setResult(null);
        setError(null);
    };

    return (
        <div className="p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center gap-3">
                    <Brain className="w-8 h-8 text-blue-400" />
                    Smart-FIR Generator (Skill 01)
                </h1>
                <p className="text-slate-400 mt-2">
                    AI-Powered First Information Report Drafting & Section Analysis
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Input Form */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-blue-400" />
                                Complaint Details
                            </h2>
                            <button
                                onClick={loadTestData}
                                className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded-full transition-colors text-blue-300"
                            >
                                Load Sample
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            value={formData.complainant_name}
                                            onChange={(e) => setFormData({ ...formData, complainant_name: e.target.value })}
                                            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="Complainant Name"
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Contact</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                        <input
                                            type="text"
                                            value={formData.complainant_contact}
                                            onChange={(e) => setFormData({ ...formData, complainant_contact: e.target.value })}
                                            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                            placeholder="+91-"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Incident Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        value={formData.incident_location}
                                        onChange={(e) => setFormData({ ...formData, incident_location: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-slate-600 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                                        placeholder="Where did it happen?"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Complaint Narrative</label>
                                <textarea
                                    value={formData.complaint_text}
                                    onChange={(e) => setFormData({ ...formData, complaint_text: e.target.value })}
                                    className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all min-h-[150px]"
                                    placeholder="Describe the incident in detail..."
                                    required
                                />
                                <p className="text-right text-xs text-slate-500 mt-1">
                                    {formData.complaint_text.length} characters
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4" />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <Bot className="w-5 h-5" />
                                        Generate Smart FIR
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Results Area */}
                <div className="lg:col-span-7 space-y-6">
                    {result ? (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {/* Analysis Card */}
                            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-xl">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h2 className="text-xl font-bold flex items-center gap-2">
                                            <Brain className="w-5 h-5 text-purple-400" />
                                            Legal Analysis
                                        </h2>
                                        <p className="text-slate-400 text-sm mt-1">
                                            Automatic section mapping and entity extraction
                                        </p>
                                    </div>
                                    <div className="bg-slate-900/50 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-2">
                                        <span className="text-xs text-slate-400 uppercase tracking-wider">Confidence</span>
                                        <span className="text-emerald-400 font-bold">{policeService.formatConfidence(result.confidence_score)}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* BNS Sections */}
                                    <div>
                                        <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Applicable BNS Sections</h3>
                                        <div className="space-y-3">
                                            {result.analysis.bns_sections.map((section, idx) => (
                                                <div key={idx} className="bg-slate-700/30 p-3 rounded-xl border border-slate-700/50 hover:bg-slate-700/50 transition-colors">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-bold text-blue-300">{section.section_number}</span>
                                                        <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-semibold ${policeService.getSeverityColor(section.severity)}`}>
                                                            {section.severity}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-slate-300 leading-snug">{section.description}</p>
                                                </div>
                                            ))}
                                            {result.analysis.bns_sections.length === 0 && (
                                                <p className="text-slate-500 italic text-sm">No specific sections matched.</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Entities */}
                                    <div>
                                        <h3 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">Extracted Entities</h3>
                                        <div className="flex flex-wrap gap-2 content-start">
                                            {result.analysis.entities.map((entity, idx) => (
                                                <span key={idx} className="bg-slate-900/60 border border-slate-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-2">
                                                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                    <span className="text-slate-300">{entity.value}</span>
                                                    <span className="text-[10px] text-slate-500 uppercase">{entity.entity_type}</span>
                                                </span>
                                            ))}
                                            {result.analysis.entities.length === 0 && (
                                                <p className="text-slate-500 italic text-sm">No entities detected.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Draft FIR */}
                            <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl p-6 border border-slate-700 shadow-xl">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-emerald-400" />
                                        Draft FIR
                                    </h2>
                                    <button className="text-sm bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                                        <Send className="w-4 h-4" />
                                        Submit for Review
                                    </button>
                                </div>
                                <div className="bg-slate-950 rounded-xl p-6 border border-slate-800 overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => navigator.clipboard.writeText(result.draft_content)}
                                            className="bg-slate-800 text-slate-400 p-2 rounded hover:text-white"
                                            title="Copy to clipboard"
                                        >
                                            <FileText className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
                                        {result.draft_content}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center bg-slate-800/20 rounded-2xl border border-slate-700/50 border-dashed min-h-[400px]">
                            <div className="text-center p-8 max-w-sm">
                                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700 shadow-lg">
                                    <Bot className="w-8 h-8 text-slate-500" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">Ready to Analyze</h3>
                                <p className="text-slate-400 text-sm">
                                    Enter the complaint details and the AI will automatically extract entities, map BNS sections, and draft the FIR for you.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SmartFIR;
