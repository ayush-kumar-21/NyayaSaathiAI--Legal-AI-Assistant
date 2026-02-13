import React, { useState } from 'react';
import {
    CheckCircle, XCircle, HelpCircle, ArrowRight, RefreshCw,
    Shield, User, Scale, IndianRupee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCitizenTranslation } from '../../../features/citizen/hooks/useCitizenTranslation';
import AnimatedPageWrapper from '../../../features/main/components/common/AnimatedPageWrapper';

// ==========================================
// TYPES & DATA
// ==========================================
interface Question {
    id: string;
    text: string;
    icon: React.ReactNode;
    options: { label: string; value: string }[];
}

const QUESTIONS: Question[] = [
    {
        id: 'category',
        text: 'Which category do you belong to?',
        icon: <User className="w-6 h-6 text-emerald-400" />,
        options: [
            { label: 'Woman or Child', value: 'woman_child' },
            { label: 'SC / ST', value: 'sc_st' },
            { label: 'Industrial Workman', value: 'workman' },
            { label: 'Victim of Mass Disaster / Violence', value: 'victim' },
            { label: 'Disabled Person', value: 'disabled' },
            { label: 'Person in Custody', value: 'custody' },
            { label: 'General / Other', value: 'general' }
        ]
    },
    {
        id: 'income',
        text: 'What is your annual income?',
        icon: <IndianRupee className="w-6 h-6 text-emerald-400" />,
        options: [
            { label: 'Less than ₹3,00,000', value: 'low' },
            { label: '₹3,00,000 - ₹5,00,000', value: 'mid' },
            { label: 'More than ₹5,00,000', value: 'high' }
        ]
    },
    {
        id: 'case_type',
        text: 'What type of legal help do you need?',
        icon: <Scale className="w-6 h-6 text-emerald-400" />,
        options: [
            { label: 'Civil Dispute', value: 'civil' },
            { label: 'Criminal Defense', value: 'criminal' },
            { label: 'Family / Maintenance', value: 'family' },
            { label: 'Property / Land', value: 'property' }
        ]
    }
];

// ==========================================
// COMPONENT
// ==========================================
const EligibilityCheckerPage: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useCitizenTranslation();
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [result, setResult] = useState<'eligible' | 'not_eligible' | null>(null);

    const handleAnswer = (value: string) => {
        const newAnswers = { ...answers, [QUESTIONS[currentStep].id]: value };
        setAnswers(newAnswers);

        if (currentStep < QUESTIONS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            checkEligibility(newAnswers);
        }
    };

    const checkEligibility = (finalAnswers: Record<string, string>) => {
        // NALSA Section 12 Logic
        const isPriorityCategory = ['woman_child', 'sc_st', 'victim', 'disabled', 'custody', 'workman'].includes(finalAnswers.category);
        const isLowIncome = finalAnswers.income === 'low';

        // Logic: ANY priority category is eligible regardless of income (mostly), 
        // OR General category with Low Income (limit varies by state, using 3L as generic benchmark)
        if (isPriorityCategory || isLowIncome) {
            setResult('eligible');
        } else {
            setResult('not_eligible');
        }
    };

    const resetQuiz = () => {
        setCurrentStep(0);
        setAnswers({});
        setResult(null);
    };

    return (
        <AnimatedPageWrapper>
            <div className="max-w-4xl mx-auto p-4 md:p-8 min-h-[80vh] flex flex-col justify-center">

                {/* HEADER */}
                <div className="text-center mb-10">
                    <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 w-20 h-20 rounded-2xl mx-auto flex items-center justify-center mb-4 border border-emerald-500/30">
                        <Shield className="w-10 h-10 text-emerald-400" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Legal Aid Eligibility Check</h1>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Check if you qualify for free legal services provided by the National Legal Services Authority (NALSA) under Section 12 of the Act.
                    </p>
                </div>

                {/* QUIZ CONTENT */}
                <div className="max-w-2xl mx-auto w-full">
                    <AnimatePresence mode="wait">
                        {!result && (
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 md:p-10 shadow-2xl"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-slate-800 rounded-xl">
                                        {QUESTIONS[currentStep].icon}
                                    </div>
                                    <h2 className="text-xl font-semibold text-white">
                                        {QUESTIONS[currentStep].text}
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    {QUESTIONS[currentStep].options.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleAnswer(option.value)}
                                            className="w-full text-left p-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                                        >
                                            <span className="text-slate-200 group-hover:text-white">{option.label}</span>
                                            <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 opacity-0 group-hover:opacity-100 transition-all" />
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-8 flex justify-between items-center text-xs text-slate-500">
                                    <span>Question {currentStep + 1} of {QUESTIONS.length}</span>
                                    <div className="flex gap-1">
                                        {QUESTIONS.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`w-2 h-2 rounded-full ${idx === currentStep ? 'bg-emerald-500' : idx < currentStep ? 'bg-emerald-800' : 'bg-slate-800'}`}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {result === 'eligible' && (
                            <motion.div
                                key="eligible"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-gradient-to-b from-emerald-900/40 to-slate-900/60 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-8 text-center shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                            >
                                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/40 animate-pulse">
                                    <CheckCircle className="w-12 h-12 text-white" />
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-2">You are Eligible!</h2>
                                <p className="text-emerald-300 font-medium text-lg mb-6">
                                    Based on your inputs, you qualify for Free Legal Aid under NALSA regulations.
                                </p>
                                <div className="bg-slate-900/50 rounded-xl p-4 mb-8 text-left max-w-md mx-auto border border-slate-700">
                                    <h4 className="text-slate-300 text-sm font-semibold mb-2">What you get:</h4>
                                    <ul className="space-y-2 text-sm text-slate-400">
                                        <li className="flex gap-2">✓ Free services of a lawyer in court</li>
                                        <li className="flex gap-2">✓ No court fees or process fees</li>
                                        <li className="flex gap-2">✓ Free preparation of appeal/case papers</li>
                                    </ul>
                                </div>
                                <button
                                    onClick={() => navigate('/citizen/legal-aid')}
                                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:scale-105"
                                >
                                    Apply for Legal Aid Now
                                </button>
                                <button
                                    onClick={resetQuiz}
                                    className="block mx-auto mt-4 text-slate-500 hover:text-white text-sm"
                                >
                                    Check for someone else
                                </button>
                            </motion.div>
                        )}

                        {result === 'not_eligible' && (
                            <motion.div
                                key="not_eligible"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 text-center"
                            >
                                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <XCircle className="w-10 h-10 text-slate-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">You may not be eligible</h2>
                                <p className="text-slate-400 mb-6">
                                    Based on standard criteria, you might not automatically qualify for free legal aid. However, exceptions exist.
                                </p>
                                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
                                    <button onClick={() => navigate('/citizen/bot')} className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
                                        <HelpCircle className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
                                        <span className="block text-sm font-medium text-slate-300">Ask NyayaBot</span>
                                    </button>
                                    <button onClick={() => navigate('/citizen/predict')} className="p-4 bg-slate-800 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
                                        <Scale className="w-6 h-6 text-amber-400 mx-auto mb-2" />
                                        <span className="block text-sm font-medium text-slate-300">Predict Cost</span>
                                    </button>
                                </div>
                                <button
                                    onClick={resetQuiz}
                                    className="flex items-center gap-2 mx-auto text-slate-400 hover:text-emerald-400 transition-colors"
                                >
                                    <RefreshCw className="w-4 h-4" /> Check Again
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AnimatedPageWrapper>
    );
};

export default EligibilityCheckerPage;
