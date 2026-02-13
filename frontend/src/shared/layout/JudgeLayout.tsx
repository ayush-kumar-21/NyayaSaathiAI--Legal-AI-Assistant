// src/shared/layout/JudgeLayout.tsx
// NyayaSaathiAI Hybrid v2.0.0 - Judge Persona Layout Wrapper

import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import {
    LayoutDashboard,
    Scale,
    PenTool,
    Briefcase,
    LogOut,
    FileText,
    Gavel,
    Menu,
    ChevronLeft,
    ChevronRight,
    Video,
    AlertTriangle,
    List,
    CheckCircle,
    History,
    Heart,
    Monitor,
    BookOpen,
    Calendar as CalendarIcon
} from 'lucide-react';
import JudgeNavSection, { NavSection } from '../../personas/judge/components/sidebar/JudgeNavSection';

const JudgeLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Navigation Sections
    const navSections: NavSection[] = [
        {
            title: 'Judicial Board',
            titleHi: 'न्यायिक बोर्ड',
            items: [
                { path: '/judge/board', label: 'Case Board', labelHi: 'केस बोर्ड', icon: LayoutDashboard },
                { path: '/judge/calendar', label: 'Court Calendar', labelHi: 'कोर्ट कैलेंडर', icon: CalendarIcon },
                { path: '/judge/queue', label: 'Case Queue', labelHi: 'केस कतार', icon: List, skill: 17 }
            ],
            defaultOpen: true
        },
        {
            title: 'Pre-Hearing',
            titleHi: 'सुनवाई से पहले',
            items: [
                { path: '/judge/bail', label: 'Bail Reckoner', labelHi: 'जमानत गणक', icon: Scale, skill: 12 },
                { path: '/judge/urgency', label: 'Urgency Matrix', labelHi: 'प्राथमिकता', icon: AlertTriangle }
            ]
        },
        {
            title: 'During Hearing',
            titleHi: 'सुनवाई के दौरान',
            items: [
                { path: '/judge/knowledge', label: 'Reference Library', labelHi: 'कानूनी ज्ञान', icon: BookOpen },
                { path: '/judge/bench-memo', label: 'Bench Memo', labelHi: 'बेंच मेमो', icon: FileText, skill: 14 },
                { path: '/judge/moot-court', label: 'Virtual Moot', labelHi: 'वर्चुअल मूट', icon: Video, skill: 15 },
                { path: '/judge/evidence', label: 'Evidence Vault', labelHi: 'साक्ष्य', icon: Briefcase }
            ]
        },
        {
            title: 'Post-Hearing',
            titleHi: 'सुनवाई के बाद',
            items: [
                { path: '/judge/sentencing', label: 'Sentencing', labelHi: 'सजा निर्धारण', icon: Gavel, skill: 13 },
                { path: '/judge/orders', label: 'Judicial Orders', labelHi: 'न्यायिक आदेश', icon: PenTool, skill: 16 },
                { path: '/judge/validate', label: 'Judgment Validator', labelHi: 'निर्णय सत्यापक', icon: CheckCircle }
            ]
        },
        {
            title: 'Judge Support',
            titleHi: 'न्यायाधीश सहायता',
            items: [
                { path: '/judge/wellness', label: 'Wellness', labelHi: 'कल्याण', icon: Heart, skill: 18 },
                { path: '/judge/virtual-court', label: 'Virtual Court', labelHi: 'ई-कोर्ट', icon: Monitor }
            ]
        }
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* 3D Wood Grain Background */}
            <div className="fixed inset-0 -z-10">
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
                    <defs>
                        <linearGradient id="judgeWood" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1a1510" />
                            <stop offset="30%" stopColor="#2d2318" />
                            <stop offset="70%" stopColor="#241c14" />
                            <stop offset="100%" stopColor="#1a1510" />
                        </linearGradient>
                        <pattern id="woodGrain" patternUnits="userSpaceOnUse" width="200" height="200">
                            <rect fill="url(#judgeWood)" width="200" height="200" />
                            <path d="M0,20 Q50,15 100,22 T200,18" stroke="#3a2d20" strokeWidth="0.5" fill="none" opacity="0.3" />
                            <path d="M0,50 Q70,45 140,55 T200,48" stroke="#3a2d20" strokeWidth="0.5" fill="none" opacity="0.3" />
                            <path d="M0,80 Q60,75 120,82 T200,78" stroke="#3a2d20" strokeWidth="0.5" fill="none" opacity="0.3" />
                            <path d="M0,110 Q80,105 160,115 T200,108" stroke="#3a2d20" strokeWidth="0.5" fill="none" opacity="0.3" />
                            <path d="M0,140 Q50,135 100,142 T200,138" stroke="#3a2d20" strokeWidth="0.5" fill="none" opacity="0.3" />
                            <path d="M0,170 Q70,165 140,175 T200,168" stroke="#3a2d20" strokeWidth="0.5" fill="none" opacity="0.3" />
                        </pattern>
                        <radialGradient id="judgeGlow" cx="30%" cy="30%" r="60%">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#1a1510" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#woodGrain)" />
                    <rect width="100%" height="100%" fill="url(#judgeGlow)" />
                </svg>
            </div>

            {/* Top Header - Senior Judge Friendly with Large Elements */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-slate-900/95 via-purple-950/90 to-slate-900/95 
                backdrop-blur-xl border-b-2 border-amber-700/50 shadow-2xl"
                style={{ boxShadow: '0 4px 30px rgba(168, 85, 247, 0.15)' }}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Sidebar Toggle Button */}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all"
                            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        {/* 3D Logo Effect */}
                        <div className="relative">
                            <img src="/logo.png" alt="NyayaSaathiAI"
                                className="w-12 h-12 rounded-xl shadow-lg"
                                style={{ boxShadow: '0 8px 20px rgba(168, 85, 247, 0.3)' }} />
                            <div className="absolute inset-0 rounded-xl bg-purple-500/20 animate-pulse" />
                        </div>
                        <div>
                            <span className="text-2xl font-bold text-white tracking-wide">NyayaAdhikari</span>
                            <span className="ml-3 text-sm bg-gradient-to-r from-amber-500/30 to-amber-600/30 
                                text-amber-300 px-3 py-1.5 rounded-full border border-amber-500/40 font-medium">
                                ⚖️ Judicial Portal
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {user && (
                            <Link
                                to="/profile"
                                className="flex items-center gap-3 hover:bg-white/5 px-4 py-2 rounded-xl transition-all cursor-pointer"
                                title="Profile & Settings"
                            >
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-12 h-12 rounded-full border-3 border-amber-500/50 shadow-lg"
                                    style={{ boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)' }}
                                />
                                <div className="text-right">
                                    <span className="text-lg text-white font-medium block">{user.name}</span>
                                    {user.courtId && (
                                        <span className="text-sm text-amber-400/80">{user.courtId}</span>
                                    )}
                                </div>
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="p-4 text-slate-400 hover:text-red-400 hover:bg-red-500/10 
                                rounded-xl transition-all text-lg"
                            aria-label="Logout"
                            style={{ minWidth: '52px', minHeight: '52px' }}
                        >
                            <LogOut className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content with 3D Glassmorphism Sidebar */}
            <div className="flex pt-20">
                {/* 3D Floating Sidebar - Collapsible */}
                {/* Outer container handles position and width transition - NO overflow hidden */}
                <aside
                    className={`fixed left-3 top-24 bottom-3 transition-all duration-300 ease-in-out z-40 ${isSidebarCollapsed ? 'w-20' : 'w-72'
                        }`}
                >
                    {/* Collapse Toggle Button - Positioned absolute relative to aside, outside the inner container */}
                    <button
                        onClick={toggleSidebar}
                        className="absolute -right-3 top-6 p-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-full shadow-lg transition-all z-50 hover:scale-110"
                        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isSidebarCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>

                    {/* Inner container handles background and overflow clipping */}
                    <div
                        className="w-full h-full rounded-2xl overflow-hidden flex flex-col relative"
                        style={{
                            background: 'linear-gradient(135deg, rgba(30, 20, 15, 0.95) 0%, rgba(45, 35, 24, 0.9) 100%)',
                            backdropFilter: 'blur(20px)',
                            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(168, 85, 247, 0.2)'
                        }}
                    >
                        {/* Decorative Gold Trim */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600/0 via-amber-500/60 to-amber-600/0" />

                        <nav className={`p-2 space-y-1 flex-1 overflow-y-auto ${isSidebarCollapsed ? 'pb-24' : 'pb-32'} scrollbar-thin scrollbar-thumb-amber-800/10`}>
                            {navSections.map((section, index) => (
                                <JudgeNavSection
                                    key={index}
                                    section={section}
                                    isCollapsed={isSidebarCollapsed}
                                />
                            ))}
                        </nav>

                        {/* Case Load Widget - 3D Card */}
                        {!isSidebarCollapsed && (
                            <div className="absolute bottom-4 left-4 right-4">
                                <div className="rounded-xl p-5"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)',
                                        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 10px 30px -10px rgba(168, 85, 247, 0.3)',
                                        border: '1px solid rgba(168, 85, 247, 0.3)'
                                    }}>
                                    <div className="flex items-center gap-3 text-amber-400 mb-3">
                                        <Scale className="w-6 h-6" />
                                        <p className="text-lg font-semibold">Today's Board</p>
                                    </div>
                                    <p className="text-4xl font-bold text-white mb-1">12 Cases</p>
                                    <p className="text-base text-amber-300/80">🔴 3 High Priority</p>
                                </div>
                            </div>
                        )}

                        {/* Collapsed Widget */}
                        {isSidebarCollapsed && (
                            <div className="absolute bottom-4 left-2 right-2">
                                <div className="rounded-xl p-2 text-center"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(217, 119, 6, 0.2) 100%)',
                                        border: '1px solid rgba(168, 85, 247, 0.3)'
                                    }}>
                                    <Scale className="w-5 h-5 text-amber-400 mx-auto mb-1" />
                                    <p className="text-lg font-bold text-white">12</p>
                                    <p className="text-[10px] text-slate-400">Cases</p>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className={`flex-1 p-8 transition-all duration-300 ${isSidebarCollapsed ? 'ml-24' : 'ml-80'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default JudgeLayout;
