import React, { useState } from 'react';
import {
    FileText,
    Save,
    Send,
    User,
    Gavel,
    BookOpen,
    Edit3,
    CheckCircle
} from 'lucide-react';
import chargesheetService from '../../../core/services/chargesheetService';
import { ChargeSheet, ChargeSheetStatus } from '../../../core/types/chargesheet';

const ChargeSheetBuilder: React.FC = () => {
    const [firId, setFirId] = useState('');
    const [chargeSheet, setChargeSheet] = useState<ChargeSheet | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const generateDraft = async () => {
        if (!firId) return;
        setIsLoading(true);
        try {
            const data = await chargesheetService.generateDraft(firId);
            setChargeSheet(data);
        } catch (error) {
            console.error("Generation failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!chargeSheet) return;
        setIsSaving(true);
        try {
            await chargesheetService.updateChargeSheet(chargeSheet.id, {
                brief_facts: chargeSheet.brief_facts,
                investigation_details: chargeSheet.investigation_details
            });
            alert("Draft Saved Successfully");
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6 min-h-screen bg-slate-900 text-white">
            <header className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                    <FileText className="w-8 h-8 text-indigo-400" />
                    Automated Charge Sheet Builder
                </h1>
                <p className="text-slate-400 mt-2">
                    Generate Section 173 CrPC / BNSS Final Reports automatically from case data.
                </p>
            </header>

            {!chargeSheet ? (
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 max-w-2xl mx-auto text-center">
                    <div className="bg-indigo-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">Start New Final Report</h2>
                    <p className="text-slate-400 mb-6">Enter the FIR Number to auto-populate the charge sheet with investigation details, evidence, and witness statements.</p>

                    <div className="flex gap-4 max-w-md mx-auto">
                        <input
                            type="text"
                            placeholder="Enter FIR ID (e.g., FIR-2025-001)"
                            value={firId}
                            onChange={(e) => setFirId(e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 w-full text-white"
                        />
                        <button
                            onClick={generateDraft}
                            disabled={isLoading || !firId}
                            className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 rounded-lg transition-colors font-semibold disabled:opacity-50 whitespace-nowrap"
                        >
                            {isLoading ? 'Generating...' : 'Auto-Generate'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Navigation / Status */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <div className="mb-4">
                                <span className="text-xs text-slate-500 uppercase font-bold">Status</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                                    <span className="font-bold">{chargeSheet.status.replace('_', ' ').toUpperCase()}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <span className="text-xs text-slate-500 uppercase font-bold">Investigation Officer</span>
                                <div className="text-sm mt-1">{chargeSheet.investigating_officer}</div>
                            </div>

                            <hr className="border-slate-700 my-4" />

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 mb-3"
                            >
                                <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Draft'}
                            </button>
                            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                                <Send className="w-4 h-4" /> Submit for Review
                            </button>
                        </div>
                    </div>

                    {/* Main Document Editor */}
                    <div className="lg:col-span-3 bg-white text-slate-900 rounded-xl shadow-xl overflow-hidden flex flex-col min-h-[800px]">
                        {/* Legal Header */}
                        <div className="bg-slate-100 p-8 border-b border-slate-200 text-center">
                            <h2 className="text-2xl font-serif font-bold mb-2">FINAL REPORT</h2>
                            <p className="text-sm text-slate-600 uppercase font-bold tracking-wider">UNDER SECTION 173 CrPC / 193 BNSS</p>
                            <div className="flex justify-between mt-8 text-sm">
                                <div>
                                    <span className="font-bold">Police Station:</span> {chargeSheet.police_station}
                                </div>
                                <div>
                                    <span className="font-bold">District:</span> {chargeSheet.district}
                                </div>
                                <div>
                                    <span className="font-bold">Year:</span> {chargeSheet.year}
                                </div>
                                <div>
                                    <span className="font-bold">FIR No:</span> {chargeSheet.fir_id}
                                </div>
                            </div>
                        </div>

                        {/* Editor Body */}
                        <div className="p-8 space-y-8 flex-1">

                            {/* Accused Section */}
                            <section>
                                <h3 className="text-lg font-bold border-b-2 border-slate-800 pb-1 mb-4 flex items-center gap-2">
                                    <User className="w-5 h-5" /> Details of Accused
                                </h3>
                                {chargeSheet.accused.map((acc, idx) => (
                                    <div key={acc.id} className="bg-slate-50 p-4 rounded border border-slate-200 mb-2">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><span className="font-bold">Name:</span> {acc.name}</div>
                                            <div><span className="font-bold">Parentage:</span> {acc.parentage}</div>
                                            <div className="col-span-2"><span className="font-bold">Address:</span> {acc.address}</div>
                                            <div><span className="font-bold">Status:</span> {acc.is_arrested ? 'Arrested' : 'Not Arrested'}</div>
                                            <div><span className="font-bold">Remand:</span> {acc.remand_status}</div>
                                        </div>
                                    </div>
                                ))}
                            </section>

                            {/* Offenses Section */}
                            <section>
                                <h3 className="text-lg font-bold border-b-2 border-slate-800 pb-1 mb-4 flex items-center gap-2">
                                    <Gavel className="w-5 h-5" /> Offenses Charged
                                </h3>
                                <div className="bg-slate-50 rounded border border-slate-200 overflow-hidden">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-100 border-b border-slate-200">
                                            <tr>
                                                <th className="p-3">Act</th>
                                                <th className="p-3">Section</th>
                                                <th className="p-3">Description</th>
                                                <th className="p-3">Punishment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {chargeSheet.offenses.map((off, idx) => (
                                                <tr key={idx} className="border-b border-slate-100">
                                                    <td className="p-3 font-bold">{off.act}</td>
                                                    <td className="p-3 font-mono text-red-600 font-bold">{off.section}</td>
                                                    <td className="p-3">{off.description}</td>
                                                    <td className="p-3">{off.max_punishment}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* Facts and Investigation - Editable */}
                            <section>
                                <h3 className="text-lg font-bold border-b-2 border-slate-800 pb-1 mb-4 flex items-center gap-2">
                                    <Edit3 className="w-5 h-5" /> Brief Facts & Investigation
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block font-bold text-sm mb-1">Brief Facts of the Case</label>
                                        <textarea
                                            value={chargeSheet.brief_facts}
                                            onChange={(e) => setChargeSheet({ ...chargeSheet, brief_facts: e.target.value })}
                                            className="w-full border border-slate-300 rounded p-3 text-sm min-h-[100px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-sm mb-1">Details of Investigation</label>
                                        <textarea
                                            value={chargeSheet.investigation_details}
                                            onChange={(e) => setChargeSheet({ ...chargeSheet, investigation_details: e.target.value })}
                                            className="w-full border border-slate-300 rounded p-3 text-sm min-h-[150px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChargeSheetBuilder;
