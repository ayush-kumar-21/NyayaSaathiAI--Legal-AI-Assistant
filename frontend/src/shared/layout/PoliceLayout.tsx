// src/shared/layout/PoliceLayout.tsx
// NyayaSahayak Hybrid v2.0.0 - Police Persona Layout Wrapper

import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import {
    LayoutDashboard,
    Lock,
    Map,
    Mic,
    LogOut,
    Menu,
    ChevronLeft,
    ChevronRight,
    FileWarning,
    Clock,
    Box,
    TrendingUp,
    Share2,
    FileText,
    Users,
    ClipboardList,
    Calendar,
    Building,
    Microscope,
    Fingerprint,
    Search,
    BarChart,
    Siren
} from 'lucide-react';
import PoliceNavSection, { NavSection } from '../../personas/police/components/sidebar/PoliceNavSection';

const PoliceLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // Navigation Sections
    const navSections: NavSection[] = [
        {
            title: 'Dashboard',
            items: [
                { path: '/police/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                { path: '/police/station', label: 'Station Overview', icon: Building }
            ],
            defaultOpen: true
        },
        {
            title: 'Crime Reporting',
            items: [
                { path: '/police/fir', label: 'Smart FIR', icon: Mic, skill: '01' },
                { path: '/police/fir-history', label: 'FIR Repository', icon: Search, skill: '01' },
                { path: '/police/financial', label: 'Financial Analyzer', icon: TrendingUp, skill: '02' }
            ]
        },
        {
            title: 'Case Management',
            items: [
                { path: '/police/evidence', label: 'Evidence Locker', icon: Lock, skill: '03' },
                { path: '/police/forensic', label: 'Forensic Interlock', icon: Microscope, skill: '08' },
                { path: '/police/hasher', label: 'Evidence Hasher', icon: Fingerprint, skill: '09' },
                { path: '/police/case-linker', label: 'Case Linker', icon: Share2, skill: '04' },
                { path: '/police/serial-offender', label: 'Serial Offenders', icon: Siren, skill: '14' }
            ]
        },
        {
            title: 'Investigation',
            items: [
                { path: '/police/investigation', label: 'Investigation Planner', icon: ClipboardList, skill: '07' },
                { path: '/police/investigation-gantt', label: 'Inv. Timeline', icon: BarChart, skill: '07' },
                { path: '/police/charge-sheet', label: 'Charge Sheet', icon: FileText, skill: '05' },
                { path: '/police/witness', label: 'Witness Protection', icon: Users, skill: '06' }
            ]
        },
        {
            title: 'Operations',
            items: [
                { path: '/police/warrants', label: 'Digital Warrants', icon: FileWarning, skill: '10' },
                { path: '/police/crime-scene', label: '3D Crime Scene', icon: Box },
                { path: '/police/patrol', label: 'Patrol Map', icon: Map }
            ]
        },
        {
            title: 'Personnel',
            items: [
                { path: '/police/roster', label: 'Duty Roster', icon: Calendar, skill: '11' }
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
            {/* Top Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-b border-blue-800/50 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Sidebar Toggle Button */}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <img src="/logo.png" alt="NyayaSahayak" className="w-8 h-8 rounded-lg shadow-md hover:scale-105 transition-transform" />
                        <div>
                            <span className="text-xl font-bold text-white tracking-wide">NyayaRakshak</span>
                            <span className="ml-2 text-[10px] bg-blue-600/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-wider">
                                Police Portal
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 hover:bg-slate-800/50 px-3 py-1.5 rounded-lg transition-all cursor-pointer group"
                                title="Profile & Settings"
                            >
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full border-2 border-blue-500/50 group-hover:border-blue-400 transition-colors"
                                />
                                <div className="text-right hidden sm:block">
                                    <span className="text-sm text-slate-200 block font-medium">{user.name}</span>
                                    {user.station && (
                                        <span className="text-xs text-blue-400">{user.station}</span>
                                    )}
                                </div>
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            aria-label="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content with Sidebar */}
            <div className="flex pt-16">
                {/* Sidebar Navigation - Collapsible */}
                <aside
                    className={`fixed left-0 top-16 bottom-0 bg-slate-900/95 border-r border-blue-800/30 transition-all duration-300 ease-in-out z-40 ${isSidebarCollapsed ? 'w-20' : 'w-64'
                        }`}
                >
                    {/* Inner Container for scroll */}
                    <div className="h-full flex flex-col">
                        {/* Collapse Toggle Button */}
                        <button
                            onClick={toggleSidebar}
                            className="absolute -right-3 top-6 p-1 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg transition-all z-50 hover:scale-110 border border-blue-400"
                            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {isSidebarCollapsed ? (
                                <ChevronRight className="w-3 h-3" />
                            ) : (
                                <ChevronLeft className="w-3 h-3" />
                            )}
                        </button>

                        <nav className="flex-1 overflow-y-auto py-4 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 hover:scrollbar-thumb-slate-600">
                            {navSections.map((section, index) => (
                                <PoliceNavSection
                                    key={index}
                                    section={section}
                                    isCollapsed={isSidebarCollapsed}
                                />
                            ))}
                        </nav>

                        {/* BNSS Timer Widget */}
                        {!isSidebarCollapsed && (
                            <div className="p-4">
                                <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4 relative overflow-hidden group hover:border-amber-500/40 transition-all">
                                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Clock className="w-12 h-12 text-amber-500" />
                                    </div>
                                    <div className="flex items-center gap-2 text-amber-400 mb-2 relative z-10">
                                        <Clock className="w-4 h-4" />
                                        <p className="text-xs font-bold uppercase tracking-wider">Investigation Due</p>
                                    </div>
                                    <p className="text-3xl font-bold text-white relative z-10">58 <span className="text-sm font-normal text-slate-400">Days</span></p>
                                    <div className="w-full bg-slate-800 h-1.5 mt-2 rounded-full overflow-hidden">
                                        <div className="bg-amber-500 h-full w-[65%]" />
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1">BNSS Compliance: On Track</p>
                                </div>
                            </div>
                        )}

                        {/* Collapsed Widget */}
                        {isSidebarCollapsed && (
                            <div className="p-2 pb-4">
                                <div className="bg-slate-800/50 border border-amber-500/20 rounded-xl p-2 text-center group hover:bg-slate-800 transition-colors cursor-help" title="58 Days remaining for Charge Sheet">
                                    <Clock className="w-5 h-5 text-amber-500 mx-auto mb-1 group-hover:animate-pulse" />
                                    <p className="text-sm font-bold text-white">58</p>
                                    <p className="text-[9px] text-slate-500">Days</p>
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PoliceLayout;
