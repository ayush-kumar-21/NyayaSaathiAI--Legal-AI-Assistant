import React, { useState, Suspense } from 'react';
import { useCitizenTranslation } from '../../../features/citizen/hooks/useCitizenTranslation';
import ParticleHeader from '../../../shared/components/3d/ParticleHeader';
import {
    Gavel, FileText, Sparkles, Scale, PlusCircle,
    LayoutDashboard, Mic, PenTool
} from 'lucide-react';
import LoadingFallback from '../../../core/components/ui/LoadingFallback';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load the sub-components
const LegalTechHubWrapper = React.lazy(() => import('../../../features/common/wrappers/LegalTechHubWrapper'));
const CitizenComplaint = React.lazy(() => import('../../../personas/citizen/pages/CitizenComplaint'));
const FilingDashboard = React.lazy(() => import('../../../personas/citizen/pages/FilingDashboard'));

const LegalActionCenter: React.FC = () => {
    const { t } = useCitizenTranslation();
    const [activeTab, setActiveTab] = useState<'complaint' | 'filings' | 'tools'>('complaint');

    const tabs = [
        {
            id: 'complaint',
            label: t('tab_new_complaint'),
            subLabel: t('tab_voice_text'),
            icon: Mic,
            color: 'from-emerald-500 to-teal-600',
            shadow: 'shadow-emerald-500/25'
        },
        {
            id: 'filings',
            label: t('tab_my_filings'),
            subLabel: t('tab_track_status'),
            icon: LayoutDashboard,
            color: 'from-blue-500 to-indigo-600',
            shadow: 'shadow-blue-500/25'
        },
        {
            id: 'tools',
            label: t('tab_legal_tools'),
            subLabel: t('tab_ai_drafting'),
            icon: Sparkles,
            color: 'from-purple-500 to-pink-600',
            shadow: 'shadow-purple-500/25'
        }
    ];

    return (
        <div className="space-y-6 pb-20 min-h-screen">
            {/* Header Section */}
            <ParticleHeader
                title={t('legal_action_center')}
                subtitle={t('legal_action_subtitle')}
                icon={<Scale className="w-8 h-8 text-emerald-400" />}
                variant="emerald"
            />

            {/* Simplified Tab Navigation - Large & Accessible */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-slate-900/80 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl grid grid-cols-1 md:grid-cols-3 gap-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`
                                    relative overflow-hidden group p-4 rounded-xl transition-all duration-300 text-left border
                                    ${isActive
                                        ? `bg-slate-800 border-slate-600 shadow-lg`
                                        : 'bg-transparent border-transparent hover:bg-white/5'
                                    }
                                `}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-0 transition-opacity duration-300 ${isActive ? 'opacity-10' : 'group-hover:opacity-5'}`} />

                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`
                                        p-3 rounded-xl transition-all duration-300
                                        ${isActive
                                            ? `bg-gradient-to-br ${tab.color} text-white shadow-lg ${tab.shadow}`
                                            : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white'
                                        }
                                    `}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className={`font-bold transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                                            {tab.label}
                                        </h3>
                                        <p className="text-xs text-slate-500 font-medium">
                                            {tab.subLabel}
                                        </p>
                                    </div>
                                </div>

                                {/* Active Indicator Bar */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${tab.color}`}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[600px] mt-8">
                <Suspense fallback={<LoadingFallback message="Loading Module..." />}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'complaint' && <CitizenComplaint />}
                            {activeTab === 'filings' && <FilingDashboard />}
                            {activeTab === 'tools' && <LegalTechHubWrapper />}
                        </motion.div>
                    </AnimatePresence>
                </Suspense>
            </div>
        </div>
    );
};

export default LegalActionCenter;
