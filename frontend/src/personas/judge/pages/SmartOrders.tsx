import React, { useState } from 'react';
import { PenTool, FileText, Wand2, Calculator, Check, CheckCircle, Save, Printer, Share2, AlertCircle } from 'lucide-react';

const SmartOrders: React.FC = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('Bail Order');
    const [orderContent, setOrderContent] = useState(
        `IN THE COURT OF THE JUDICIAL MAGISTRATE FIRST CLASS, NEW DELHI

Case No: CRL-2026-1045
State vs. Rahul Sharma
U/S: 379 BNS (Theft)

ORDER ON BAIL APPLICATION

1. This is an application under Section 480 of BNSS for grant of bail to the applicant/accused Rahul Sharma, arrested on 10.02.2026 in connection with FIR No. 45/2026 registered at PS Connaught Place.

2. Heard Ld. APP for the State and Ld. Counsel for the applicant.

3. Ld. Counsel for the applicant submits that the applicant has been falsely implicated...

[AI GENERATING ARGUMENTS...]`
    );

    const [isGenerating, setIsGenerating] = useState(false);

    const handleAIEnhance = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setOrderContent(prev => prev.replace('[AI GENERATING ARGUMENTS...]',
                `3. Ld. Counsel for the applicant submits that the applicant has been falsely implicated and is in custody since 10.02.2026. The alleged recovery has already been effected. The applicant has clean antecedents and is the sole breadwinner of his family.

4. On the other hand, Ld. APP opposes the bail application on the ground that the investigation is at a nascent stage and the accused may influence witnesses if released.

5. Considering the facts and circumstances, specifically that the recovery is effected and the offence is triable by Magistrate, no useful purpose would be served by keeping the accused in further incarceration.

6. Accordingly, the applicant is admitted to bail on furnishing a personal bond in the sum of ₹20,000/- with one surety of the like amount, subject to the following conditions:
   (a) H shall not hamper with the investigation.
   (b) He shall attend the court on each and every date.
   (c) He shall not leave the country without prior permission of the court.

Application stands disposed of.`));
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="flex h-[calc(100vh-8rem)] gap-6">
            {/* Sidebar Tools */}
            <div className="w-80 flex flex-col gap-6">

                {/* Templates */}
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex-1 overflow-y-auto">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Order Templates
                    </h3>
                    <div className="space-y-2">
                        {['Bail Order', 'Remand Order', 'Summons Order', 'Warrant of Arrest', 'Production Warrant', 'Acquittal Judgment', 'Conviction Judgment'].map(t => (
                            <button
                                key={t}
                                onClick={() => setSelectedTemplate(t)}
                                className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${selectedTemplate === t
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : 'text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                {/* AI Tools */}
                <div className="bg-gradient-to-br from-purple-900/30 to-slate-900 border border-purple-500/30 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Wand2 className="w-4 h-4" /> AI Assistant
                    </h3>
                    <div className="space-y-3">
                        <button
                            onClick={handleAIEnhance}
                            disabled={isGenerating}
                            className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isGenerating ? 'Drafting...' : 'Auto-Draft Order'}
                        </button>
                        <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                            <CheckCircle className="w-4 h-4" /> Verify Citations
                        </button>
                        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                            <div className="flex justify-between text-xs text-slate-400 mb-1">
                                <span>Risk Score</span>
                                <span>Low</span>
                            </div>
                            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div className="w-[30%] h-full bg-green-500"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden relative">
                {/* Toolbar */}
                <div className="h-14 border-b bg-slate-50 flex items-center px-4 justify-between">
                    <div className="flex items-center gap-1">
                        <span className="font-serif font-bold text-slate-700 px-2">{selectedTemplate}</span>
                        <span className="h-4 w-px bg-slate-300 mx-2"></span>
                        <div className="flex gap-1">
                            <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><span className="font-bold">B</span></button>
                            <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><span className="italic">I</span></button>
                            <button className="p-1.5 text-slate-500 hover:bg-slate-200 rounded"><span className="underline">U</span></button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400 mr-2">Last saved: Just now</span>
                        <button className="p-2 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors" title="Print">
                            <Printer className="w-4 h-4" />
                        </button>
                        <button className="px-4 py-1.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 flex items-center gap-2">
                            <Save className="w-4 h-4" /> Save
                        </button>
                        <button className="px-4 py-1.5 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-500 shadow-lg shadow-amber-900/20 flex items-center gap-2">
                            <PenTool className="w-4 h-4" /> Sign & Issue
                        </button>
                    </div>
                </div>

                {/* Editor */}
                <textarea
                    className="flex-1 w-full p-8 font-serif text-lg leading-relaxed text-slate-800 resize-none focus:outline-none"
                    value={orderContent}
                    onChange={(e) => setOrderContent(e.target.value)}
                    spellCheck="false"
                />

                {/* Floating Suggestions */}
                {isGenerating && (
                    <div className="absolute bottom-8 right-8 bg-purple-900/90 text-white px-4 py-3 rounded-xl shadow-xl backdrop-blur-md flex items-center gap-3 animate-bounce">
                        <Wand2 className="w-5 h-5 animate-spin" />
                        AI is drafting legal arguments based on case facts...
                    </div>
                )}
            </div>
        </div>
    );
};

export default SmartOrders;
