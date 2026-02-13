// src/shared/layout/AdminLayout.tsx
// NyayaSahayak Hybrid v2.0.0 - Admin Persona Layout Wrapper
// Updated for LegalOS 4.0 Sidebar Structure

import React, { useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../core/auth/AuthContext';
import {
    LayoutDashboard,
    PieChart,
    Map,
    TrendingUp,
    FileText,
    History,
    Fingerprint,
    LogOut,
    Menu,
    ChevronLeft,
    ChevronRight,
    Cpu,
    Activity,
    FileCheck,
    Layers,
    FilePlus,
    BarChart3,
    Calendar,
    LayoutGrid,
    Save,
    ClipboardList,
    LucideIcon
} from 'lucide-react';
import CollapsibleNavSection from '../../personas/admin/components/sidebar/CollapsibleNavSection';

interface NavSection {
    title: string;
    items: Array<{
        path: string;
        label: string;
        icon: LucideIcon;
    }>;
}

const AdminLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    // LegalOS 4.0 Sidebar Structure
    const navSections: NavSection[] = [
        {
            title: 'Dashboard',
            items: [
                { path: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard }
            ]
        },
        {
            title: 'Registry Automator',
            items: [
                { path: '/admin/registry', label: 'Document Scrutiny', icon: FileCheck },
                { path: '/admin/registry/batch', label: 'Batch Processing', icon: Layers },
                { path: '/admin/registry/templates', label: 'Filing Templates', icon: FilePlus },
                { path: '/admin/registry/analytics', label: 'Analytics', icon: BarChart3 }
            ]
        },
        {
            title: 'Listing Optimizer',
            items: [
                { path: '/admin/listing', label: 'Daily Scheduling', icon: Calendar },
                { path: '/admin/listing/multi-court', label: 'Multi-Court View', icon: LayoutGrid },
                { path: '/admin/listing/templates', label: 'Templates', icon: Save },
                { path: '/admin/listing/history', label: 'History', icon: History }
            ]
        },
        {
            title: 'Analytics',
            items: [
                { path: '/admin/pendency', label: 'Pendency Map', icon: Map },
                { path: '/admin/transition', label: 'BNS Transition', icon: TrendingUp },
                { path: '/admin/analysis', label: 'Document Analysis', icon: PieChart }
            ]
        },
        {
            title: 'System',
            items: [
                { path: '/admin/resources', label: 'Resource Allocator', icon: Cpu },
                { path: '/admin/history', label: 'Activity Log', icon: ClipboardList }, // Changed path from /admin/audit to match existing route if any, or create new. Plan said /admin/audit. Let's check App.tsx. App.tsx line 297 says /admin/history. I will stick to /admin/history for now to avoid breaking changes, or update App.tsx? Plan says /admin/audit for Activity Log. Existing is /admin/history. I will use /admin/audit in the sidebar and UPDATE App.tsx to match or redirect.
                // Wait, App.tsx line 297: <Route path="history" element={<HistoryWrapper />} />
                // The plan calls for Activity Log at /admin/audit. 
                // I will use /admin/history in the sidebar to match the existing route for now, 
                // but the requested page content ActivityLogPage might be new.
                // Let's use /admin/audit in sidebar and I will add the route in Phase 4.
                { path: '/admin/audit', label: 'Activity Log', icon: ClipboardList },
                { path: '/admin/infrastructure', label: 'System Health', icon: Activity }, // Plan says /admin/health. Existing is /admin/infrastructure. I will use /admin/health and update route later.
                { path: '/admin/quantum', label: 'Quantum Verify', icon: Fingerprint }
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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900">
            {/* Top Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-amber-700/50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Sidebar Toggle Button */}
                        <button
                            onClick={toggleSidebar}
                            className="p-2 text-slate-400 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-all"
                            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <img src="/logo.png" alt="NyayaSahayak" className="w-8 h-8 rounded-lg" />
                        <span className="text-xl font-bold text-white">NyayaPrashaasak</span>
                        <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full">
                            Admin Portal
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                                title="Profile & Settings"
                            >
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full border-2 border-amber-500"
                                />
                                <div className="text-right">
                                    <span className="text-sm text-slate-300 block">{user.name}</span>
                                    {user.department && (
                                        <span className="text-xs text-slate-500">{user.department}</span>
                                    )}
                                </div>
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
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
                    className={`fixed left-0 top-16 bottom-0 bg-slate-800/50 border-r border-amber-700/30 p-2 overflow-y-auto custom-scrollbar transition-all duration-300 ease-in-out z-40 ${isSidebarCollapsed ? 'w-16' : 'w-64'
                        }`}
                >
                    {/* Collapse Toggle Button - Floating */}
                    <button
                        onClick={toggleSidebar}
                        className="absolute -right-3 top-6 p-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-full shadow-lg transition-all z-50 hidden md:block"
                        aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isSidebarCollapsed ? (
                            <ChevronRight className="w-3 h-3" />
                        ) : (
                            <ChevronLeft className="w-3 h-3" />
                        )}
                    </button>

                    <div className="space-y-4 mt-2">
                        {navSections.map((section, idx) => (
                            <CollapsibleNavSection
                                key={idx}
                                section={section}
                                isCollapsed={isSidebarCollapsed}
                            />
                        ))}
                    </div>

                    {/* System Status Widget */}
                    {!isSidebarCollapsed && (
                        <div className="mt-8 mx-2 mb-4">
                            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4">
                                <div className="flex items-center gap-2 text-green-400 mb-2">
                                    <PieChart className="w-4 h-4" />
                                    <p className="text-sm font-medium">BNS Adoption</p>
                                </div>
                                <p className="text-2xl font-bold text-white">67%</p>
                                <p className="text-xs text-slate-400">National Average</p>
                            </div>
                        </div>
                    )}
                </aside>

                {/* Main Content Area */}
                <main className={`flex-1 p-6 transition-all duration-300 min-h-[calc(100vh-4rem)] ${isSidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
