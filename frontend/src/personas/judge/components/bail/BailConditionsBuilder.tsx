import React, { useState } from 'react';
import { Save, FileText, Scale, Check, Plus } from 'lucide-react';

interface Condition {
    id: string;
    label: string;
    category: 'Movement' | 'Reporting' | 'Financial' | 'Conduct' | 'Other';
    selected: boolean;
    details?: string;
}

const BailConditionsBuilder: React.FC = () => {
    const [conditions, setConditions] = useState<Condition[]>([
        { id: 'c1', label: 'Surrender Passport', category: 'Movement', selected: false },
        { id: 'c2', label: 'Present at Police Station', category: 'Reporting', selected: false, details: 'Every Monday at 10 AM' },
        { id: 'c3', label: 'Personal Bond', category: 'Financial', selected: false, details: '₹50,000' },
        { id: 'c4', label: 'Surety Bond', category: 'Financial', selected: false, details: 'Two sureties of ₹50,000 each' },
        { id: 'c5', label: 'Do not contact witnesses', category: 'Conduct', selected: true },
        { id: 'c6', label: 'Do not leave jurisdiction', category: 'Movement', selected: true, details: 'NCT of Delhi' },
        { id: 'c7', label: 'Cooperate with investigation', category: 'Conduct', selected: true },
        { id: 'c8', label: 'Attend all court dates', category: 'Conduct', selected: true },
    ]);

    const toggleCondition = (id: string) => {
        setConditions(conditions.map(c =>
            c.id === id ? { ...c, selected: !c.selected } : c
        ));
    };

    const updateDetails = (id: string, details: string) => {
        setConditions(conditions.map(c =>
            c.id === id ? { ...c, details } : c
        ));
    };

    const generateOrderText = () => {
        const selected = conditions.filter(c => c.selected);
        return `The accused is released on bail subject to the following conditions:\n\n` +
            selected.map((c, i) => `${i + 1}. ${c.label}${c.details ? `: ${c.details}` : ''}`).join('\n') +
            `\n\nViolation of any condition shall result in cancellation of bail.`;
    };

    return (
        <div className="bg-slate-900/50 border border-amber-900/30 rounded-xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-amber-900/20 to-slate-900 border-b border-amber-900/30 flex justify-between items-center">
                <div className="flex items-center gap-2 text-amber-500">
                    <Scale className="w-5 h-5" />
                    <h3 className="font-semibold text-lg text-white">Bail Conditions Builder</h3>
                </div>
                <button className="text-xs flex items-center gap-1 text-slate-400 hover:text-white transition-colors">
                    <Save className="w-3 h-3" /> Save Template
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Selection Panel */}
                <div className="p-6 border-r border-slate-700/50 space-y-6">
                    <div>
                        <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Select Conditions</h4>
                        <div className="space-y-3">
                            {conditions.map(condition => (
                                <div key={condition.id} className={`p-3 rounded-lg border transition-all ${condition.selected ? 'bg-amber-900/20 border-amber-500/50' : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'}`}>
                                    <div className="flex items-start gap-3">
                                        <div
                                            onClick={() => toggleCondition(condition.id)}
                                            className={`mt-1 w-5 h-5 rounded border flex items-center justify-center cursor-pointer transition-colors ${condition.selected ? 'bg-amber-500 border-amber-500' : 'border-slate-500 hover:border-amber-400'}`}
                                        >
                                            {condition.selected && <Check className="w-3 h-3 text-slate-900 font-bold" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <span className={`font-medium ${condition.selected ? 'text-amber-100' : 'text-slate-300'}`}>{condition.label}</span>
                                                <span className="text-[10px] uppercase bg-slate-800 px-2 py-0.5 rounded text-slate-500">{condition.category}</span>
                                            </div>
                                            {condition.selected && (
                                                <input
                                                    type="text"
                                                    value={condition.details || ''}
                                                    onChange={(e) => updateDetails(condition.id, e.target.value)}
                                                    placeholder="Add specific details..."
                                                    className="mt-2 w-full bg-slate-900/50 border border-slate-700 rounded px-2 py-1 text-sm text-slate-300 focus:outline-none focus:border-amber-500/50 placeholder:text-slate-600"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="w-full py-2 border border-dashed border-slate-600 rounded-lg text-slate-400 hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add Custom Condition
                    </button>
                </div>

                {/* Preview Panel */}
                <div className="p-6 bg-slate-900/30 flex flex-col">
                    <h4 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Order Preview</h4>
                    <div className="flex-1 bg-white text-slate-900 p-8 rounded shadow-lg font-serif text-sm leading-relaxed whitespace-pre-wrap">
                        {generateOrderText()}
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <button className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                            Copy Text
                        </button>
                        <button className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-medium rounded-lg hover:from-amber-500 hover:to-amber-400 shadow-lg shadow-amber-900/20 flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Generate Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BailConditionsBuilder;
