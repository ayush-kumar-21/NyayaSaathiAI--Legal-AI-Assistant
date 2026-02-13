import React, { useState } from 'react';
import {
    User, FileText, Upload, CheckCircle, ArrowRight, ArrowLeft,
    Shield, Briefcase, Camera, Mic, Save, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCitizenTranslation } from '../../../features/citizen/hooks/useCitizenTranslation';
import AnimatedPageWrapper from '../../../features/main/components/common/AnimatedPageWrapper';

// ==========================================
// TYPES
// ==========================================
interface CaseFilingData {
    // Step 1: Petitioner
    petitionerName: string;
    petitionerRelation: string;
    petitionerAddress: string;
    petitionerContact: string;

    // Step 2: Respondent
    respondentName: string;
    respondentAddress: string;
    respondentRole: string;

    // Step 3: Case Facts
    caseTitle: string;
    caseDescription: string;
    incidentDate: string;
    location: string;

    // Step 4: Documents (Simulated)
    documents: string[]; // file names
}

const STEPS = [
    { id: 1, title: 'Petitioner Info', icon: User },
    { id: 2, title: 'Respondent Info', icon: User },
    { id: 3, title: 'Case Facts', icon: FileText },
    { id: 4, title: 'Evidence', icon: Upload },
    { id: 5, title: 'Review & Sign', icon: CheckCircle },
];

const EFilingWizard: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useCitizenTranslation();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<CaseFilingData>({
        petitionerName: '',
        petitionerRelation: 'Self',
        petitionerAddress: '',
        petitionerContact: '',
        respondentName: '',
        respondentAddress: '',
        respondentRole: 'Accused',
        caseTitle: '',
        caseDescription: '',
        incidentDate: '',
        location: '',
        documents: []
    });

    const handleNext = () => {
        if (currentStep < 5) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        // Simulate API call
        setTimeout(() => {
            navigate('/citizen/file', { state: { success: true } });
        }, 1500);
    };

    const updateField = (field: keyof CaseFilingData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Render Steps
    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white mb-6">1. Petitioner Details (Your Info)</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={formData.petitionerName}
                                    onChange={(e) => updateField('petitionerName', e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-emerald-500"
                                    placeholder="e.g. Rajesh Kumar"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Filing As</label>
                                <select
                                    value={formData.petitionerRelation}
                                    onChange={(e) => updateField('petitionerRelation', e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-3"
                                >
                                    <option>Self</option>
                                    <option>Parent/Guardian</option>
                                    <option>Authorized Representative</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm text-slate-400 mb-1">Address</label>
                                <textarea
                                    value={formData.petitionerAddress}
                                    onChange={(e) => updateField('petitionerAddress', e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-3 h-24"
                                    placeholder="Enter full address"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Contact Number</label>
                                <input
                                    type="tel"
                                    value={formData.petitionerContact}
                                    onChange={(e) => updateField('petitionerContact', e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-3"
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white mb-6">2. Respondent Details (Opposing Party)</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Respondent Name</label>
                                <input
                                    type="text"
                                    value={formData.respondentName}
                                    onChange={(e) => updateField('respondentName', e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Name of person/entity"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Role</label>
                                <select
                                    value={formData.respondentRole}
                                    onChange={(e) => updateField('respondentRole', e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-3"
                                >
                                    <option>Accused</option>
                                    <option>Defendant</option>
                                    <option>Respondent</option>
                                    <option>State</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm text-slate-400 mb-1">Known Address (Optional)</label>
                                <textarea
                                    value={formData.respondentAddress}
                                    onChange={(e) => updateField('respondentAddress', e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-3 h-24"
                                    placeholder="Enter address if known"
                                />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white mb-6">3. Case Facts</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Case Title/Subject</label>
                                <input
                                    type="text"
                                    value={formData.caseTitle}
                                    onChange={(e) => updateField('caseTitle', e.target.value)}
                                    className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-3 focus:ring-2 focus:ring-emerald-500"
                                    placeholder="e.g. Theft of Vehicle DL-01-AB-1234"
                                />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Incident Date</label>
                                    <input
                                        type="date"
                                        value={formData.incidentDate}
                                        onChange={(e) => updateField('incidentDate', e.target.value)}
                                        className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Location of Incident</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => updateField('location', e.target.value)}
                                        className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-3"
                                        placeholder="City / District"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Detailed Description (Facts)</label>
                                <div className="relative">
                                    <textarea
                                        value={formData.caseDescription}
                                        onChange={(e) => updateField('caseDescription', e.target.value)}
                                        className="w-full bg-slate-800 border-slate-700 text-white rounded-lg p-3 h-48"
                                        placeholder="Describe the incident deeply..."
                                    />
                                    <button className="absolute bottom-4 right-4 p-2 bg-emerald-600 rounded-full text-white hover:bg-emerald-500 transition-colors" title="Use Voice Input">
                                        <Mic size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-white mb-6">4. Upload Evidence</h3>
                        <div className="border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center hover:bg-slate-800/50 transition-colors cursor-pointer">
                            <Upload className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                            <p className="text-lg text-slate-300 font-medium">Click to upload or drag files here</p>
                            <p className="text-sm text-slate-500 mt-2">Supports PDF, JPG, PNG, MP4 (Max 50MB)</p>
                            <p className="text-xs text-slate-600 mt-4">Safe & Secure Upload encrypted with AES-256</p>
                        </div>

                        <div className="mt-6 space-y-3">
                            <h4 className="text-sm text-slate-400 uppercase tracking-wider font-bold">Attached Documents</h4>
                            <div className="bg-slate-900 rounded-lg p-4 flex items-center justify-between border border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/20 rounded text-red-400">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-white font-medium">Aadhaar_Card_Front.jpg</p>
                                        <p className="text-xs text-slate-500">2.4 MB • Uploaded just now</p>
                                    </div>
                                </div>
                                <button className="text-slate-500 hover:text-red-400"><X size={18} /></button>
                            </div>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6 text-center py-8">
                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                            <CheckCircle className="w-10 h-10 text-emerald-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Review & e-Sign</h3>
                        <p className="text-slate-400 max-w-lg mx-auto">
                            Please review your application details. By clicking "Submit", you legally affirm that the information provided is true to the best of your knowledge.
                        </p>

                        <div className="bg-slate-900/50 text-left p-6 rounded-2xl border border-slate-700 max-w-2xl mx-auto space-y-4">
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400">Petitioner</span>
                                <span className="text-white font-medium">{formData.petitionerName}</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400">Case Type</span>
                                <span className="text-white font-medium">General Complaint (BNS)</span>
                            </div>
                            <div className="flex justify-between border-b border-slate-800 pb-2">
                                <span className="text-slate-400">Respondent</span>
                                <span className="text-white font-medium">{formData.respondentName || 'Unknown'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Documents</span>
                                <span className="text-white font-medium">1 Attached</span>
                            </div>
                        </div>

                        <div className="pt-4">
                            <label className="flex items-center justify-center gap-3 text-sm text-slate-300 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500" />
                                <span>I agree to the Terms of Service and e-Filing Declaration</span>
                            </label>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AnimatedPageWrapper>
            <div className="max-w-5xl mx-auto p-4 md:p-8">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/citizen/home')}
                            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Briefcase className="w-6 h-6 text-emerald-400" /> e-Filing Wizard 2.0
                            </h1>
                            <p className="text-sm text-slate-400">Step {currentStep} of 5</p>
                        </div>
                    </div>
                    <div className="hidden md:block px-4 py-2 bg-amber-500/10 text-amber-400 text-sm rounded-lg border border-amber-500/20">
                        Draft Auto-Saved
                    </div>
                </div>

                {/* STEPS INDICATOR */}
                <div className="mb-10">
                    <div className="flex justify-between relative">
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -z-10 transform -translate-y-1/2"></div>
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-emerald-500 -z-10 transform -translate-y-1/2 transition-all duration-500"
                            style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
                        ></div>

                        {STEPS.map((step) => {
                            const isActive = step.id === currentStep;
                            const isCompleted = step.id < currentStep;

                            return (
                                <div key={step.id} className="flex flex-col items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 
                                            ${isActive ? 'bg-emerald-600 border-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/30' :
                                                isCompleted ? 'bg-emerald-900 border-emerald-500 text-emerald-400' :
                                                    'bg-slate-900 border-slate-700 text-slate-500'}`}
                                    >
                                        {isCompleted ? <CheckCircle size={20} /> : <step.icon size={18} />}
                                    </div>
                                    <span className={`mt-2 text-xs font-medium ${isActive ? 'text-emerald-400' : 'text-slate-500'} hidden md:block`}>
                                        {step.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CONTENT CARD */}
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-10 shadow-2xl min-h-[400px]"
                >
                    {renderStepContent()}
                </motion.div>

                {/* FOOTER ACTIONS */}
                <div className="flex justify-between mt-8">
                    <button
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2
                            ${currentStep === 1
                                ? 'opacity-0 cursor-default'
                                : 'bg-slate-800 hover:bg-slate-700 text-white'}`}
                    >
                        <ArrowLeft size={20} /> Back
                    </button>

                    {currentStep === 5 ? (
                        <button
                            onClick={handleSubmit}
                            className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all transform hover:scale-105"
                        >
                            <Save size={20} /> Submit Application
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all transform hover:scale-105"
                        >
                            Next Step <ArrowRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </AnimatedPageWrapper>
    );
};

export default EFilingWizard;
